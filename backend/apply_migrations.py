#!/usr/bin/env python
"""
Script to apply Django migrations manually
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

# Add the project directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Configure Django
django.setup()

# Apply migrations
if __name__ == '__main__':
    try:
        print("🔄 تطبيق الـ migrations...")
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ تم تطبيق الـ migrations بنجاح")
    except Exception as e:
        print(f"❌ خطأ في تطبيق الـ migrations: {e}")
