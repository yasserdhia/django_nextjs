#!/usr/bin/env python
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
print("1. Django imported successfully")

django.setup()
print("2. Django setup completed")

# Test database connection
from django.db import connection
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    print("3. Database connection successful")
except Exception as e:
    print(f"3. Database connection failed: {e}")

# Test model imports
try:
    from custom_forms.models import CustomForm, FormResponse
    print("4. Custom forms models imported successfully")
except Exception as e:
    print(f"4. Model import failed: {e}")

# Test serializer imports
try:
    from custom_forms.serializers import CustomFormSerializer
    print("5. Serializers imported successfully")
except Exception as e:
    print(f"5. Serializer import failed: {e}")

# Test view imports
try:
    from custom_forms.views import CustomFormCreateView
    print("6. Views imported successfully")
except Exception as e:
    print(f"6. View import failed: {e}")

print("All tests completed!")
