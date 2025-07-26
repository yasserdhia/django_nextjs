#!/usr/bin/env python
"""
Django Debugging Script for Docker Container
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    
    print("=" * 50)
    print("Django Debug Information")
    print("=" * 50)
    
    try:
        import django
        print(f"✅ Django Version: {django.get_version()}")
    except Exception as e:
        print(f"❌ Django Import Error: {e}")
        return
    
    try:
        django.setup()
        print("✅ Django Setup: Successful")
    except Exception as e:
        print(f"❌ Django Setup Error: {e}")
        return
    
    # Check settings
    from django.conf import settings
    print(f"✅ Settings Module: {settings.SETTINGS_MODULE}")
    print(f"✅ Debug Mode: {settings.DEBUG}")
    print(f"✅ Database Engine: {settings.DATABASES['default']['ENGINE']}")
    
    # Check installed apps
    print("\n📦 Installed Apps:")
    for app in settings.INSTALLED_APPS:
        print(f"   - {app}")
    
    # Check custom_forms specifically
    print("\n🔍 Custom Forms App Check:")
    try:
        from custom_forms.apps import CustomFormsConfig
        print(f"   ✅ CustomFormsConfig found: {CustomFormsConfig.name}")
    except Exception as e:
        print(f"   ❌ CustomFormsConfig Error: {e}")
    
    try:
        from custom_forms.models import CustomForm
        print(f"   ✅ CustomForm model imported successfully")
    except Exception as e:
        print(f"   ❌ CustomForm model Error: {e}")
    
    # Check URLs
    print("\n🌐 URL Configuration Check:")
    try:
        from django.urls import get_resolver
        resolver = get_resolver()
        print(f"   ✅ URL patterns loaded successfully")
    except Exception as e:
        print(f"   ❌ URL Configuration Error: {e}")
    
    print("\n" + "=" * 50)
    print("Debug Complete")
    print("=" * 50)

if __name__ == '__main__':
    main()
