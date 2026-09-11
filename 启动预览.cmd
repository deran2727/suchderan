@echo off
setlocal
cd /d "%~dp0"
set "DERAN_NODE=C:\Users\masser\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%DERAN_NODE%" set "DERAN_NODE=node"
"%DERAN_NODE%" scripts\start-preview.mjs
if errorlevel 1 pause
