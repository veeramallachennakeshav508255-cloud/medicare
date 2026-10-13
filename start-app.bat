@echo off
title CareConnect AI Launcher
echo ========================================================
echo      Starting CareConnect AI (Backend + Frontend)
echo ========================================================
echo.

echo [1/2] Launching Spring Boot Backend (Port 8080)...
start "CareConnect Backend" cmd /k "cd /d "%~dp0backend" && java -jar target\careconnect-backend-1.0.0.jar --spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration"

echo Waiting for backend initialization...
timeout /t 4 /nobreak >nul

echo [2/2] Launching Vite Frontend Dev Server (Port 5173)...
start "CareConnect Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo CareConnect AI is running!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080
echo ========================================================
echo Close the respective CMD windows to stop the servers.
pause
