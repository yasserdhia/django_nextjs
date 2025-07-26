#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    
    try:
        django.setup()
        print("✅ Django setup successful!")
        print(f"✅ Database engine: {settings.DATABASES['default']['ENGINE']}")
        print(f"✅ Database name: {settings.DATABASES['default']['NAME']}")
        
        # Check if we can import our custom app
        from custom_forms.models import CustomForm
        print("✅ Custom forms model imported successfully!")
        
        # Try to run migrate command
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations applied successfully!")
        
        # Try to start the server
        print("🚀 Starting Django server...")
        execute_from_command_line(['manage.py', 'runserver'])
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
