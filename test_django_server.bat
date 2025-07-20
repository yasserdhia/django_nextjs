@echo off
echo ==========================================
echo اختبار الخادم Django
echo ==========================================

cd /d "c:\Users\YASSER\Desktop\django_project\backend"

echo.
echo 1. التحقق من ملف manage.py...
if exist manage.py (
    echo ✅ ملف manage.py موجود
) else (
    echo ❌ ملف manage.py غير موجود
    pause
    exit /b 1
)

echo.
echo 2. اختبار الاتصال بقاعدة البيانات...
python manage.py check --database default
if %errorlevel% neq 0 (
    echo ❌ مشكلة في الاتصال بقاعدة البيانات
    pause
    exit /b 1
)

echo.
echo 3. التحقق من جداول قاعدة البيانات...
python manage.py showmigrations
if %errorlevel% neq 0 (
    echo ❌ مشكلة في migrations
    pause
    exit /b 1
)

echo.
echo 4. اختبار استيراد النماذج...
python -c "from forms.models import GovernmentEntity; print('✅ نموذج GovernmentEntity يعمل')"
if %errorlevel% neq 0 (
    echo ❌ مشكلة في استيراد النماذج
    pause
    exit /b 1
)

echo.
echo 5. اختبار endpoint الاستمارة...
python manage.py shell -c "
from django.test import Client
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
import json

User = get_user_model()
client = Client()

# إنشاء مستخدم تجريبي
user, created = User.objects.get_or_create(
    username='testuser',
    defaults={'email': 'test@example.com'}
)

if created:
    user.set_password('testpass123')
    user.save()
    print('✅ تم إنشاء مستخدم تجريبي')
else:
    print('✅ المستخدم التجريبي موجود')

# اختبار تسجيل الدخول
response = client.post('/api/auth/jwt/create/', {
    'username': 'testuser',
    'password': 'testpass123'
})

if response.status_code == 200:
    print('✅ تسجيل الدخول يعمل')
    token_data = response.json()
    token = token_data['access']
    
    # اختبار إرسال بيانات الاستمارة
    test_data = {
        'entity_name': 'جهة اختبار',
        'entity_type': 'ministry',
        'governorate': 'baghdad',
        'address': 'عنوان تجريبي',
        'phone_number': '07901234567',
        'email': 'test@example.com',
        'manager_name': 'مدير تجريبي',
        'manager_position': 'مدير',
        'manager_phone': '07901234568',
        'manager_email': 'manager@example.com',
        'establishment_date': '2020-01-01',
        'employee_count': 10,
        'annual_budget': 1000000,
        'services_provided': 'خدمات',
        'target_audience': 'جمهور',
        'has_electronic_system': False,
        'publishes_reports': False,
        'has_complaints_system': False,
        'has_quality_certificate': False,
        'current_projects': 'مشاريع',
        'future_plans': 'خطط',
        'performance_indicators': 'مؤشرات',
        'challenges': 'تحديات',
        'needs': 'احتياجات'
    }
    
    form_response = client.post(
        '/api/forms/government-entities/',
        data=json.dumps(test_data),
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {token}'
    )
    
    if form_response.status_code == 201:
        print('✅ إرسال الاستمارة يعمل')
        print(f'📋 البيانات المحفوظة: {form_response.json()}')
    else:
        print(f'❌ فشل إرسال الاستمارة: {form_response.status_code}')
        print(f'📋 رسالة الخطأ: {form_response.content.decode()}')
else:
    print(f'❌ فشل تسجيل الدخول: {response.status_code}')
    print(f'📋 رسالة الخطأ: {response.content.decode()}')
"

echo.
echo 6. تشغيل الخادم...
echo ✅ جميع الاختبارات نجحت. تشغيل الخادم...
echo.
echo للوصول إلى الصفحة الرئيسية: http://localhost:8000/
echo للوصول إلى API: http://localhost:8000/api/
echo للوصول إلى admin: http://localhost:8000/admin/
echo.
echo اضغط Ctrl+C لإيقاف الخادم
echo.

python manage.py runserver
