#!/bin/bash
set -e

echo "=========================================="
echo "        🐳 Django Backend Container"
echo "=========================================="
echo

echo "🔄 Waiting for database..."
while ! nc -z db 5432; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done
echo "✅ Database is ready!"

echo "🔄 Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "👤 Creating superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@admin.com').exists():
    try:
        User.objects.create_superuser('admin', 'admin@admin.com', 'admin123')
        print('✅ Superuser created: admin@admin.com / admin123')
    except Exception as e:
        print(f'⚠️ Superuser creation failed: {e}')
else:
    print('✅ Superuser already exists')
"

echo "🚀 Starting Django server..."
echo "🌐 Server will be available at: http://localhost:8000"
echo "👤 Admin: admin@admin.com / admin123"
echo "🗄️  Database: PostgreSQL"
echo

exec python manage.py runserver 0.0.0.0:8000
