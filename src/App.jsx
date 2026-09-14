import { useEffect, useRef, useState } from 'react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from 'motion/react';

const fileExport = window.location.protocol === 'file:';
const staticHosting = fileExport || import.meta.env.BASE_URL !== '/';
const assetBase = fileExport ? './' : import.meta.env.BASE_URL;
const asset = name => `${assetBase}assets/${name}`;
const activeShareToken = new URLSearchParams(window.location.search).get('share');
const encodedShareToken = activeShareToken ? encodeURIComponent(activeShareToken) : '';
const routeHref = path => staticHosting
  ? `?page=${path.replace(/^\//, '')}${encodedShareToken ? `&share=${encodedShareToken}` : ''}`
  : `${path}${encodedShareToken ? `?share=${encodedShareToken}` : ''}`;
const portfolioReturnHref = staticHosting
  ? `?page=home${encodedShareToken ? `&share=${encodedShareToken}` : ''}#portfolio`
  : `/${encodedShareToken ? `?share=${encodedShareToken}` : ''}#portfolio`;
const sections = [
  ['home', 'Home', '首页'],
  ['about', 'About', '关于我'],
  ['experience', 'Experience', '经历'],
  ['portfolio', 'Portfolio', '作品'],
  ['contact', 'Contact', '联系方式'],
];
const portfolioCards = [
  ['08', '美妆作品', '/cosmetics', 'portfolio-card-color-01.png', 'COSMETICS', '美妆'],
  ['09', '潮玩作品', '/trendy-toys', 'portfolio-card-color-02.png', 'TRENDY TOYS', 'IP 潮玩'],
  ['10', '汽车渲染作品', '/car-pattern', 'portfolio-card-color-03.png', 'CAR PATTERN', '汽车渲染'],
  ['11', '品牌物料作品', '/materials', 'portfolio-card-color-04.png', 'MATERIALS', '品牌物料'],
  ['12', '视频剪辑作品', '/video-editing', 'portfolio-card-color-05.png', 'VIDEO EDITING', '视频剪辑'],
];

const textMotionAssets = [
  'home-welcome.png',
  'home-horse-logo.png',
  'home-deran-wordmark.png',
  'home-intro-copy.png',
  'home-portfolio-wordmark.png',
  'home-note-copy.png',
  'continuous-06.webp',
  'experience-character.webp',
  'about-no-copy.webp',
  'catalogue-bg-opaque.webp',
  'portfolio-card-color-01.png',
  'portfolio-card-color-02.png',
  'portfolio-card-color-03.png',
  'portfolio-card-color-04.png',
  'portfolio-card-color-05.png',
  'about-label.png',
  'catalogue-wordmark.png',
  'paren-left.png',
  'paren-right.png',
  'arrow-down.png',
  'text-motion/services-about.png',
  'text-motion/services-contact.png',
  'text-motion/about-copy-zh.png',
  'text-motion/about-copy-en.png',
  'text-motion/about-avatar-caption.png',
  'text-motion/contact-thanks-zh.png',
  'text-motion/contact-thanks-en.png',
  'text-motion/contact-invite-zh.png',
  'text-motion/contact-invite-en.png',
  'text-motion/contact-forward-zh.png',
  'text-motion/contact-forward-en.png',
];

const experienceEntries = [
  {
    id: 'fanwenhua',
    company: '广州樊文花化妆品有限公司',
    role: '视频剪辑',
    dates: '2026.06 - 至今',
    summary: '公司官方视频号的日常更新',
    duties: [
      '公司官方视频号的日常更新',
      '公司日常活动的对外宣发剪辑',
      '公司新品 TVC 的制作',
    ],
    achievements: [
      '公司官方视频号 AI 视频转发与收藏破千',
      '公司大型年中总结大会的内部视频剪辑',
      '公司新品 TVC 的制作',
    ],
  },
  {
    id: 'shengrui',
    company: '广州市升睿汽车用品有限公司',
    role: '三维渲染师',
    dates: '2025.10 - 2026.04',
    summary: '负责汽车卷材、车衣与车膜渲染输出',
    duties: [
      '负责汽车卷材、车衣与车膜渲染输出',
      '公司网站相关汽车渲染图输出',
      '汽车定制化喷涂渲染工作',
      '网站汽车用品动画制作',
    ],
    achievements: [],
  },
  {
    id: 'aodingshi',
    company: '广州奥耶士设计事务所有限公司',
    role: '三维设计师',
    dates: '2024.05 - 2025.05',
    summary: '根据设计要求，输出三维效果图',
    duties: [
      '根据设计师要求，输出三维效果图，辅助完成餐饮项目提案',
      '在已完成的设计项目中，根据要求输出三维效果图，完成公司品牌案例发布',
      '根据需求，完成公司旗下餐饮项目与视频剪辑工作',
    ],
    achievements: [
      '无穷新品商场货架堆头三维效果图',
      '大快活线下多家门店视频制作',
      '半天妖线下店打卡墙装置落地',
      '嘉士伯新品 KV 三维效果图输出',
      '龙歌品牌 IP 三维建模输出',
      '黑手制局周年视频及机场、地铁视频制作',
    ],
  },
  {
    id: 'nanfeng',
    company: '杭州南风效应品牌设计有限公司',
    role: '品牌设计',
    dates: '2022.10 - 2023.10',
    summary: '负责品牌、包装、Logo 与品牌手册设计',
    duties: [
      '负责公司品牌设计、包装设计、Logo 设计、品牌手册等工作',
      '全过程参与新项目的孵化，输出完整品牌设计提案，制定品牌 VI 和应用规范',
      '完成设计方案中所需的部分插画工作',
      '确定设计方案后，与客户、印刷厂建群沟通，跟进校色及印刷效果',
    ],
    achievements: [
      '在职期间辅助设计总监和老板完成多个品牌从零到一的新品牌搭建',
      '独立完成品牌全案设计，输出品牌设计手册并完成交付',
      '参与品牌设计落地，与工厂对接打印校色和工艺',
    ],
  },
];

const serviceSlices = [
  { left: 0, top: 0, right: 104, bottom: 33 },
  { left: 324, top: 0, right: 457, bottom: 33 },
  { left: 770, top: 0, right: 866, bottom: 33 },
  { left: 1203, top: 0, right: 1278, bottom: 33 },
];

const lineSlices = {
  aboutZh: [[0, 1, 901, 49], [0, 56, 901, 101], [0, 111, 901, 159], [0, 166, 901, 214]],
  aboutEn: [[0, 6, 916, 49], [0, 53, 916, 88], [0, 100, 916, 135], [0, 147, 916, 182], [0, 194, 916, 229], [0, 241, 916, 284], [0, 288, 916, 323]],
  thanksZh: [[0, 0, 201, 28]],
  thanksEn: [[0, 0, 354, 22], [0, 29, 354, 50]],
  inviteZh: [[0, 0, 308, 27], [0, 33, 308, 61]],
  inviteEn: [[0, 0, 332, 22], [0, 29, 332, 50], [0, 57, 332, 79], [0, 86, 332, 107]],
  forwardZh: [[0, 0, 173, 27]],
  forwardEn: [[0, 0, 280, 21], [0, 28, 280, 50], [0, 56, 280, 78]],
};

const toSliceObjects = slices => slices.map(([left, top, right, bottom]) => ({ left, top, right, bottom }));
const visibleTransform = 'translate3d(0, 0, 0) scale(1)';

function textVariants(mode, reduceMotion) {
  if (reduceMotion) {
    return {
      hidden: { opacity: 1, transform: visibleTransform, filter: 'blur(0px)', transition: { duration: 0 } },
      visible: { opacity: 1, transform: visibleTransform, filter: 'blur(0px)', transition: { duration: 0 } },
    };
  }

  const isLine = mode === 'line-mask';
  const isScale = mode === 'scale-settle';
  const enterFrom = isLine
    ? 'translate3d(0, 30px, 0) scale(1)'
    : isScale
      ? 'translate3d(0, 8px, 0) scale(1.04)'
      : 'translate3d(0, 0, 0) scale(0.96)';
  return {
    hidden: custom => ({
      opacity: 0,
      transform: enterFrom,
      filter: isLine ? 'blur(6px)' : 'blur(0px)',
      transition: {
        duration: isLine ? 0.52 : isScale ? 0.38 : 0.4,
        delay: isLine ? Math.max(0, (custom.count - custom.index - 1) * 0.07) : 0,
        ease: isLine ? [0.64, 0, 0.78, 0] : [0.7, 0, 0.84, 0],
      },
    }),
    visible: custom => ({
      opacity: 1,
      transform: visibleTransform,
      filter: 'blur(0px)',
      transition: {
        duration: isLine ? 0.76 : isScale ? 0.52 : 0.6,
        delay: custom.delay + (isLine ? custom.index * 0.09 : custom.index * custom.itemDelay),
        ease: isLine ? [0.22, 1, 0.36, 1] : isScale ? [0.22, 1, 0.36, 1] : [0.32, 0.72, 0, 1],
      },
    }),
  };
}

function TextImageReveal({
  src,
  text,
  className = '',
  mode = 'micro',
  delay = 0,
  itemDelay = 0,
  slices,
  intrinsicWidth,
  intrinsicHeight,
}) {
  const reduceMotion = useReducedMotion();
  const variants = textVariants(mode, reduceMotion);

  if (text) {
    return (
      <m.p
        className={`text-image-reveal text-copy-reveal ${className}`}
        variants={variants}
        custom={{ delay, itemDelay, index: 0, count: 1 }}
      >
        {text}
      </m.p>
    );
  }

  if (!slices?.length) {
    return (
      <div className={`text-image-reveal ${className}`} aria-hidden="true">
        <m.img
          className="text-image-whole"
          src={asset(src)}
          alt=""
          variants={variants}
          custom={{ delay, itemDelay, index: 0, count: 1 }}
          loading="eager"
          decoding="async"
          draggable="false"
        />
      </div>
    );
  }

  return (
    <div className={`text-image-reveal ${className}`} aria-hidden="true">
      {slices.map((slice, index) => {
        const cropWidth = slice.right - slice.left;
        const cropHeight = slice.bottom - slice.top;
        return (
          <span
            className="text-slice-window"
            key={`${slice.left}-${slice.top}-${index}`}
            style={{
              left: `${slice.left / intrinsicWidth * 100}%`,
              top: `${slice.top / intrinsicHeight * 100}%`,
              width: `${cropWidth / intrinsicWidth * 100}%`,
              height: `${cropHeight / intrinsicHeight * 100}%`,
            }}
          >
            <m.span
              className="text-slice-motion"
              variants={variants}
              custom={{ delay, itemDelay, index, count: slices.length }}
            >
              <img
                src={asset(src)}
                alt=""
                loading="eager"
                decoding="async"
                draggable="false"
                style={{
                  left: `${-slice.left / cropWidth * 100}%`,
                  top: `${-slice.top / cropHeight * 100}%`,
                  width: `${intrinsicWidth / cropWidth * 100}%`,
                  height: `${intrinsicHeight / cropHeight * 100}%`,
                }}
              />
            </m.span>
          </span>
        );
      })}
    </div>
  );
}

function SectionTextSequence({ children, className = '', ...props }) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.28, margin: '0px 0px -8% 0px' }}
      {...props}
    >
      {children}
    </m.div>
  );
}

const homeTextLayers = [
  {
    id: 'welcome',
    file: 'home-welcome.png',
    className: 'home-text-welcome',
    label: 'WELCOME',
    from: 'translate3d(0, 0, 0) scale(0.96)',
    delay: 2.86,
    duration: 0.6,
    ease: [0.32, 0.72, 0, 1],
  },
  {
    id: 'horse-logo',
    file: 'home-horse-logo.png',
    className: 'home-text-horse-logo',
    label: 'Deran horse logo',
    from: 'translate3d(0, 0, 0) scale(0.96)',
    delay: 2.94,
    duration: 0.6,
    ease: [0.32, 0.72, 0, 1],
  },
  {
    id: 'deran',
    file: 'home-deran-wordmark.png',
    className: 'home-text-deran',
    label: 'DERAN',
    from: 'translate3d(-12%, 0, 0) scale(0.98)',
    clipFrom: 'inset(0 100% 0 0)',
    delay: 0.16,
    duration: 0.88,
    ease: [0.22, 1, 0.36, 1],
  },
  {
    id: 'intro',
    file: 'home-intro-copy.png',
    className: 'home-text-intro',
    label: '一个努力探索三维动效与视频剪辑的设计师。A designer delving into 3D motion graphics and video editing.',
    from: 'translate3d(24px, 12px, 0) scale(1)',
    blur: 10,
    delay: 1.38,
    duration: 0.64,
    ease: [0.22, 1, 0.36, 1],
  },
  {
    id: 'portfolio',
    file: 'home-portfolio-wordmark.png',
    className: 'home-text-portfolio',
    label: 'PORTFOLIO',
    from: 'translate3d(12%, 0, 0) scale(0.98)',
    clipFrom: 'inset(0 0 0 100%)',
    delay: 0.24,
    duration: 0.92,
    ease: [0.22, 1, 0.36, 1],
  },
  {
    id: 'note',
    file: 'home-note-copy.png',
    className: 'home-text-note',
    label: '热衷于三维动效表达与打破常规审美。Motion design, defying conventional aesthetics to turn ideas into visuals.',
    from: 'translate3d(-24px, 12px, 0) scale(1)',
    blur: 10,
    delay: 1.46,
    duration: 0.64,
    ease: [0.22, 1, 0.36, 1],
  },
];

function HomeTextMotion({ cycle, started }) {
  const reduceMotion = useReducedMotion();
  const show = started || reduceMotion;

  return (
    <div className="home-text-motion" aria-label="DERAN 2026 portfolio introduction">
      <span className="sr-only">
        WELCOME. DERAN portfolio. A designer exploring 3D motion graphics and video editing.
      </span>
      {homeTextLayers.map(layer => {
        const hidden = reduceMotion
          ? { opacity: 1, transform: visibleTransform, filter: 'blur(0px)', clipPath: 'inset(0 0 0 0)' }
          : {
              opacity: 0,
              transform: layer.from,
              filter: `blur(${layer.blur || 0}px)`,
              clipPath: layer.clipFrom || 'inset(0 0 0 0)',
            };
        const visible = {
          opacity: 1,
          transform: visibleTransform,
          filter: 'blur(0px)',
          clipPath: 'inset(0 0 0 0)',
          transition: {
            delay: reduceMotion ? 0 : layer.delay,
            duration: reduceMotion ? 0 : layer.duration,
            ease: layer.ease,
          },
        };

        return (
          <m.img
            key={`${cycle}-${layer.id}`}
            className={`home-text-asset ${layer.className}`}
            src={asset(layer.file)}
            alt=""
            aria-hidden="true"
            initial={hidden}
            animate={show ? visible : hidden}
            loading="eager"
            decoding="async"
            draggable="false"
          />
        );
      })}
    </div>
  );
}

function ContactCardPreview({ open, onClose }) {
  const reduceMotion = useReducedMotion();
  const hiddenTransform = reduceMotion
    ? 'translate3d(0, 0, 0) scale(1)'
    : 'translate3d(0, 0, 0) scale(0.96)';
  const transition = { duration: reduceMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] };

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          key="contact-card-preview"
          className="contact-preview-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          onClick={event => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <m.section
            className="contact-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-preview-title"
            initial={{ opacity: 0, transform: hiddenTransform }}
            animate={{ opacity: 1, transform: visibleTransform }}
            exit={{ opacity: 0, transform: hiddenTransform }}
            transition={transition}
          >
            <h2 id="contact-preview-title" className="sr-only">放大查看联系方式和微信二维码</h2>
            <button className="contact-preview-close" type="button" onClick={onClose} autoFocus>
              <span aria-hidden="true">×</span>
              <span className="sr-only">关闭联系方式放大窗口</span>
            </button>
            <div className="contact-preview-card">
              <div className="contact-preview-person">
                <img src={asset('contact-bg.webp')} alt="Deran 联系方式头像" />
                <div className="contact-preview-links">
                  <a href="tel:+8618334215225">☎ 183–3421–5225</a>
                  <a href="mailto:2240707934@qq.com">✉ 2240707934@qq.com</a>
                </div>
              </div>
              <div className="contact-preview-qr">
                <img src={asset('wechat-qr.png')} alt="Deran 的微信二维码" />
              </div>
            </div>
            <p className="contact-preview-hint">微信扫码，或点击左侧电话与邮箱直接联系</p>
          </m.section>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

const cardDeckTransforms = [
  'translate3d(168%, 18px, 0) scale(0.94)',
  'translate3d(84%, 18px, 0) scale(0.94)',
  'translate3d(0, 18px, 0) scale(0.94)',
  'translate3d(-84%, 18px, 0) scale(0.94)',
  'translate3d(-168%, 18px, 0) scale(0.94)',
];
const cardDeckDelays = [0.12, 0.06, 0, 0.06, 0.12];

function PortfolioMotionCards({ activeCard, onActivate, onDeactivate }) {
  const reduceMotion = useReducedMotion();
  const activeIndex = portfolioCards.findIndex(([id]) => id === activeCard);

  return (
    <div className={`portfolio-motion-stage ${activeCard ? 'has-active-card' : ''}`} aria-label="作品卡片">
      {portfolioCards.map(([id, label, href, image, titleEn, titleZh], index) => {
        const shift = activeIndex < 0 || index === activeIndex
          ? 0
          : index < activeIndex ? -8 : 8;
        const interactionTransform = index === activeIndex
          ? 'translate3d(0, -10px, 0) scale(1.015)'
          : `translate3d(${shift}px, 0, 0) scale(1)`;
        const isActive = id === activeCard;
        return (
          <m.div
            className={`portfolio-motion-card-shell portfolio-motion-card-${id} ${isActive ? 'is-active' : ''}`}
            key={id}
            initial={reduceMotion ? false : { opacity: 0.45, transform: cardDeckTransforms[index] }}
            whileInView={{
              opacity: 1,
              transform: visibleTransform,
              transition: reduceMotion
                ? { duration: 0 }
                : { type: 'spring', visualDuration: 0.5, bounce: 0.2, delay: cardDeckDelays[index] },
            }}
            viewport={{ once: false, amount: 0.42, margin: '0px 0px -8% 0px' }}
          >
            <a
              className={`portfolio-motion-card ${isActive ? 'is-active' : ''} ${activeCard && !isActive ? 'is-dimmed' : ''}`}
              href={routeHref(href)}
              aria-label={`打开${label}系列页面`}
              style={{ transform: reduceMotion ? visibleTransform : interactionTransform }}
              onPointerEnter={event => {
                if (event.pointerType === 'mouse' || event.pointerType === 'pen') onActivate(id);
              }}
              onPointerLeave={() => onDeactivate(id)}
              onFocus={() => onActivate(id)}
              onBlur={() => onDeactivate(id)}
            >
              <span className="portfolio-motion-visual" aria-hidden="true">
                <img className="portfolio-motion-gray" src={asset(image)} alt="" draggable="false" />
                <span className="portfolio-motion-color-reveal">
                  <img src={asset(image)} alt="" draggable="false" />
                </span>
                <span className="portfolio-motion-dim" />
                <span className="portfolio-motion-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="portfolio-motion-title">
                  <span>{titleEn}</span>
                  <span lang="zh-CN">{titleZh}</span>
                </span>
              </span>
            </a>
          </m.div>
        );
      })}
    </div>
  );
}

function ExperienceSection() {
  const [openId, setOpenId] = useState(null);
  const reduceMotion = useReducedMotion();
  const easeOut = [0.22, 1, 0.36, 1];
  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', visualDuration: 0.42, bounce: 0.12 };

  return (
    <m.section
      id="experience"
      data-nav-section
      className={`static-section-anchor static-experience-anchor ${openId ? 'has-open-entry' : ''}`}
      aria-labelledby="experience-title"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.28, margin: '0px 0px -8% 0px' }}
    >
      <span className="experience-grid" aria-hidden="true" />
      <div className="experience-intro">
        <div className="experience-title-mask">
          <m.h2
            id="experience-title"
            className="experience-title"
            variants={{
              hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 30, filter: 'blur(6px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reduceMotion ? 0 : 0.76, ease: easeOut } },
            }}
          >
            EXPERIENCE
          </m.h2>
        </div>
        <div className="experience-cn-mask">
          <m.p
            className="experience-title-cn"
            variants={{
              hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(6px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: reduceMotion ? 0 : 0.09, duration: reduceMotion ? 0 : 0.76, ease: easeOut } },
            }}
          >
            工作经历
          </m.p>
        </div>
        <m.p
          className="experience-kicker"
          variants={{
            hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, filter: 'blur(6px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: reduceMotion ? 0 : 0.2, duration: reduceMotion ? 0 : 0.58, ease: easeOut } },
          }}
        >
          SOME PATHS ARE QUIET,<br />BUT STILL LEAD FORWARD.
        </m.p>
      </div>

      <m.div
        className="experience-character-wrap"
        aria-hidden="true"
        variants={{
          hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.965 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { delay: reduceMotion ? 0 : 0.16, duration: reduceMotion ? 0 : 0.9, ease: easeOut } },
        }}
      >
        <img src={asset('experience-character.webp')} alt="" draggable="false" />
      </m.div>

      <m.div
        className="experience-list"
        role="list"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.07, delayChildren: reduceMotion ? 0 : 0.13 } },
        }}
      >
        {experienceEntries.map((entry, index) => {
          const isOpen = entry.id === openId;
          const isDimmed = openId && !isOpen;
          return (
            <m.article
              layout
              role="listitem"
              key={entry.id}
              className={`experience-entry ${isOpen ? 'is-open' : ''} ${isDimmed ? 'is-dimmed' : ''}`}
              variants={{
                hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.52, ease: easeOut } },
              }}
              transition={{ layout: layoutTransition }}
            >
              <m.button
                layout="position"
                type="button"
                className="experience-entry-trigger"
                aria-expanded={isOpen}
                aria-controls={`experience-details-${entry.id}`}
                onClick={() => setOpenId(current => current === entry.id ? null : entry.id)}
              >
                <span className="experience-entry-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="experience-entry-main">
                  <strong>{entry.company}</strong>
                  <span className="experience-entry-role">{entry.role}</span>
                  {!isOpen && <span className="experience-entry-summary">{entry.summary}</span>}
                </span>
                <span className="experience-entry-date">{entry.dates}</span>
                <span className="experience-entry-action" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </m.button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <m.div
                    id={`experience-details-${entry.id}`}
                    className="experience-entry-details"
                    initial={reduceMotion ? false : { height: 0, opacity: 0, clipPath: 'inset(0 0 100% 0)', filter: 'blur(6px)' }}
                    animate={{ height: 'auto', opacity: 1, clipPath: 'inset(0 0 0% 0)', filter: 'blur(0px)' }}
                    exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0, clipPath: 'inset(0 0 100% 0)', filter: 'blur(6px)' }}
                    transition={{ duration: reduceMotion ? 0 : 0.48, ease: easeOut }}
                  >
                    <ExperienceDetailColumn title="工作内容" items={entry.duties} reduceMotion={reduceMotion} />
                    {entry.achievements.length > 0 && (
                      <ExperienceDetailColumn title="项目业绩" items={entry.achievements} reduceMotion={reduceMotion} />
                    )}
                  </m.div>
                ) : null}
              </AnimatePresence>
            </m.article>
          );
        })}
      </m.div>

      <m.p
        className="experience-instruction"
        variants={{
          hidden: reduceMotion ? { opacity: 1 } : { opacity: 0 },
          visible: { opacity: 1, transition: { delay: reduceMotion ? 0 : 0.48, duration: reduceMotion ? 0 : 0.42 } },
        }}
      >
        CLICK ANY EXPERIENCE TO VIEW FULL DETAILS
      </m.p>
      <div className="experience-service-footer" aria-hidden="true">
        <span>BEAUTY<br />RENDERING</span>
        <span>REALISTIC CAR<br />RENDERING</span>
        <span>IP IMAGE<br />MODELING</span>
        <span>AI VIDEO<br />EDITING</span>
        <span>MAKING<br />A BETTER VISUAL WORLD.</span>
      </div>
    </m.section>
  );
}

function ExperienceDetailColumn({ title, items, reduceMotion }) {
  return (
    <div className="experience-detail-column">
      <h3>{title}</h3>
      <m.ol
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.05 } } }}
      >
        {items.map((item, index) => (
          <m.li
            key={`${item}-${index}`}
            variants={{
              hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {item}
          </m.li>
        ))}
      </m.ol>
    </div>
  );
}
const staticSeriesPages = {
  '/trendy-toys': {
    key: 'trendy-toys',
    title: 'TRENDY Toys IP系列 — DERAN',
    background: 'trendy-toys-bg.png',
    board: 'trendy-toys-board.webp',
    description: '元气寿司与梅友朋克 IP 系列作品',
    works: [
      { label: 'GENKI SUSHI 元气寿司', file: 'trendy-toys-genki-full.webp' },
      { label: 'MEIYOU PUNK 梅友朋克', file: 'trendy-toys-meiyou-full.webp' },
    ],
  },
  '/car-pattern': {
    key: 'car-pattern',
    title: 'Car Pattern 汽车系列 — DERAN',
    background: 'car-pattern-bg.png',
    board: 'car-pattern-board.webp',
    description: '保时捷汽车涂装系列渲染作品',
    works: [
      { label: 'PORSCHE 汽车涂装系列渲染', file: 'car-pattern-porsche-full.webp' },
    ],
  },
  '/materials': {
    key: 'materials',
    title: 'Materials 物料系列 — DERAN',
    background: 'materials-bg.png',
    board: 'materials-board.webp',
    description: '餐饮与品牌物料系列渲染作品',
    works: [
      { label: 'FAIRWOOD 大快活餐饮物料渲染', file: 'materials-fairwood-full.webp' },
      { label: 'BANTIANYAO 半天妖餐饮物料渲染', file: 'materials-bantianyao-full.webp' },
      { label: 'MOMOYO MOMOYO饮品物料渲染', file: 'materials-momoyo-full.webp' },
    ],
  },
  '/video-editing': {
    key: 'video-editing',
    title: 'Video Editing 剪辑系列 — DERAN',
    background: 'video-editing-bg.webp',
    board: 'video-editing-board.webp',
    description: '八项视频剪辑与 AI 影像作品',
    works: [
      { type: 'video', label: 'LYCHEE 长安的荔枝AI改版', file: 'video-editing-01-web.mp4' },
      { type: 'video', label: 'NEW PRODUCT 黑绷带新品视频', file: 'video-editing-02-web.mp4' },
      { type: 'video', label: 'NEW PRODUCT 五号新品视频', file: 'video-editing-03-web.mp4' },
      { type: 'video', label: 'SUNSCREEN 防晒变白科普', file: 'video-editing-04-web.mp4' },
      { type: 'video', label: "VALENTINE'S DAY 七夕情人节送礼", file: 'video-editing-05-web.mp4' },
      { type: 'video', label: 'PROMETHEUS 普罗米修斯的二次冒险', file: 'video-editing-06-web.mp4' },
      { type: 'video', label: 'HYDRATION 补水科普视频', file: 'video-editing-07-web.mp4' },
      { type: 'video', label: 'SUMMER 夏天的另一种颜色', file: 'video-editing-08-web.mp4' },
    ],
    quickLinks: [
      'LYCHEE 长安的荔枝AI改版',
      'NEW PRODUCT 黑绷带新品视频',
      'NEW PRODUCT 五号新品视频',
      'SUNSCREEN 防晒变白科普',
      "VALENTINE'S DAY 七夕情人节送礼",
      'PROMETHEUS 普罗米修斯的二次冒险',
      'HYDRATION 补水科普视频',
      'SUMMER 夏天的另一种颜色',
    ],
    quickOffsets: [0, 0, 0, 0.355, 0.355, 0.355, 0.63, 0.63],
  },
};
const cosmeticsWorks = [
  'CLARINS 眼霜系列静帧渲染',
  'UNREAL 面霜系列静帧渲染',
  'DERAN 洗面奶系列静帧渲染',
  'SCATTERED 零散的产品',
  'KERASTASE 卡诗护发精华3D动画',
  'LANCOME 兰蔻精华面霜3D动画',
];
const cosmeticsMedia = [
  { type: 'image', file: 'cosmetics-clarins-full.webp' },
  { type: 'image', file: 'cosmetics-unreal-full.webp' },
  { type: 'image', file: 'cosmetics-deran-full.webp' },
  { type: 'image', file: 'cosmetics-scattered-full.webp' },
  { type: 'video', file: 'cosmetics-kerastase-video-web.mp4' },
  { type: 'video', file: 'cosmetics-lancome-video-web.mp4' },
];

function Loader({ ready, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => setProgress(value => Math.min(ready ? 100 : 92, value + (value < 75 ? 2 : 1))),
      36,
    );
    return () => clearInterval(interval);
  }, [ready]);

  useEffect(() => {
    if (progress !== 100) return undefined;
    const fade = setTimeout(() => setLeaving(true), 360);
    const done = setTimeout(onComplete, 1000);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, [progress, onComplete]);

  return (
    <div className={`loader ${leaving ? 'leaving' : ''}`} role="status" aria-label={`网站加载 ${progress}%`}>
      <div className="loader-title">I'M DERAN.</div>
      <div className="loader-bottom">
        <div className="load-circle" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          {progress}%
        </div>
        <p>2026 DERAN DESIGN PORTFOLIO</p>
      </div>
    </div>
  );
}

const documentTop = element => window.scrollY + element.getBoundingClientRect().top;

function CosmeticsPage() {
  const scrollArea = useRef(null);
  const lastWorkButton = useRef(null);
  const artworkCloseButton = useRef(null);
  const artworkVideo = useRef(null);
  const savedScrollTop = useRef(0);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Cosmetics 美妆系列 — DERAN';
    document.documentElement.classList.add('cosmetics-document');
    document.body.classList.add('cosmetics-body');
    window.scrollTo({ top: 0, behavior: 'auto' });
    const initialWork = Number(window.location.hash.match(/^#cosmetics-work-(\d)$/)?.[1] || 1);
    const initialFrame = requestAnimationFrame(() => {
      const scroller = scrollArea.current;
      if (!scroller || initialWork <= 3) return;
      scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight;
    });
    return () => {
      cancelAnimationFrame(initialFrame);
      document.title = previousTitle;
      document.documentElement.classList.remove('cosmetics-document');
      document.body.classList.remove('cosmetics-body');
    };
  }, []);

  useEffect(() => {
    if (selectedMedia === null) return undefined;

    const scroller = scrollArea.current;
    savedScrollTop.current = scroller?.scrollTop || 0;
    const focusFrame = requestAnimationFrame(() => artworkCloseButton.current?.focus({ preventScroll: true }));
    const closeOnEscape = event => {
      if (event.key === 'Escape') setSelectedMedia(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', closeOnEscape);
      if (scroller) scroller.scrollTop = savedScrollTop.current;
      requestAnimationFrame(() => lastWorkButton.current?.focus({ preventScroll: true }));
    };
  }, [selectedMedia]);

  useEffect(() => {
    if (selectedMedia === null || cosmeticsMedia[selectedMedia].type !== 'video') return undefined;
    const videoElement = artworkVideo.current;
    if (!videoElement) return undefined;

    videoElement.muted = false;
    const attempt = videoElement.play();
    attempt?.catch(() => {
      videoElement.muted = true;
      videoElement.play().catch(() => undefined);
    });

    return () => {
      videoElement.pause();
      videoElement.removeAttribute('src');
      videoElement.load();
    };
  }, [selectedMedia]);

  function jumpToWork(event, index) {
    event.preventDefault();
    const scroller = scrollArea.current;
    if (!scroller) return;
    const destination = index <= 3 ? 0 : Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    event.currentTarget.blur();
    window.history.replaceState(null, '', `#cosmetics-work-${index}`);
    requestAnimationFrame(() => {
      scroller.scrollTop = destination;
    });
  }

  return (
    <>
      <main
        ref={scrollArea}
        className={`cosmetics-detail-page ${selectedMedia !== null ? 'is-artwork-open' : ''}`}
        inert={selectedMedia !== null ? true : undefined}
      >
        <div className="cosmetics-detail-canvas">
          <a className="skip-link" href={portfolioReturnHref}>返回作品页</a>
          <img
            className="cosmetics-detail-background"
            src={asset('cosmetics-page-bg-long.png')}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
          />
          <img
            className="cosmetics-detail-works"
            src={asset('cosmetics-work-board.webp')}
            alt="六项美妆产品渲染作品"
            loading="eager"
          />
          {cosmeticsMedia.map((media, index) => (
            <button
              key={media.file}
              className={`cosmetics-work-open cosmetics-work-open-${index + 1}`}
              type="button"
              aria-haspopup="dialog"
              aria-label={`查看作品 ${index + 1}：${cosmeticsWorks[index]}完整作品`}
              onClick={event => {
                lastWorkButton.current = event.currentTarget;
                setSelectedMedia(index);
              }}
            />
          ))}
          <nav className="cosmetics-detail-index" aria-label="美妆作品快速定位">
            {cosmeticsWorks.map((label, index) => (
              <a
                key={label}
                className={`cosmetics-index-link cosmetics-index-link-${index + 1}`}
                href={`#cosmetics-work-${index + 1}`}
                aria-label={`定位到作品 ${index + 1}：${label}`}
                onClick={event => jumpToWork(event, index + 1)}
              />
            ))}
          </nav>
          {cosmeticsWorks.map((label, index) => (
            <span
              key={`target-${label}`}
              id={`cosmetics-work-${index + 1}`}
              className={`cosmetics-work-target cosmetics-work-target-${index + 1}`}
              aria-label={`作品 ${index + 1}：${label}`}
            />
          ))}
        </div>
      </main>

      {selectedMedia !== null && (
        <section
          className="cosmetics-artwork-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={`${cosmeticsWorks[selectedMedia]}完整作品`}
        >
          <img
            className="cosmetics-artwork-dim"
            src={asset('cosmetics-artwork-dim.png')}
            alt=""
            aria-hidden="true"
          />
          <div className={`cosmetics-artwork-sheet ${cosmeticsMedia[selectedMedia].type === 'video' ? 'is-video' : ''}`}>
            {cosmeticsMedia[selectedMedia].type === 'image' ? (
              <img
                className="cosmetics-artwork-image"
                src={asset(cosmeticsMedia[selectedMedia].file)}
                alt={`${cosmeticsWorks[selectedMedia]}完整作品长图`}
              />
            ) : (
              <video
                ref={artworkVideo}
                className="cosmetics-artwork-video"
                src={asset(cosmeticsMedia[selectedMedia].file)}
                aria-label={`${cosmeticsWorks[selectedMedia]}作品视频`}
                controls
                autoPlay
                playsInline
                preload="auto"
              />
            )}
          </div>
          <button
            ref={artworkCloseButton}
            className="cosmetics-artwork-close"
            type="button"
            aria-label="返回作品列表"
            onClick={() => setSelectedMedia(null)}
          >
            <img src={asset('artwork-back-icon.png')} alt="返回作品列表" />
          </button>
        </section>
      )}
    </>
  );
}

function StaticSeriesPage({ page }) {
  const lastWorkButton = useRef(null);
  const artworkCloseButton = useRef(null);
  const artworkVideo = useRef(null);
  const savedWindowScroll = useRef(0);
  const [selectedWork, setSelectedWork] = useState(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = page.title;
    document.documentElement.classList.add('series-detail-document');
    document.body.classList.add('series-detail-body');
    const initialWork = Number(window.location.hash.match(/^#video-editing-work-(\d)$/)?.[1] || 1);
    const initialFrame = requestAnimationFrame(() => {
      const offset = page.quickOffsets?.[initialWork - 1] || 0;
      const canvas = document.querySelector('.series-detail-canvas');
      window.scrollTo({ top: canvas ? canvas.offsetHeight * offset : 0, behavior: 'auto' });
    });
    return () => {
      cancelAnimationFrame(initialFrame);
      document.title = previousTitle;
      document.documentElement.classList.remove('series-detail-document');
      document.body.classList.remove('series-detail-body');
    };
  }, [page.title]);

  function jumpToWork(event, index) {
    event.preventDefault();
    const canvas = event.currentTarget.closest('.series-detail-canvas');
    const offset = page.quickOffsets?.[index] || 0;
    event.currentTarget.blur();
    window.history.replaceState(null, '', `#video-editing-work-${index + 1}`);
    window.scrollTo({ top: canvas ? canvas.offsetHeight * offset : 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (selectedWork === null) return undefined;

    savedWindowScroll.current = window.scrollY;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = requestAnimationFrame(() => artworkCloseButton.current?.focus({ preventScroll: true }));
    const closeOnEscape = event => {
      if (event.key === 'Escape') setSelectedWork(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousBodyOverflow;
      window.scrollTo({ top: savedWindowScroll.current, behavior: 'auto' });
      requestAnimationFrame(() => lastWorkButton.current?.focus({ preventScroll: true }));
    };
  }, [selectedWork]);

  useEffect(() => {
    if (selectedWork === null || page.works?.[selectedWork]?.type !== 'video') return undefined;
    const videoElement = artworkVideo.current;
    if (!videoElement) return undefined;

    videoElement.muted = false;
    const attempt = videoElement.play();
    attempt?.catch(() => {
      videoElement.muted = true;
      videoElement.play().catch(() => undefined);
    });

    return () => {
      videoElement.pause();
      videoElement.removeAttribute('src');
      videoElement.load();
    };
  }, [page.works, selectedWork]);

  return (
    <>
      <main
        className={`series-detail-page series-${page.key} ${selectedWork !== null ? 'is-artwork-open' : ''}`}
        inert={selectedWork !== null ? true : undefined}
      >
        <div className="series-detail-canvas">
          <a className="skip-link" href={portfolioReturnHref}>返回作品页</a>
          <img
            className="series-detail-background"
            src={asset(page.background)}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
          />
          <img
            className="series-detail-board"
            src={asset(page.board)}
            alt={page.description}
            loading="eager"
          />
          {page.works?.map((work, index) => (
            <button
              key={work.file}
              className={`series-work-open series-work-open-${index + 1}`}
              type="button"
              aria-haspopup="dialog"
              aria-label={`查看作品 ${index + 1}：${work.label}完整作品`}
              onClick={event => {
                lastWorkButton.current = event.currentTarget;
                setSelectedWork(index);
              }}
            />
          ))}
          {page.quickLinks && (
            <nav className="series-detail-index" aria-label="剪辑作品快速定位">
              {page.quickLinks.map((label, index) => (
                <a
                  key={label}
                  className={`series-index-link series-index-link-${index + 1}`}
                  href={`#video-editing-work-${index + 1}`}
                  aria-label={`定位到作品 ${index + 1}：${label}`}
                  onClick={event => jumpToWork(event, index)}
                />
              ))}
            </nav>
          )}
        </div>
      </main>

      {selectedWork !== null && (
        <section
          className="cosmetics-artwork-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={`${page.works[selectedWork].label}完整作品`}
        >
          <img
            className="cosmetics-artwork-dim"
            src={asset('cosmetics-artwork-dim.png')}
            alt=""
            aria-hidden="true"
          />
          <div className={`cosmetics-artwork-sheet ${page.works[selectedWork].type === 'video' ? 'is-video' : ''}`}>
            {page.works[selectedWork].type === 'video' ? (
              <video
                ref={artworkVideo}
                className="cosmetics-artwork-video"
                src={asset(page.works[selectedWork].file)}
                aria-label={`${page.works[selectedWork].label}作品视频`}
                controls
                autoPlay
                playsInline
                preload="auto"
              />
            ) : (
              <img
                className="cosmetics-artwork-image"
                src={asset(page.works[selectedWork].file)}
                alt={`${page.works[selectedWork].label}完整作品长图`}
              />
            )}
          </div>
          <button
            ref={artworkCloseButton}
            className="cosmetics-artwork-close"
            type="button"
            aria-label="返回作品列表"
            onClick={() => setSelectedWork(null)}
          >
            <img src={asset('artwork-back-icon.png')} alt="返回作品列表" />
          </button>
        </section>
      )}
    </>
  );
}

function PortfolioSite() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState('home');
  const [menu, setMenu] = useState(false);
  const [rocking, setRocking] = useState(false);
  const [pointerInHome, setPointerInHome] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [homeMotionCycle, setHomeMotionCycle] = useState(0);
  const [contactPreviewOpen, setContactPreviewOpen] = useState(false);
  const video = useRef(null);
  const rockPrompt = useRef(null);
  const contactPreviewTrigger = useRef(null);
  const contactPreviewReturnTarget = useRef(null);
  const imageReady = useRef(false);
  const mediaReady = useRef(false);

  useEffect(() => {
    let alive = true;
    const finish = () => {
      if (!alive) return;
      imageReady.current = true;
      if (mediaReady.current) setReady(true);
    };
    Promise.all(textMotionAssets.map(name => new Promise(resolve => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = asset(name);
    }))).then(finish);
    const fallback = setTimeout(() => {
      if (alive) setReady(true);
    }, 8000);
    return () => {
      alive = false;
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  useEffect(() => {
    if (!contactPreviewOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => {
      if (event.key === 'Escape') {
        setContactPreviewOpen(false);
        requestAnimationFrame(() => (contactPreviewReturnTarget.current || contactPreviewTrigger.current)?.focus());
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [contactPreviewOpen]);

  useEffect(() => {
    const openFromMobileShowcase = event => {
      contactPreviewReturnTarget.current = event.detail?.trigger || null;
      setContactPreviewOpen(true);
    };
    window.addEventListener('deran:open-contact-preview', openFromMobileShowcase);
    return () => window.removeEventListener('deran:open-contact-preview', openFromMobileShowcase);
  }, []);

  useEffect(() => {
    if (loading) return undefined;

    const updateActive = () => {
      const probe = window.scrollY + window.innerHeight * 0.44;
      let current = 'home';
      document.querySelectorAll('[data-nav-section]').forEach(section => {
        if (documentTop(section) <= probe) current = section.id;
      });
      setActive(current);
    };

    const hash = window.location.hash.slice(1);
    if (sections.some(([id]) => id === hash)) {
      const target = document.getElementById(hash);
      if (target) requestAnimationFrame(() => window.scrollTo({ top: documentTop(target), behavior: 'auto' }));
    }

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [loading]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || loading || active !== 'home') {
      video.current?.pause();
      return;
    }
    if (video.current) video.current.muted = !rocking;
    video.current?.play().catch(() => setRocking(false));
  }, [loading, active, rocking]);

  function mediaLoaded() {
    mediaReady.current = true;
    if (imageReady.current) setReady(true);
  }

  function replayHomeSequence() {
    const homeVideo = video.current;
    if (!homeVideo) return;
    homeVideo.currentTime = 0;
    setHomeMotionCycle(value => value + 1);
    if (active === 'home' && !loading) {
      homeVideo.play().catch(() => setRocking(false));
    }
  }

  function toggleRock() {
    if (!videoFailed) setRocking(value => !value);
  }

  function moveRockPrompt(event) {
    if (event.pointerType !== 'mouse') return;
    const prompt = rockPrompt.current;
    if (prompt) {
      const safeX = Math.min(window.innerWidth - 145, Math.max(145, event.clientX));
      prompt.style.left = `${safeX}px`;
      prompt.style.top = `${Math.max(72, event.clientY)}px`;
    }
    setPointerInHome(true);
  }

  function navigateTo(event, id) {
    event.preventDefault();
    setMenu(false);
    const target = document.getElementById(id);
    if (!target) return;
    window.history.pushState(null, '', `#${id}`);
    window.scrollTo({ top: documentTop(target), behavior: 'smooth' });
  }

  function closeContactPreview() {
    setContactPreviewOpen(false);
    requestAnimationFrame(() => (contactPreviewReturnTarget.current || contactPreviewTrigger.current)?.focus());
  }

  function openContactPreview() {
    contactPreviewReturnTarget.current = contactPreviewTrigger.current;
    setContactPreviewOpen(true);
  }

  return (
    <>
      {loading && <Loader ready={ready} onComplete={() => setLoading(false)} />}
      <div inert={loading || contactPreviewOpen ? true : undefined}>
        <a href="#home" className="skip-link">跳转到主要内容</a>
        <header className="site-header">
          <a className="site-brand" href="#home" aria-label="Deran 首页" onClick={event => navigateTo(event, 'home')}>
            2026<br />DESIGN PORTFOLIO
          </a>
          <nav aria-label="主导航">
            {sections.map(([id, en, zh]) => (
              <a
                href={`#${id}`}
                key={id}
                aria-current={active === id ? 'location' : undefined}
                onClick={event => navigateTo(event, id)}
              >
                {en}<span>{zh}</span>
              </a>
            ))}
          </nav>
          <button
            className="menu-toggle"
            aria-expanded={menu}
            aria-controls="site-menu"
            aria-label={menu ? '关闭菜单' : '打开菜单'}
            onClick={() => setMenu(!menu)}
          >
            <span>•••</span>
          </button>
          {menu && (
            <div id="site-menu" className="site-menu">
              {sections.map(([id, en, zh]) => (
                <a href={`#${id}`} key={id} onClick={event => navigateTo(event, id)}>
                  {en} <span>{zh}</span>
                </a>
              ))}
              <button onClick={toggleRock} disabled={videoFailed}>
                {rocking ? '停止摇滚' : '开启摇滚'}
              </button>
            </div>
          )}
        </header>

        <main className="continuous-main static-board-site">
          <img
            className="continuous-shot"
            src={asset('reference-continuous.webp')}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
          />

          <section
            id="home"
            data-nav-section
            className={`screen home reference-mode continuous-section ${active === 'home' ? 'is-active' : ''}`}
            aria-label="首页"
            onClick={toggleRock}
            onPointerEnter={moveRockPrompt}
            onPointerMove={moveRockPrompt}
            onPointerLeave={() => setPointerInHome(false)}
          >
            <video
              ref={video}
              className={`full-background hero-video ${videoFailed ? 'failed' : ''}`}
              src={asset('home-video-textless.mp4')}
              muted={!rocking}
              playsInline
              preload="auto"
              onLoadedData={mediaLoaded}
              onEnded={replayHomeSequence}
              onError={() => {
                setVideoFailed(true);
                mediaLoaded();
              }}
              aria-label="Deran 首页动画"
            />
            {!videoFailed && (
              <HomeTextMotion
                key={homeMotionCycle}
                cycle={homeMotionCycle}
                started={!loading}
              />
            )}
          </section>

          <div
            ref={rockPrompt}
            className={`rock-prompt ${pointerInHome && active === 'home' && !videoFailed ? 'is-visible' : ''}`}
            role="status"
            aria-live="polite"
            aria-hidden={!(pointerInHome && active === 'home' && !videoFailed)}
          >
            {rocking ? <HiSpeakerXMark aria-hidden="true" /> : <HiSpeakerWave aria-hidden="true" />}
            <span>{rocking ? '点击任意位置即可停止摇滚' : '点击任意位置即可开启摇滚'}</span>
          </div>

          <section className="static-pages-board" aria-label="关于我、工作经历、作品和联系方式">
            <SectionTextSequence
              id="about"
              data-nav-section
              className="static-section-anchor static-about-anchor"
            >
              <img className="static-panel-source static-panel-source-about" src={asset('continuous-06.webp')} alt="" aria-hidden="true" loading="eager" />
              <h2 className="sr-only">ABOUT 关于我</h2>
              <p className="sr-only">
                BEAUTY RENDERING。REALISTIC CAR RENDERING。IP IMAGE MODELING。AI VIDEO EDITING。
                嗨！我是得燃 Deran，26 岁。专注三维动效和视频剪辑设计。做事习惯规划先行、追求高效。欢迎来到我的作品展示，我始终保持探索与学习的姿态，力求产出更优质的视觉作品。
                Hi, I’m Deran, 26. I specialize in 3D motion graphics and video editing. I believe in planning ahead and working efficiently. Welcome to my portfolio — I’m always exploring and learning, striving to create better visual work.
              </p>
              <img
                className="about-panel-clean"
                src={asset('about-no-copy.webp')}
                alt=""
                aria-hidden="true"
                loading="eager"
              />
              <span className="text-static-mask about-mask-services-1" aria-hidden="true" />
              <span className="text-static-mask about-mask-services-2" aria-hidden="true" />
              <span className="text-static-mask about-mask-services-3" aria-hidden="true" />
              <span className="text-static-mask about-mask-services-4" aria-hidden="true" />
              <span className="text-static-mask about-mask-label" aria-hidden="true" />
              <span className="text-static-mask about-mask-caption" aria-hidden="true" />
              <TextImageReveal
                className="about-motion-services"
                src="text-motion/services-about.png"
                slices={serviceSlices}
                intrinsicWidth={1278}
                intrinsicHeight={33}
                delay={0.02}
                itemDelay={0.07}
              />
              <TextImageReveal className="about-motion-label" src="about-label.png" delay={0.2} />
              <TextImageReveal
                className="about-motion-copy-zh"
                src="text-motion/about-copy-zh.png"
                mode="line-mask"
                slices={toSliceObjects(lineSlices.aboutZh)}
                intrinsicWidth={901}
                intrinsicHeight={230}
                delay={0.28}
              />
              <TextImageReveal
                className="about-motion-copy-en"
                src="text-motion/about-copy-en.png"
                mode="line-mask"
                slices={toSliceObjects(lineSlices.aboutEn)}
                intrinsicWidth={916}
                intrinsicHeight={358}
                delay={0.42}
              />
              <TextImageReveal className="about-motion-caption" src="text-motion/about-avatar-caption.png" delay={0.55} />
            </SectionTextSequence>
            <ExperienceSection />
            <SectionTextSequence id="portfolio" data-nav-section className="static-section-anchor static-portfolio-anchor">
              <h2 className="sr-only">PORTFOLIO 作品</h2>
              <img className="static-panel-source static-panel-source-portfolio" src={asset('continuous-06.webp')} alt="" aria-hidden="true" loading="eager" />
              <img
                className="portfolio-panel-clean"
                src={asset('catalogue-bg-opaque.webp')}
                alt=""
                aria-hidden="true"
                loading="eager"
              />
              <span className="portfolio-panel-shade" aria-hidden="true" />
              <span className="portfolio-panel-grid" aria-hidden="true" />
              <div className="catalogue-motion-title" aria-hidden="true">
                <TextImageReveal className="catalogue-motion-paren" src="paren-left.png" mode="scale-settle" delay={0.08} />
                <TextImageReveal className="catalogue-motion-word" src="catalogue-wordmark.png" mode="scale-settle" delay={0} />
                <TextImageReveal className="catalogue-motion-paren" src="paren-right.png" mode="scale-settle" delay={0.08} />
              </div>
              <p className="portfolio-static-note">
                Build frameworks with rationality, let motion infuse visuals with emotion. Through 3D and imagery, depict ephemeral visual sensations.<br />
                Deconstruct established visual conventions, keep experimenting, and unlock the boundless potential inherent in motion itself.
              </p>
              <PortfolioMotionCards
                activeCard={hoveredCard}
                onActivate={setHoveredCard}
                onDeactivate={id => setHoveredCard(current => current === id ? null : current)}
              />
            </SectionTextSequence>
            <SectionTextSequence
              id="contact"
              data-nav-section
              className="static-section-anchor static-contact-anchor"
            >
              <h2 className="sr-only">CONTACT 联系方式</h2>
              <img className="static-panel-source static-panel-source-contact" src={asset('continuous-06.webp')} alt="" aria-hidden="true" loading="eager" />
              <p className="sr-only">
                感谢浏览到这里。Thanks for scrolling this far. 如果你对我的作品感兴趣，欢迎随时联系我。If you’re interested in my work, feel free to get in touch anytime. 期待与您合作。Looking forward to working with you.
              </p>
              <span className="text-static-mask contact-mask-services-1" aria-hidden="true" />
              <span className="text-static-mask contact-mask-services-2" aria-hidden="true" />
              <span className="text-static-mask contact-mask-services-3" aria-hidden="true" />
              <span className="text-static-mask contact-mask-services-4" aria-hidden="true" />
              <span className="text-static-mask contact-mask-thanks" aria-hidden="true" />
              <span className="text-static-mask contact-mask-invite" aria-hidden="true" />
              <span className="text-static-mask contact-mask-forward" aria-hidden="true" />
              <span className="text-static-mask contact-mask-arrow" aria-hidden="true" />
              <TextImageReveal className="contact-motion-services" src="text-motion/services-contact.png" slices={serviceSlices} intrinsicWidth={1278} intrinsicHeight={33} delay={0.02} itemDelay={0.07} />
              <TextImageReveal className="contact-motion-thanks-zh" src="text-motion/contact-thanks-zh.png" mode="line-mask" slices={toSliceObjects(lineSlices.thanksZh)} intrinsicWidth={201} intrinsicHeight={28} delay={0.1} />
              <TextImageReveal className="contact-motion-thanks-en" src="text-motion/contact-thanks-en.png" mode="line-mask" slices={toSliceObjects(lineSlices.thanksEn)} intrinsicWidth={354} intrinsicHeight={50} delay={0.16} />
              <TextImageReveal className="contact-motion-invite-zh" src="text-motion/contact-invite-zh.png" mode="line-mask" slices={toSliceObjects(lineSlices.inviteZh)} intrinsicWidth={308} intrinsicHeight={61} delay={0.28} />
              <TextImageReveal className="contact-motion-invite-en" src="text-motion/contact-invite-en.png" mode="line-mask" slices={toSliceObjects(lineSlices.inviteEn)} intrinsicWidth={332} intrinsicHeight={107} delay={0.34} />
              <TextImageReveal className="contact-motion-forward-zh" src="text-motion/contact-forward-zh.png" mode="line-mask" slices={toSliceObjects(lineSlices.forwardZh)} intrinsicWidth={173} intrinsicHeight={27} delay={0.46} />
              <TextImageReveal className="contact-motion-forward-en" src="text-motion/contact-forward-en.png" mode="line-mask" slices={toSliceObjects(lineSlices.forwardEn)} intrinsicWidth={280} intrinsicHeight={78} delay={0.52} />
              <TextImageReveal className="contact-motion-arrow" src="arrow-down.png" delay={0.7} />
              <button
                ref={contactPreviewTrigger}
                className="contact-card-zoom-trigger"
                type="button"
                aria-label="放大查看联系方式和微信二维码"
                onClick={openContactPreview}
              />
            </SectionTextSequence>
          </section>
        </main>
      </div>
      <ContactCardPreview open={contactPreviewOpen} onClose={closeContactPreview} />
    </>
  );
}

export function App() {
  const exportPage = new URLSearchParams(window.location.search).get('page');
  const route = staticHosting && exportPage && exportPage !== 'home'
    ? `/${exportPage}`
    : window.location.pathname.replace(/\/+$/, '') || '/';
  let page = <PortfolioSite />;
  if (route === '/cosmetics') page = <CosmeticsPage />;
  if (staticSeriesPages[route]) page = <StaticSeriesPage page={staticSeriesPages[route]} />;
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {page}
      </MotionConfig>
    </LazyMotion>
  );
}
