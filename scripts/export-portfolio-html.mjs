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
const preservedStyle = previousExport.match(/<style id="deran-experience-polish">[\s\S]*?<\/style>/)?.[0] ?? ''
const preservedScript = previousExport.match(/<script id="deran-experience-polish-script">[\s\S]*?<\/script>/)?.[0] ?? ''

if (!preservedStyle || !preservedScript) {
  throw new Error('The existing deran-experience-polish style/script blocks must be present before exporting.')
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
