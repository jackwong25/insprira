@echo off
title Jiaoguang Workshop - Insprira

:: Use bundled Node.js
set "NODE=%~dp0app\nodejs\node.exe"
if not exist "%NODE%" (
    echo Bundled Node.js not found. Please re-download the package.
    pause
    exit /b 1
)

cd /d "%~dp0app"

:: First run init
if not exist ".env" copy .env.example .env >nul 2>nul
if not exist "node_modules\better-sqlite3" (
    echo Installing dependencies...
    call npm install --production --no-audit --no-fund
)

echo.
echo ========================================
echo   Jiaoguang Workshop - Insprira v1.1
echo   Starting server... http://127.0.0.1:8080
echo ========================================
echo.

start http://127.0.0.1:8080
"%NODE%" server.js
pause
