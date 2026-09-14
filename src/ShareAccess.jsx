import { useEffect, useState } from 'react';
import { SHARE_PUBLIC_KEY } from './share-public-key.js';

const MAX_TOKEN_LIFETIME_SECONDS = 3 * 24 * 60 * 60;
const CLOCK_SKEW_SECONDS = 5 * 60;

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), character => character.charCodeAt(0));
}

function decodePayload(encodedPayload) {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload)));
}

export async function resolveShareAccess() {
  const token = new URLSearchParams(window.location.search).get('share');
  if (!token) return { status: 'permanent' };

  const [encodedPayload, encodedSignature, extra] = token.split('.');
  if (!encodedPayload || !encodedSignature || extra || !SHARE_PUBLIC_KEY || !window.crypto?.subtle) {
    return { status: 'invalid' };
  }

  try {
    const publicKey = await window.crypto.subtle.importKey(
      'jwk',
      SHARE_PUBLIC_KEY,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify'],
    );
    const signatureValid = await window.crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      publicKey,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(encodedPayload),
    );
    if (!signatureValid) return { status: 'invalid' };

    const payload = decodePayload(encodedPayload);
    const now = Math.floor(Date.now() / 1000);
    const structurallyValid = payload.v === 1
      && payload.purpose === 'portfolio-preview'
      && Number.isSafeInteger(payload.iat)
      && Number.isSafeInteger(payload.exp)
      && typeof payload.jti === 'string'
      && payload.jti.length >= 16
      && payload.iat <= now + CLOCK_SKEW_SECONDS
      && payload.exp > payload.iat
      && payload.exp - payload.iat <= MAX_TOKEN_LIFETIME_SECONDS;

    if (!structurallyValid) return { status: 'invalid' };
    if (payload.exp <= now) return { status: 'expired', expiresAt: payload.exp * 1000 };
    return { status: 'temporary', expiresAt: payload.exp * 1000 };
  } catch {
    return { status: 'invalid' };
  }
}

function formatRemaining(expiresAt) {
  const remainingMinutes = Math.max(0, Math.ceil((expiresAt - Date.now()) / 60000));
  const days = Math.floor(remainingMinutes / 1440);
  const hours = Math.floor((remainingMinutes % 1440) / 60);
  const minutes = remainingMinutes % 60;
  if (days > 0) return `${days} 天 ${hours} 小时`;
  if (hours > 0) return `${hours} 小时 ${minutes} 分钟`;
  return `${minutes} 分钟`;
}

export function TemporaryAccessBadge({ expiresAt }) {
  const [, updateClock] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => updateClock(value => value + 1), 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <aside className="temporary-access-badge" aria-label="临时访问链接状态">
      <span aria-hidden="true" />
      <div>
        <strong>临时预览</strong>
        <small>剩余 {formatRemaining(expiresAt)}</small>
      </div>
    </aside>
  );
}

export function ShareAccessMessage({ status, expiresAt }) {
  const expired = status === 'expired';
  return (
    <main className="share-access-message">
      <div className="share-access-grid" aria-hidden="true" />
      <p className="share-access-brand">DERAN<sup>®</sup></p>
      <section>
        <p className="share-access-index">ACCESS / 访问状态</p>
        <h1>{expired ? 'THIS LINK HAS EXPIRED.' : 'THIS LINK IS INVALID.'}</h1>
        <h2>{expired ? '此临时链接已过期' : '此临时链接无效'}</h2>
        <p>
          {expired
            ? '请联系 Deran 获取新的作品集访问链接。'
            : '链接可能不完整或已被修改，请向 Deran 确认。'}
        </p>
        {expired && expiresAt ? (
          <time dateTime={new Date(expiresAt).toISOString()}>
            失效时间：{new Date(expiresAt).toLocaleString('zh-CN', { hour12: false })}
          </time>
        ) : null}
      </section>
      <p className="share-access-footer">2026 DESIGN PORTFOLIO</p>
    </main>
  );
}
