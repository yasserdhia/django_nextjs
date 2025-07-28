#!/bin/bash
set -e

echo "=========================================="
echo "        Django Backend Container"
echo "=========================================="
echo

echo "Setting up SQL Server database..."
python setup_sqlserver.py

echo "Starting Django development server..."
python manage.py runserver 0.0.0.0:8000
    print('Superuser already exists')
"

echo "Starting Django server..."
echo "Server will be available at: http://localhost:8000"
echo "Admin: admin@admin.com / admin123"
echo "Database: PostgreSQL"
echo

exec python manage.py runserver 0.0.0.0:8000
