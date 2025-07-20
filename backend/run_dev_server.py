import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_dev')
    print("🔧 Using SQLite database for development...")
    
    # Setup Django
    django.setup()
    
    # Apply migrations
    print("🔄 Applying migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Create superuser if needed
    print("👤 Creating superuser (if needed)...")
    from django.contrib.auth import get_user_model
    User = get_user_model()
    if not User.objects.filter(email='admin@admin.com').exists():
        User.objects.create_superuser('admin', 'admin@admin.com', 'admin123')
        print('✅ Superuser created: admin@admin.com / admin123')
    else:
        print('✅ Superuser already exists')
    
    # Start server
    print("🚀 Starting Django server...")
    execute_from_command_line(['manage.py', 'runserver', '8000'])
