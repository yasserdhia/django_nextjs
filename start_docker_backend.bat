@echo off
echo ==========================================
echo        🐳 Docker Backend Setup
echo ==========================================
echo.

cd /d "c:\Users\YASSER\Desktop\django_project"

echo 🛑 Stopping existing containers...
docker-compose down

echo 🧹 Cleaning up...
docker system prune -f

echo 🔨 Building backend image...
docker-compose build backend
if errorlevel 1 (
    echo ❌ Backend build failed
    pause
    exit /b 1
)

echo 🐳 Starting PostgreSQL database...
docker-compose up -d db

echo ⏳ Waiting for PostgreSQL...
timeout /t 10 /nobreak > nul

echo 🚀 Starting backend container...
docker-compose up -d backend

echo 📊 Checking container status...
docker-compose ps

echo 📝 Backend logs:
docker-compose logs backend

echo.
echo 🎉 Setup complete!
echo 🌐 Backend: http://localhost:8000
echo 👤 Admin: admin@admin.com / admin123
echo 🗄️  Database: PostgreSQL (localhost:5432)
echo.
echo To see live logs: docker-compose logs -f backend
echo To stop: docker-compose down
echo.

pause
