@echo off
chcp 65001 >nul
title 交广新媒工坊

:: Find Node.js - check bundled first, then system
set "NODE=%~dp0app\node-v22.14.0-win-x64\node.exe"
if exist "%NODE%" goto :found

:: Check system Node
where node >nul 2>nul
if %errorlevel% equ 0 (
    set "NODE=node"
    goto :found
)

echo [错误] 未找到 Node.js
echo 请安装 Node.js ≥ 20：https://nodejs.org/zh-cn/
echo.
echo 或把 Node.js 便携版放到 app\node-v22.14.0-win-x64\
pause
exit /b 1

:found
cd /d "%~dp0app"

:: First run init
if not exist ".env" copy .env.example .env >nul 2>nul
if not exist "node_modules\better-sqlite3" (
    echo [首次运行] 安装依赖...
    call npm install --production --no-audit --no-fund 2>nul
)

echo.
echo ========================================
echo   交广新媒工坊 · insprira v1.1
echo   服务启动中... http://127.0.0.1:8080
echo ========================================
echo.

start http://127.0.0.1:8080
"%NODE%" server.js
pause
