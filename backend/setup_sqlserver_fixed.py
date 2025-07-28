#!/usr/bin/env python
"""
سكريبت لإعداد SQL Server وإنشاء قاعدة البيانات
"""
import os
import sys
import django
import pyodbc
import time

# إضافة مجلد المشروع إلى المسار
sys.path.append('/app')

# إعداد Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_sqlserver')
django.setup()

def wait_for_sql_server():
    """انتظار تشغيل SQL Server"""
    print("انتظار تشغيل SQL Server...")
    max_attempts = 30
    attempt = 0
    
    while attempt < max_attempts:
        try:
            # محاولة الاتصال بـ SQL Server
            connection_string = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=db,1433;UID=sa;PWD=StrongPass123!;TrustServerCertificate=yes"
            conn = pyodbc.connect(connection_string, timeout=5)
            conn.close()
            print("✓ SQL Server جاهز!")
            return True
        except Exception as e:
            attempt += 1
            print(f"محاولة {attempt}/{max_attempts}: {str(e)}")
            time.sleep(2)
    
    print("❌ فشل في الاتصال بـ SQL Server")
    return False

def create_database():
    """إنشاء قاعدة البيانات إذا لم تكن موجودة"""
    try:
        print("إنشاء قاعدة البيانات...")
        
        # الاتصال بـ master database مع تعطيل autocommit
        connection_string = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=db,1433;DATABASE=master;UID=sa;PWD=StrongPass123!;TrustServerCertificate=yes"
        conn = pyodbc.connect(connection_string)
        conn.autocommit = True  # تفعيل autocommit لتجنب transaction
        cursor = conn.cursor()
        
        # التحقق من وجود قاعدة البيانات
        cursor.execute("SELECT name FROM sys.databases WHERE name = 'formsdb'")
        if cursor.fetchone():
            print("✓ قاعدة البيانات موجودة بالفعل")
        else:
            # إنشاء قاعدة البيانات
            print("📝 إنشاء قاعدة البيانات 'formsdb'...")
            cursor.execute("CREATE DATABASE formsdb")
            print("✓ تم إنشاء قاعدة البيانات بنجاح")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ خطأ في إنشاء قاعدة البيانات: {str(e)}")
        return False

def run_migrations():
    """تشغيل migrations"""
    try:
        print("تشغيل migrations...")
        
        from django.core.management import execute_from_command_line
        
        # تطبيق migrations
        execute_from_command_line(['manage.py', 'makemigrations'])
        execute_from_command_line(['manage.py', 'migrate'])
        
        print("✓ تم تطبيق migrations بنجاح")
        return True
        
    except Exception as e:
        print(f"❌ خطأ في تطبيق migrations: {str(e)}")
        return False

def create_superuser():
    """إنشاء مستخدم إداري"""
    try:
        from django.contrib.auth import get_user_model
        user_model = get_user_model()
        
        if not user_model.objects.filter(email='admin@example.com').exists():
            user_model.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            print("✓ تم إنشاء المستخدم الإداري: admin@example.com/admin123")
        else:
            print("✓ المستخدم الإداري موجود بالفعل")
        return True
        
    except Exception as e:
        print(f"❌ خطأ في إنشاء المستخدم الإداري: {str(e)}")
        return False

def main():
    """الدالة الرئيسية"""
    print("=== إعداد SQL Server ===")
    
    # انتظار SQL Server
    if not wait_for_sql_server():
        sys.exit(1)
    
    # إنشاء قاعدة البيانات
    if not create_database():
        sys.exit(1)
    
    # انتظار قليل للتأكد من إنشاء قاعدة البيانات
    time.sleep(2)
    
    # تطبيق migrations
    if not run_migrations():
        sys.exit(1)
    
    # إنشاء مستخدم إداري
    if not create_superuser():
        sys.exit(1)
    
    print("🎉 تم الإعداد بنجاح!")
    print("📊 يمكنك الآن استخدام SQL Server Management Studio للاتصال:")
    print("🖥️ Server: localhost,1433")
    print("👤 Login: sa")
    print("🔑 Password: StrongPass123!")
    print("🗄️ Database: formsdb")
    print("")
    print("📧 تسجيل دخول Admin Panel:")
    print("Email: admin@example.com")
    print("Password: admin123")

if __name__ == '__main__':
    main()
