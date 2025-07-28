#!/usr/bin/env python
"""
اختبار الاتصال بـ SQL Server
"""
import os
import sys
import django
import pyodbc

# إعداد Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_sqlserver')
sys.path.append('/app')
django.setup()

def test_sqlserver_connection():
    """اختبار الاتصال بـ SQL Server"""
    print("=== اختبار الاتصال بـ SQL Server ===")
    
    try:
        # اختبار الاتصال المباشر
        print("1. اختبار الاتصال المباشر...")
        connection_string = "DRIVER={ODBC Driver 18 for SQL Server};SERVER=db,1433;UID=sa;PWD=YourStrong@Password123;TrustServerCertificate=yes"
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        cursor.execute("SELECT @@VERSION")
        version = cursor.fetchone()[0]
        print(f"✓ نجح الاتصال! إصدار SQL Server: {version[:50]}...")
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ فشل الاتصال المباشر: {str(e)}")
        return False
    
    try:
        # اختبار الاتصال عبر Django
        print("\n2. اختبار الاتصال عبر Django...")
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print("✓ نجح الاتصال عبر Django!")
        
        # عرض معلومات قاعدة البيانات
        cursor.execute("SELECT DB_NAME()")
        db_name = cursor.fetchone()[0]
        print(f"✓ قاعدة البيانات الحالية: {db_name}")
        
    except Exception as e:
        print(f"❌ فشل الاتصال عبر Django: {str(e)}")
        return False
    
    try:
        # اختبار الجداول
        print("\n3. عرض الجداول الموجودة...")
        cursor.execute("""
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_NAME
        """)
        tables = cursor.fetchall()
        
        if tables:
            print("✓ الجداول الموجودة:")
            for table in tables:
                print(f"   - {table[0]}")
        else:
            print("ℹ️ لا توجد جداول (سيتم إنشاؤها عند تطبيق migrations)")
        
    except Exception as e:
        print(f"❌ خطأ في عرض الجداول: {str(e)}")
    
    return True

def test_django_models():
    """اختبار نماذج Django"""
    print("\n=== اختبار نماذج Django ===")
    
    try:
        from django.contrib.auth.models import User
        user_count = User.objects.count()
        print(f"✓ عدد المستخدمين: {user_count}")
        
    except Exception as e:
        print(f"❌ خطأ في نماذج Django: {str(e)}")
        return False
    
    try:
        # اختبار custom_forms models
        from custom_forms.models import CustomForm
        form_count = CustomForm.objects.count()
        print(f"✓ عدد الاستمارات المخصصة: {form_count}")
        
    except Exception as e:
        print(f"ℹ️ نماذج custom_forms غير متاحة بعد: {str(e)}")
    
    return True

if __name__ == '__main__':
    if test_sqlserver_connection():
        test_django_models()
        print("\n=== اكتمل الاختبار بنجاح! ===")
    else:
        print("\n=== فشل في الاختبار ===")
        sys.exit(1)
