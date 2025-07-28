@echo off
echo 🚀 بناء وتشغيل مشروع Django + Next.js مع SQL Server Management Studio 22
echo.

echo 🛑 إيقاف الحاويات الحالية...
docker-compose down -v

echo 🔨 بناء الحاويات الجديدة...
docker-compose build --no-cache

echo ▶️ تشغيل SQL Server أولاً...
docker-compose up -d db

echo ⏳ انتظار تشغيل SQL Server (30 ثانية)...
timeout /t 30 /nobreak > nul

echo 🗄️ إعداد قاعدة البيانات...
docker-compose exec backend python setup_sqlserver.py

echo ▶️ تشغيل جميع الخدمات...
docker-compose up -d

echo.
echo ✅ تم تشغيل المشروع بنجاح!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8000
echo 📊 Admin Panel: http://localhost:8000/admin/
echo.
echo 📊 اتصال SQL Server Management Studio:
echo 🖥️ Server: localhost,1433
echo 👤 Authentication: SQL Server Authentication
echo 👤 Login: sa
echo 🔑 Password: StrongPass123!
echo 🗄️ Database: formsdb
echo.
echo 📧 تسجيل دخول Admin Panel:
echo Email: admin@example.com
echo Password: admin123
echo.
pause
