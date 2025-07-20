@echo off
echo ==========================================
echo    Django Development Server - SQLite
echo ==========================================
echo.

cd /d "c:\Users\YASSER\Desktop\django_project\backend"

echo 🔧 Setting up database...
python manage.py makemigrations
python manage.py migrate

echo.
echo 👤 Creating superuser...
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@admin.com').exists():
    User.objects.create_superuser('admin', 'admin@admin.com', 'admin123')
    print('✅ Superuser created: admin@admin.com / admin123')
else:
    print('✅ Superuser already exists')
"

echo.
echo 🚀 Starting Django server...
echo 🌐 Server will run on: http://127.0.0.1:8000
echo 👤 Login: admin@admin.com / admin123
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver 8000

pause
