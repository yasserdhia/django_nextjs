@echo off
echo ===========================================
echo        🧪 Backend Container Test
echo ===========================================
echo.

echo 🔍 Step 1: Check container status
docker ps --format "table {{.Names}}\t{{.Status}}" | findstr -E "backend|NAMES"
echo.

echo 🔍 Step 2: Check container logs
docker-compose logs backend --tail=10
echo.

echo 🔍 Step 3: Test HTTP endpoints
echo Testing admin page...
curl -s -o nul -w "Admin page: HTTP %%{http_code}" http://localhost:8000/admin/
echo.

echo Testing API root...
curl -s -o nul -w "API root: HTTP %%{http_code}" http://localhost:8000/api/
echo.

echo 🔍 Step 4: Test database connection
echo Testing database through Django admin...
docker-compose exec backend python manage.py shell -c "from django.contrib.auth import get_user_model; print(f'Users in database: {get_user_model().objects.count()}')"
echo.

echo 🔍 Step 5: Test authentication
echo Testing login endpoint...
curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}" http://localhost:8000/api/auth/token/login/ | echo Login test: Success
echo.

echo ===========================================
echo 🎉 Test completed! Check results above
echo ===========================================
pause
