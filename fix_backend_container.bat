@echo off
echo ==========================================
echo        🔧 Backend Container Fixer
echo ==========================================
echo.

cd /d "c:\Users\YASSER\Desktop\django_project"

echo 🛑 Stopping all containers...
docker-compose down

echo 🧹 Removing backend container and image...
docker-compose rm -f backend
docker rmi django_project-backend 2>nul

echo 🔨 Rebuilding backend image...
docker-compose build --no-cache backend
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo 🐳 Starting database first...
docker-compose up -d db

echo ⏳ Waiting for database to be ready...
timeout /t 15 /nobreak > nul

echo 🚀 Starting backend container...
docker-compose up -d backend

echo 📊 Checking container status...
docker-compose ps

echo.
echo ⏳ Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo 📝 Backend logs:
docker-compose logs backend

echo.
echo 🔍 Testing connection...
curl -s http://localhost:8000/admin/ >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend not responding
    echo 📝 Full logs:
    docker-compose logs backend
) else (
    echo ✅ Backend is working!
    echo 🌐 Available at: http://localhost:8000
    echo 👤 Admin: admin@admin.com / admin123
)

echo.
echo 🛠️ Useful commands:
echo   docker-compose logs -f backend   (follow logs)
echo   docker-compose restart backend   (restart container)
echo   docker-compose ps                (check status)
echo.

pause
