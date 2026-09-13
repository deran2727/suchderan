import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = join(projectRoot, 'dist', 'client')
const distIndexPath = join(distRoot, 'index.html')
const exportRoot = join(projectRoot, 'exports', 'DERAN-2026-portfolio-html')
const exportPath = join(exportRoot, 'DERAN-2026-作品集.html')

function copyAssets(source, destination) {
  mkdirSync(destination, { recursive: true })

  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name)
    const destinationPath = join(destination, entry.name)

    if (entry.isDirectory()) {
      copyAssets(sourcePath, destinationPath)
      continue
    }

    const destinationIsCurrent = existsSync(destinationPath)
      && statSync(sourcePath).size === statSync(destinationPath).size

    if (!destinationIsCurrent) {
      copyFileSync(sourcePath, destinationPath)
    }
  }
}

if (!existsSync(distIndexPath)) {
  throw new Error('Missing dist/client/index.html. Run the production build first.')
}

const builtHtml = readFileSync(distIndexPath, 'utf8')
const scriptMatch = builtHtml.match(/<script\b[^>]*\bsrc=["']\.\/(assets\/[^"']+\.js)["'][^>]*><\/script>/i)
const styleMatch = builtHtml.match(/<link\b[^>]*\bhref=["']\.\/(assets\/[^"']+\.css)["'][^>]*>/i)

if (!scriptMatch || !styleMatch) {
  throw new Error('Could not resolve the generated Vite JavaScript and CSS bundles.')
}

const bundledJavaScript = readFileSync(join(distRoot, scriptMatch[1]), 'utf8').replaceAll('</script', '<\\/script')
const bundledCss = readFileSync(join(distRoot, styleMatch[1]), 'utf8')
  .replace(/url\((['"]?)\.\.\/assets\//g, 'url($1./assets/')
const previousExport = existsSync(exportPath) ? readFileSync(exportPath, 'utf8') : ''
let preservedStyle = previousExport.match(/<style id="deran-experience-polish">[\s\S]*?<\/style>/)?.[0] ?? ''
let preservedScript = previousExport.match(/<script id="deran-experience-polish-script">[\s\S]*?<\/script>/)?.[0] ?? ''

if (!preservedStyle || !preservedScript) {
  throw new Error('The existing deran-experience-polish style/script blocks must be present before exporting.')
}

const mobileExperienceStyle = `
      /* mobile-experience-export */
      @media (max-width: 760px) {
        .deran-mobile-experience {
          min-height: auto;
          padding: 84px 20px 72px;
        }
        .deran-mobile-experience-title {
          margin: 0;
          color: var(--deran-paper);
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: clamp(58px, 17vw, 74px);
          font-weight: 400;
          line-height: .84;
          letter-spacing: -.025em;
        }
        .deran-mobile-experience-title-cn {
          margin: 18px 0 0;
          color: var(--deran-paper);
          font-size: 32px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -.055em;
        }
        .deran-mobile-experience-kicker {
          margin: 18px 0 0;
          color: #818181;
          font-size: 10px;
          line-height: 1.2;
        }
        .deran-mobile-experience-figure {
          position: relative;
          height: 310px;
          margin: 24px -20px 0;
          overflow: hidden;
        }
        .deran-mobile-experience-figure::after {
          content: "";
          position: absolute;
          inset: auto 0 0;
          height: 20%;
          background: linear-gradient(transparent, #000);
        }
        .deran-mobile-experience-figure img {
          position: absolute;
          left: -22%;
          bottom: -3%;
          display: block;
          width: 150%;
          max-width: none;
        }
        .deran-mobile-experience-list {
          border-top: 1px solid var(--deran-line);
        }
        .deran-mobile-experience-item {
          border-bottom: 1px solid var(--deran-line);
        }
        .deran-mobile-experience-item summary {
          position: relative;
          display: grid;
          grid-template-columns: 25px minmax(0, 1fr) auto 28px;
          gap: 8px;
          min-height: 104px;
          align-items: start;
          padding: 20px 0 18px;
          color: var(--deran-paper);
          cursor: pointer;
          list-style: none;
          -webkit-tap-highlight-color: transparent;
        }
        .deran-mobile-experience-item summary::-webkit-details-marker { display: none; }
        .deran-mobile-experience-item summary::after {
          content: "+";
          display: grid;
          width: 28px;
          aspect-ratio: 1;
          place-items: center;
          margin-top: -2px;
          border: 1px solid #666;
          border-radius: 50%;
          font-size: 18px;
          line-height: 1;
        }
        .deran-mobile-experience-item[open] summary::after {
          content: "−";
          border-color: var(--deran-red);
          background: var(--deran-red);
        }
        .deran-mobile-experience-item[open] summary::before {
          content: "";
          position: absolute;
          left: -20px;
          top: 20px;
          width: 3px;
          height: 52px;
          background: var(--deran-red);
        }
        .deran-mobile-experience-index {
          padding-top: 3px;
          color: #666;
          font-size: 9px;
        }
        .deran-mobile-experience-main { display: grid; gap: 5px; }
        .deran-mobile-experience-main strong { font-size: 15px; line-height: 1.22; }
        .deran-mobile-experience-main span { font-size: 12px; }
        .deran-mobile-experience-date {
          color: #d1d1d1;
          font-size: 10px;
          white-space: nowrap;
        }
        .deran-mobile-experience-detail {
          display: grid;
          gap: 20px;
          padding: 0 18px 26px 33px;
          color: #b5b5b5;
          animation: deran-mobile-experience-in 480ms cubic-bezier(.22, 1, .36, 1) both;
        }
        .deran-mobile-experience-detail h3 {
          margin: 0 0 10px;
          color: var(--deran-red);
          font-size: 10px;
          letter-spacing: .08em;
        }
        .deran-mobile-experience-detail ol {
          display: grid;
          gap: 7px;
          margin: 0;
          padding-left: 1.35em;
        }
        .deran-mobile-experience-detail li { font-size: 11px; line-height: 1.5; }
        @keyframes deran-mobile-experience-in {
          from { opacity: 0; transform: translateY(16px); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .deran-mobile-experience-detail { animation: none; }
      }
`

const mobileExperienceMarkup = `
          <section id="mobile-experience" class="deran-mobile-section deran-mobile-experience" aria-labelledby="mobile-experience-title">
            <div class="mobile-reveal">
              <h2 id="mobile-experience-title" class="deran-mobile-experience-title">EXPERIENCE</h2>
              <p class="deran-mobile-experience-title-cn">工作经历</p>
              <p class="deran-mobile-experience-kicker">SOME PATHS ARE QUIET,<br />BUT STILL LEAD FORWARD.</p>
              <div class="deran-mobile-experience-figure" aria-hidden="true"><img src="./assets/experience-character.webp" alt="" /></div>
              <div class="deran-mobile-experience-list">
                <details class="deran-mobile-experience-item"><summary><span class="deran-mobile-experience-index">01</span><span class="deran-mobile-experience-main"><strong>广州樊文花化妆品有限公司</strong><span>视频剪辑</span></span><span class="deran-mobile-experience-date">2026.06 - 至今</span></summary><div class="deran-mobile-experience-detail"><div><h3>工作内容</h3><ol><li>公司官方视频号的日常更新</li><li>公司日常活动的对外宣发剪辑</li><li>公司新品 TVC 的制作</li></ol></div><div><h3>项目业绩</h3><ol><li>公司官方视频号 AI 视频转发与收藏破千</li><li>公司大型年中总结大会的内部视频剪辑</li><li>公司新品 TVC 的制作</li></ol></div></div></details>
                <details class="deran-mobile-experience-item"><summary><span class="deran-mobile-experience-index">02</span><span class="deran-mobile-experience-main"><strong>广州市升睿汽车用品有限公司</strong><span>三维渲染师</span></span><span class="deran-mobile-experience-date">2025.10 - 2026.04</span></summary><div class="deran-mobile-experience-detail"><div><h3>工作内容</h3><ol><li>负责汽车卷材、车衣与车膜渲染输出</li><li>公司网站相关汽车渲染图输出</li><li>汽车定制化喷涂渲染工作</li><li>网站汽车用品动画制作</li></ol></div></div></details>
                <details class="deran-mobile-experience-item"><summary><span class="deran-mobile-experience-index">03</span><span class="deran-mobile-experience-main"><strong>广州奥耶士设计事务所有限公司</strong><span>三维设计师</span></span><span class="deran-mobile-experience-date">2024.05 - 2025.05</span></summary><div class="deran-mobile-experience-detail"><div><h3>工作内容</h3><ol><li>根据设计师要求，输出三维效果图，辅助完成餐饮项目提案</li><li>在已完成项目中输出三维效果图，完成公司品牌案例发布</li><li>根据需求完成餐饮项目与视频剪辑工作</li></ol></div><div><h3>项目业绩</h3><ol><li>无穷新品商场货架堆头三维效果图</li><li>大快活线下多家门店视频制作</li><li>半天妖线下店打卡墙装置落地</li><li>嘉士伯新品 KV 三维效果图输出</li><li>龙歌品牌 IP 三维建模输出</li><li>黑手制局周年视频及机场、地铁视频制作</li></ol></div></div></details>
                <details class="deran-mobile-experience-item"><summary><span class="deran-mobile-experience-index">04</span><span class="deran-mobile-experience-main"><strong>杭州南风效应品牌设计有限公司</strong><span>品牌设计</span></span><span class="deran-mobile-experience-date">2022.10 - 2023.10</span></summary><div class="deran-mobile-experience-detail"><div><h3>工作内容</h3><ol><li>负责品牌、包装、Logo 与品牌手册等设计</li><li>参与新项目孵化，输出品牌提案，制定品牌 VI 和应用规范</li><li>完成设计方案所需的部分插画工作</li><li>与客户、印刷厂沟通，跟进校色及印刷效果</li></ol></div><div><h3>项目业绩</h3><ol><li>辅助完成多个品牌从零到一的品牌搭建</li><li>独立完成品牌全案设计与品牌手册交付</li><li>参与品牌设计落地，对接打印校色和工艺</li></ol></div></div></details>
              </div>
            </div>
          </section>

`

if (!preservedStyle.includes('mobile-experience-export')) {
  preservedStyle = preservedStyle.replace('</style>', `${mobileExperienceStyle}</style>`)
}

if (!preservedScript.includes('id="mobile-experience"')) {
  preservedScript = preservedScript
    .replace('          <section id="mobile-portfolio"', `${mobileExperienceMarkup}          <section id="mobile-portfolio"`)
    .replace(
      '              { name: "portfolio", element: document.getElementById(useMobileSections ? "mobile-portfolio" : "portfolio") },',
      '              { name: "experience", element: document.getElementById(useMobileSections ? "mobile-experience" : "experience") },\n              { name: "portfolio", element: document.getElementById(useMobileSections ? "mobile-portfolio" : "portfolio") },',
    )
    .replace(
      '        const mobileContactCard = showcase.querySelector(".deran-mobile-contact-card");',
      `        showcase.querySelectorAll(".deran-mobile-experience-item").forEach((item) => {
          item.addEventListener("toggle", () => {
            if (!item.open) return;
            showcase.querySelectorAll(".deran-mobile-experience-item[open]").forEach((other) => {
              if (other !== item) other.removeAttribute("open");
            });
          });
        });

        const mobileContactCard = showcase.querySelector(".deran-mobile-contact-card");`,
    )
}

const headMarkup = builtHtml
  .match(/<head>([\s\S]*?)<\/head>/i)?.[1]
  ?.replace(scriptMatch[0], '')
  .replace(styleMatch[0], '')
  .trim()

if (!headMarkup) {
  throw new Error('Could not read the Vite document head.')
}

const exportedHtml = `<!doctype html>
<html lang="zh-CN">
  <head>
    ${headMarkup.replaceAll('\n', '\n    ')}
    <script type="module">\n${bundledJavaScript}\n    </script>
    <style>\n${bundledCss}\n    </style>
    ${preservedStyle}
  </head>
  <body>
    <div id="root"></div>
    ${preservedScript}
  </body>
</html>
`

mkdirSync(exportRoot, { recursive: true })
copyAssets(join(distRoot, 'assets'), join(exportRoot, 'assets'))
writeFileSync(exportPath, exportedHtml, 'utf8')

console.log(`Exported standalone portfolio: ${exportPath}`)
