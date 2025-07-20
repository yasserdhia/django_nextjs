@echo off
echo ==========================================
echo        ✅ Backend Container Status
echo ==========================================
echo.

cd /d "c:\Users\YASSER\Desktop\django_project"

echo 📊 Container Status:
docker-compose ps
echo.

echo 📝 Backend Logs (last 10 lines):
docker-compose logs --tail=10 backend
echo.

echo 🔍 Testing Backend Connection:
curl -s -o nul -w "HTTP Status: %%{http_code} - " http://localhost:8000/admin/
echo Backend Response
echo.

echo 🔍 Testing API Connection:
curl -s -o nul -w "HTTP Status: %%{http_code} - " http://localhost:8000/api/
echo API Response
echo.

echo 🌐 Available Services:
echo   - Backend: http://localhost:8000
echo   - Admin: http://localhost:8000/admin/
echo   - API: http://localhost:8000/api/
echo   - Database: localhost:5432
echo   - PgAdmin: http://localhost:8080
echo.

echo 👤 Login Credentials:
echo   - Admin: admin@admin.com / admin123
echo   - PgAdmin: admin@admin.com / admin
echo.

echo 🛠️ Useful Commands:
echo   docker-compose logs -f backend   (follow logs)
echo   docker-compose restart backend   (restart)
echo   docker-compose down              (stop all)
echo   docker-compose up -d             (start all)
echo.

pause
