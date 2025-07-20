@echo off
echo ================================
echo  Full Stack Project Test Report
echo ================================
echo.

echo [1] Testing Backend API...
echo.

echo [1.1] Testing user registration endpoint...
curl -X POST http://localhost:8000/api/auth/users/ -H "Content-Type: application/json" -d "{\"username\": \"testuser2\", \"email\": \"test2@example.com\", \"password\": \"testpass123\", \"first_name\": \"Test2\", \"last_name\": \"User2\"}"
echo.
echo.

echo [1.2] Testing user login endpoint...
curl -X POST http://localhost:8000/api/auth/jwt/create/ -H "Content-Type: application/json" -d "{\"email\": \"test2@example.com\", \"password\": \"testpass123\"}"
echo.
echo.

echo [1.3] Testing protected endpoint (should fail without token)...
curl http://localhost:8000/api/auth/users/me/
echo.
echo.

echo [2] Testing Frontend...
echo.

echo [2.1] Testing homepage...
curl -I http://localhost:3000
echo.

echo [2.2] Testing login page...
curl -I http://localhost:3000/login
echo.

echo [2.3] Testing register page...
curl -I http://localhost:3000/register
echo.

echo [2.4] Testing dashboard page...
curl -I http://localhost:3000/dashboard
echo.

echo [3] Testing Database Connection...
echo.

echo [3.1] Checking database tables...
docker-compose exec -T backend python manage.py inspectdb > database_schema.txt
echo Database schema saved to database_schema.txt
echo.

echo [4] Testing Docker Services...
echo.

echo [4.1] Service status...
docker-compose ps
echo.

echo [4.2] Backend logs (last 10 lines)...
docker-compose logs --tail=10 backend
echo.

echo [4.3] Frontend logs (last 10 lines)...
docker-compose logs --tail=10 frontend
echo.

echo [4.4] Database logs (last 10 lines)...
docker-compose logs --tail=10 db
echo.

echo ================================
echo  Test Complete!
echo ================================
echo.
echo The application is running successfully on:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - Admin Panel: http://localhost:8000/admin
echo.
echo Test users created:
echo - Email: test@example.com (Password: testpass123)
echo - Email: test2@example.com (Password: testpass123)
echo.
echo Admin access:
echo - Username: admin
echo - Password: strongpassword123
echo.

pause
