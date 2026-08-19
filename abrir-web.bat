@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   Munay Suyu  -  http://localhost:4600
echo.
start "" http://localhost:4600
node servidor.js
pause
