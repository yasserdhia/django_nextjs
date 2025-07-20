@echo off
echo ==========================================
echo        📝 Docker Backend Logs
echo ==========================================
echo.

cd /d "c:\Users\YASSER\Desktop\django_project"

echo 📊 Container Status:
docker-compose ps
echo.

echo 📝 Backend Logs:
echo ==========================================
docker-compose logs backend
echo.

echo 📝 Database Logs:
echo ==========================================
docker-compose logs db
echo.

echo 🔄 For live logs, use: docker-compose logs -f backend
echo 🛑 To stop containers: docker-compose down
echo 🔄 To restart: docker-compose restart backend
echo.

pause
