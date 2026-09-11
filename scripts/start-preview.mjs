import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const address = 'http://127.0.0.1:4173/';
function openPreview() {
  spawn('explorer.exe', [address], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
}
const running = await new Promise(resolve => {
  const request = http.get(address, response => {
    let body = '';
    response.on('data', chunk => body += chunk);
    response.on('end', () => resolve(body.includes('DERAN') ? 'deran' : 'other'));
  });
  request.setTimeout(1500, () => request.destroy());
  request.on('error', () => resolve(false));
});
if (running === 'deran') {
  openPreview();
  console.log(`Preview is already running: ${address}`);
} else if (running === 'other') {
  console.error('Port 4173 is in use by another application. Close that application or choose another Vite port.');
  process.exitCode = 1;
} else {
  const child = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { cwd: root, stdio: ['inherit', 'pipe', 'inherit'], windowsHide: true });
  let opened = false;
  child.stdout.on('data', chunk => {
    process.stdout.write(chunk);
    if (!opened && chunk.toString().includes('127.0.0.1:4173')) { opened = true; openPreview(); }
  });
  child.on('exit', code => { process.exitCode = code || 0; });
  process.on('SIGINT', () => child.kill());
}
