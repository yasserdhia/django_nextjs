@echo off
echo ========================================
echo        Django Development Server
echo ========================================
echo.

cd /d c:\Users\YASSER\Desktop\django_project\backend

echo 🔧 Using SQLite database for development...
set DJANGO_SETTINGS_MODULE=backend.settings_dev

echo 🔄 Applying migrations...
python manage.py makemigrations
python manage.py migrate

echo 👤 Creating superuser (if needed)...
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@admin.com').exists():
    User.objects.create_superuser('admin', 'admin@admin.com', 'admin123')
    print('✅ Superuser created: admin@admin.com / admin123')
else:
    print('✅ Superuser already exists')
"

echo 🚀 Starting Django server...
python manage.py runserver 8000

pause
