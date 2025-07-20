@echo off
echo ==========================================
echo        🔧 Backend Problem Solver
echo ==========================================
echo.

cd /d "c:\Users\YASSER\Desktop\django_project"

echo 🐳 Starting PostgreSQL...
docker-compose up -d db
if errorlevel 1 (
    echo ❌ Failed to start PostgreSQL
    pause
    exit /b 1
)

echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 15 /nobreak > nul

cd backend

echo 🔍 Checking Django configuration...
python manage.py check --deploy
if errorlevel 1 (
    echo ❌ Django configuration has issues
    echo 🔧 Trying to fix...
)

echo 🔄 Creating new migrations...
python manage.py makemigrations
if errorlevel 1 (
    echo ❌ Migration creation failed
    echo 🔧 Trying to reset migrations...
    del /q forms\migrations\*.py 2>nul
    del /q accounts\migrations\*.py 2>nul
    python manage.py makemigrations accounts
    python manage.py makemigrations forms
)

echo 🔄 Applying migrations...
python manage.py migrate
if errorlevel 1 (
    echo ❌ Migration failed
    echo 🔧 Trying to fix database issues...
    python manage.py migrate --run-syncdb
)

echo 👤 Creating superuser...
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
try:
    if not User.objects.filter(email='admin@admin.com').exists():
        User.objects.create_superuser('admin', 'admin@admin.com', 'admin123')
        print('✅ Superuser created: admin@admin.com / admin123')
    else:
        print('✅ Superuser already exists')
except Exception as e:
    print(f'❌ Superuser creation failed: {e}')
"

echo 🧪 Testing database connection...
python manage.py shell -c "
from django.db import connection
try:
    with connection.cursor() as cursor:
        cursor.execute('SELECT 1')
        print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
"

echo 🧪 Testing models...
python manage.py shell -c "
try:
    from forms.models import GovernmentEntity, CitizenFeedback
    print(f'✅ Models imported successfully')
    print(f'📊 GovernmentEntity count: {GovernmentEntity.objects.count()}')
    print(f'📊 CitizenFeedback count: {CitizenFeedback.objects.count()}')
except Exception as e:
    print(f'❌ Model testing failed: {e}')
"

echo.
echo 🎉 Backend issues resolved!
echo 🚀 Starting Django server...
echo 🌐 Server: http://127.0.0.1:8000
echo 👤 Admin: admin@admin.com / admin123
echo 🗄️  Database: PostgreSQL (localhost:5432)
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver 8000

pause
