#!/bin/bash
# This script initializes the Django project after Docker setup

echo "🚀 Initializing Django project..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Create and apply migrations
echo "📦 Creating and applying migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (will prompt for details)
echo "👤 Creating superuser..."
python manage.py createsuperuser

echo "✅ Django project initialized successfully!"
echo "🌐 You can now access:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:8000"
echo "   - Admin: http://localhost:8000/admin"
