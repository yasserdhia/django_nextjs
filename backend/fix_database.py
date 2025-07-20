#!/usr/bin/env python
"""
Script لتطبيق الـ migrations وإصلاح قاعدة البيانات
"""
import os
import sys
import django
from django.core.management import execute_from_command_line
from django.db import connection

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def run_migrations():
    """تطبيق الـ migrations"""
    print("🔄 بدء تطبيق الـ migrations...")
    
    try:
        # عرض الـ migrations الحالية
        print("📋 عرض حالة الـ migrations...")
        execute_from_command_line(['manage.py', 'showmigrations', 'forms'])
        
        # تطبيق الـ migrations
        print("🔄 تطبيق الـ migrations...")
        execute_from_command_line(['manage.py', 'migrate', 'forms'])
        
        print("✅ تم تطبيق الـ migrations بنجاح!")
        
    except Exception as e:
        print(f"❌ خطأ في تطبيق الـ migrations: {e}")
        
        # في حالة الخطأ، نحاول إعادة إنشاء الـ migrations
        print("🔄 محاولة إعادة إنشاء الـ migrations...")
        try:
            execute_from_command_line(['manage.py', 'makemigrations', 'forms'])
            execute_from_command_line(['manage.py', 'migrate', 'forms'])
            print("✅ تم إعادة إنشاء وتطبيق الـ migrations بنجاح!")
        except Exception as e2:
            print(f"❌ خطأ في إعادة إنشاء الـ migrations: {e2}")

def check_database_structure():
    """التحقق من هيكل قاعدة البيانات"""
    print("🔍 التحقق من هيكل قاعدة البيانات...")
    
    try:
        with connection.cursor() as cursor:
            # التحقق من وجود جدول CitizenFeedback
            cursor.execute("""
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'forms_citizenfeedback'
                ORDER BY ordinal_position;
            """)
            
            columns = cursor.fetchall()
            if columns:
                print("✅ جدول CitizenFeedback موجود مع الأعمدة التالية:")
                for column in columns:
                    print(f"  - {column[0]}: {column[1]} ({'NULL' if column[2] == 'YES' else 'NOT NULL'})")
            else:
                print("❌ جدول CitizenFeedback غير موجود")
                
    except Exception as e:
        print(f"❌ خطأ في التحقق من قاعدة البيانات: {e}")

if __name__ == '__main__':
    check_database_structure()
    run_migrations()
    check_database_structure()
