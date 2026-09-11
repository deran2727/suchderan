import { useEffect, useRef, useState } from 'react';
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl';
import './WarpText.css';

const vertex = `#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position,0.0,1.0);}`;

const fragment = `#version 300 es
precision highp float;
uniform sampler2D uTextTexture; uniform vec2 uResolution,uPointer; uniform float uPointerActive,uTime,uWarpStrength,uWarpScale,uSpeed,uPointerInfluence,uPointerStrength,uRefraction,uRipple,uMotion;
in vec2 vUv; out vec4 fragColor;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float value=0.,amplitude=.5;for(int i=0;i<4;i++){value+=amplitude*noise(p);p*=2.02;amplitude*=.5;}return value;}
vec4 sampleText(vec2 uv){if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)return vec4(0.);return texture(uTextTexture,uv);}
void main(){vec2 uv=vUv;float aspect=uResolution.x/max(uResolution.y,1.),time=uTime*uSpeed,scale=max(uWarpScale,.001);vec2 drift=vec2(time*.055,-time*.045);float n1=fbm(uv*scale*3.1+drift),n2=fbm((uv+19.17)*scale*3.4-drift.yx);vec2 ambient=(vec2(n1,n2)-.5)*uWarpStrength*.045*uMotion;vec2 pointerDelta=uv-uPointer,aspectDelta=vec2(pointerDelta.x*aspect,pointerDelta.y);float dist=length(aspectDelta),radius=max(uPointerInfluence,.001),t=clamp(dist/radius,0.,1.),lens=smoothstep(radius,0.,dist)*uPointerActive,bulge=t*(1.-t)*(1.-t)*6.75*uPointerActive;vec2 dir=dist>.0001?vec2(aspectDelta.x/aspect,aspectDelta.y)/dist:vec2(0.);float rippleWave=sin(dist*28.-time*4.2)*.5+.5,rippleRing=(rippleWave-.5)*uRipple;vec2 pointerWarp=-dir*bulge*uPointerStrength*.045;pointerWarp+=dir*rippleRing*bulge*uPointerStrength*.016;vec2 displaced=uv+ambient+pointerWarp,splitDir=ambient+pointerWarp;float splitLen=length(splitDir);splitDir=splitLen>.00001?splitDir/splitLen:vec2(.7071);vec2 split=splitDir*uRefraction*.16*(.35+lens*1.65);vec4 base=sampleText(displaced);float r=sampleText(displaced+split).r,g=base.g,b=sampleText(displaced-split).b,a=max(max(sampleText(displaced+split).a,base.a),sampleText(displaced-split).a);fragColor=vec4(vec3(r,g,b)+lens*base.a*.055,a);}`;

const cssValue = value => typeof value === 'number' ? `${value}px` : value;

function rasterizeText(container, width, height, dpr, props) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const probe = document.createElement('span');
  probe.textContent = props.text;
  Object.assign(probe.style, { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre', fontFamily: props.fontFamily, fontSize: cssValue(props.fontSize), fontWeight: String(props.fontWeight), letterSpacing: cssValue(props.letterSpacing), lineHeight: String(props.lineHeight) });
  container.appendChild(probe);
  const computed = getComputedStyle(probe);
  let fontSize = parseFloat(computed.fontSize) || 96;
  let letterSpacing = computed.letterSpacing === 'normal' ? 0 : parseFloat(computed.letterSpacing) || 0;
  let lineHeight = parseFloat(computed.lineHeight) || fontSize * props.lineHeight;
  const font = () => { ctx.font = `${computed.fontWeight} ${fontSize}px ${computed.fontFamily}`; };
  font();
  const chars = Array.from(props.text);
  const textWidth = chars.reduce((sum, char) => sum + ctx.measureText(char).width, 0) + Math.max(0, chars.length - 1) * letterSpacing;
  const fit = Math.min(1, width * .92 / Math.max(textWidth, 1), height * .82 / Math.max(lineHeight, 1));
  fontSize *= fit; letterSpacing *= fit; lineHeight *= fit; font();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = props.color; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  let x = (width - (chars.reduce((sum, char) => sum + ctx.measureText(char).width, 0) + Math.max(0, chars.length - 1) * letterSpacing)) / 2;
  chars.forEach((char, index) => { ctx.fillText(char, x, height / 2); x += ctx.measureText(char).width + (index === chars.length - 1 ? 0 : letterSpacing); });
  probe.remove();
  return canvas;
}

function rasterizeImage(width, height, dpr, image) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
  const ctx = canvas.getContext('2d');
  if (!ctx || !image.naturalWidth || !image.naturalHeight) return canvas;

  const source = document.createElement('canvas');
  source.width = image.naturalWidth;
  source.height = image.naturalHeight;
  const sourceCtx = source.getContext('2d', { willReadFrequently: true });
  if (!sourceCtx) return canvas;
  sourceCtx.drawImage(image, 0, 0);
  const pixels = sourceCtx.getImageData(0, 0, source.width, source.height).data;
  let minX = source.width, minY = source.height, maxX = -1, maxY = -1;
  for (let y = 0; y < source.height; y += 1) for (let x = 0; x < source.width; x += 1) {
    if (pixels[(y * source.width + x) * 4 + 3] > 8) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  }
  if (maxX < minX || maxY < minY) return canvas;
  const sourceWidth = maxX - minX + 1;
  const sourceHeight = maxY - minY + 1;
  const scale = Math.min(width * .98 / sourceWidth, height * .92 / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.drawImage(image, minX, minY, sourceWidth, sourceHeight, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  return canvas;
}

export default function WarpText({ text = 'Bend the moment', imageSrc = null, color = '#f8f5ff', warpStrength = .08, warpScale = 1.7, speed = .55, pointerInfluence = .42, pointerStrength = .38, refraction = .018, ripple = true, fontSize = 116, fontWeight = 800, fontFamily = 'inherit', letterSpacing = '-0.06em', lineHeight = .9, className = '', style }) {
  const ref = useRef(null); const [ready, setReady] = useState(false);
  useEffect(() => {
    const container = ref.current; if (!container) return undefined;
    let renderer; let raf = 0; let disposed = false; let texture; let program; let imageLoaded = false; const sourceImage = imageSrc ? new Image() : null; const pointer = { x: .5, y: .5, tx: .5, ty: .5, active: 0, target: 0 };
    try { renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: false, antialias: true, dpr: Math.min(devicePixelRatio || 1, 2) }); } catch { return undefined; }
    const gl = renderer.gl; gl.clearColor(0, 0, 0, 0); const canvas = gl.canvas; canvas.setAttribute('aria-hidden', 'true'); container.appendChild(canvas);
    texture = new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR, wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE });
    program = new Program(gl, { vertex, fragment, transparent: true, depthTest: false, depthWrite: false, uniforms: { uTextTexture: { value: texture }, uResolution: { value: new Float32Array([1, 1]) }, uPointer: { value: new Float32Array([.5, .5]) }, uPointerActive: { value: 0 }, uTime: { value: 0 }, uWarpStrength: { value: warpStrength }, uWarpScale: { value: warpScale }, uSpeed: { value: speed }, uPointerInfluence: { value: pointerInfluence }, uPointerStrength: { value: pointerStrength }, uRefraction: { value: refraction }, uRipple: { value: ripple ? 1 : 0 }, uMotion: { value: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1 } } });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => { const rect = container.getBoundingClientRect(); if (!rect.width || !rect.height) return; renderer.setSize(rect.width, rect.height); program.uniforms.uResolution.value[0] = gl.drawingBufferWidth; program.uniforms.uResolution.value[1] = gl.drawingBufferHeight; texture.image = imageLoaded ? rasterizeImage(rect.width, rect.height, Math.min(devicePixelRatio || 1, 2), sourceImage) : rasterizeText(container, rect.width, rect.height, Math.min(devicePixelRatio || 1, 2), { text, color, fontSize, fontWeight, fontFamily, letterSpacing, lineHeight }); texture.needsUpdate = true; renderer.render({ scene: mesh }); setReady(true); };
    const move = event => { const rect = canvas.getBoundingClientRect(); pointer.tx = (event.clientX - rect.left) / rect.width; pointer.ty = 1 - (event.clientY - rect.top) / rect.height; pointer.target = 1; };
    const leave = () => { pointer.target = 0; };
    const loop = now => { if (disposed) return; const time = now * .001; const idleX = .5 + Math.sin(time * .33) * .12; const idleY = .5 + Math.cos(time * .27) * .1; pointer.x += ((pointer.target ? pointer.tx : idleX) - pointer.x) * (pointer.target ? .12 : .035); pointer.y += ((pointer.target ? pointer.ty : idleY) - pointer.y) * (pointer.target ? .12 : .035); pointer.active += ((pointer.target ? 1 : .18) - pointer.active) * .06; program.uniforms.uPointer.value[0] = pointer.x; program.uniforms.uPointer.value[1] = pointer.y; program.uniforms.uPointerActive.value = pointer.active; program.uniforms.uTime.value = time; renderer.render({ scene: mesh }); raf = requestAnimationFrame(loop); };
    const observer = new ResizeObserver(resize); observer.observe(container); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerleave', leave); resize(); if (sourceImage) { sourceImage.onload = () => { imageLoaded = true; resize(); }; sourceImage.src = imageSrc; } document.fonts?.ready.then(() => { if (!disposed) resize(); }); raf = requestAnimationFrame(loop);
    return () => { disposed = true; cancelAnimationFrame(raf); observer.disconnect(); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave); if (canvas.parentNode === container) canvas.remove(); try { gl.getExtension('WEBGL_lose_context')?.loseContext(); } catch { /* no-op */ } };
  }, [color, fontFamily, fontSize, fontWeight, imageSrc, letterSpacing, lineHeight, pointerInfluence, pointerStrength, refraction, ripple, speed, text, warpScale, warpStrength]);
  return <div ref={ref} className={`warp-text ${ready ? 'is-ready' : ''} ${className}`.trim()} style={style} role="img" aria-label={text}><span className="warp-text__fallback">{text}</span></div>;
}
