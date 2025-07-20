import os
import django
from django.core.management import execute_from_command_line

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_dev')
django.setup()

# Run migrations
print("🔄 Running migrations...")
execute_from_command_line(['manage.py', 'migrate'])

# Create superuser if not exists
print("👤 Creating superuser...")
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@admin.com').exists():
    User.objects.create_superuser('admin', 'admin@admin.com', 'admin123')
    print('✅ Superuser created: admin@admin.com / admin123')
else:
    print('✅ Superuser already exists')

# Start server
print("🚀 Starting Django server on http://127.0.0.1:8000")
execute_from_command_line(['manage.py', 'runserver', '8000'])
