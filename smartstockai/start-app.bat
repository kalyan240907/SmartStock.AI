@echo off
title SmartStock AI - Launcher
echo Starting SmartStock AI...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-server.ps1"
if %errorlevel% neq 0 (
    echo.
    echo Opening directly in default web browser...
    start "" "%~dp0index.html"
)
pause
