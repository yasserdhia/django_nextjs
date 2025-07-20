@echo off
echo Starting Full Stack Application...
echo.

echo Building and starting Docker containers...
docker-compose up --build

echo.
echo Application should be available at:
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.

pause
