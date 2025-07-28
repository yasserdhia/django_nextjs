#!/usr/bin/env python
import os
import sys
import django

# إعداد Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_postgres')
sys.path.append('/app')
django.setup()

from django.contrib.auth import get_user_model

# إنشاء مستخدم إداري
User = get_user_model()

try:
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        print("✅ تم إنشاء المستخدم الإداري بنجاح")
        print("👤 اسم المستخدم: admin")
        print("🔑 كلمة المرور: admin123")
    else:
        user = User.objects.get(username='admin')
        user.set_password('admin123')
        user.save()
        print("✅ تم تحديث كلمة مرور المستخدم الإداري")
        print("👤 اسم المستخدم: admin")
        print("🔑 كلمة المرور: admin123")
except Exception as e:
    print(f"❌ خطأ في إنشاء المستخدم الإداري: {e}")
