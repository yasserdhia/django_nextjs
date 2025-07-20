#!/usr/bin/env python
"""
تشخيص مشكلة CORS وتسجيل الدخول
"""
import os
import sys
import django
from django.conf import settings

# إعداد Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def check_cors_settings():
    """التحقق من إعدادات CORS"""
    print("🔍 التحقق من إعدادات CORS...")
    
    # التحقق من وجود corsheaders في INSTALLED_APPS
    if 'corsheaders' in settings.INSTALLED_APPS:
        print("✅ corsheaders موجود في INSTALLED_APPS")
    else:
        print("❌ corsheaders غير موجود في INSTALLED_APPS")
    
    # التحقق من وجود CorsMiddleware في MIDDLEWARE
    if 'corsheaders.middleware.CorsMiddleware' in settings.MIDDLEWARE:
        print("✅ CorsMiddleware موجود في MIDDLEWARE")
    else:
        print("❌ CorsMiddleware غير موجود في MIDDLEWARE")
    
    # التحقق من CORS_ALLOWED_ORIGINS
    if hasattr(settings, 'CORS_ALLOWED_ORIGINS'):
        print(f"✅ CORS_ALLOWED_ORIGINS: {settings.CORS_ALLOWED_ORIGINS}")
    else:
        print("❌ CORS_ALLOWED_ORIGINS غير مضبوط")
    
    # التحقق من CORS_ALLOW_ALL_ORIGINS
    if hasattr(settings, 'CORS_ALLOW_ALL_ORIGINS'):
        print(f"✅ CORS_ALLOW_ALL_ORIGINS: {settings.CORS_ALLOW_ALL_ORIGINS}")
    else:
        print("❌ CORS_ALLOW_ALL_ORIGINS غير مضبوط")

def check_auth_settings():
    """التحقق من إعدادات المصادقة"""
    print("\n🔍 التحقق من إعدادات المصادقة...")
    
    # التحقق من وجود djoser في INSTALLED_APPS
    if 'djoser' in settings.INSTALLED_APPS:
        print("✅ djoser موجود في INSTALLED_APPS")
    else:
        print("❌ djoser غير موجود في INSTALLED_APPS")
    
    # التحقق من وجود rest_framework_simplejwt في INSTALLED_APPS
    if 'rest_framework_simplejwt' in settings.INSTALLED_APPS:
        print("✅ rest_framework_simplejwt موجود في INSTALLED_APPS")
    else:
        print("❌ rest_framework_simplejwt غير موجود في INSTALLED_APPS")
    
    # التحقق من REST_FRAMEWORK settings
    if hasattr(settings, 'REST_FRAMEWORK'):
        print("✅ REST_FRAMEWORK settings موجودة")
        auth_classes = settings.REST_FRAMEWORK.get('DEFAULT_AUTHENTICATION_CLASSES', [])
        if 'rest_framework_simplejwt.authentication.JWTAuthentication' in auth_classes:
            print("✅ JWTAuthentication مضبوط")
        else:
            print("❌ JWTAuthentication غير مضبوط")
    else:
        print("❌ REST_FRAMEWORK settings غير موجودة")

def check_database_connection():
    """التحقق من الاتصال بقاعدة البيانات"""
    print("\n🔍 التحقق من الاتصال بقاعدة البيانات...")
    
    try:
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        print("✅ الاتصال بقاعدة البيانات يعمل بشكل صحيح")
    except Exception as e:
        print(f"❌ خطأ في الاتصال بقاعدة البيانات: {e}")

def check_urls():
    """التحقق من URL patterns"""
    print("\n🔍 التحقق من URL patterns...")
    
    try:
        from django.urls import reverse
        # محاولة الحصول على URL لـ JWT create
        jwt_create_url = reverse('jwt-create')
        print(f"✅ JWT create URL: {jwt_create_url}")
    except Exception as e:
        print(f"❌ خطأ في JWT create URL: {e}")
        
    try:
        from django.urls import reverse
        # محاولة الحصول على URL لـ users
        users_url = reverse('user-list')
        print(f"✅ Users URL: {users_url}")
    except Exception as e:
        print(f"❌ خطأ في Users URL: {e}")

if __name__ == '__main__':
    print("🔧 تشخيص مشكلة CORS وتسجيل الدخول\n")
    
    check_cors_settings()
    check_auth_settings()
    check_database_connection()
    check_urls()
    
    print("\n✅ انتهى التشخيص!")
    print("\nللتشغيل اليدوي:")
    print("1. قم بتشغيل: python manage.py runserver 8000")
    print("2. تأكد من أن الخادم يعمل على http://localhost:8000")
    print("3. جرب الدخول إلى http://localhost:8000/admin في المتصفح")
    print("4. تأكد من أن Next.js يعمل على http://localhost:3000")
