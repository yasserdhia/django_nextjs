#!/usr/bin/env python
"""
اختبار شامل لنظام الاستمارات الإلكترونية
"""
import os
import sys
import django

# إعداد Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_postgres')
sys.path.append('/app')
django.setup()

from django.contrib.auth import get_user_model
from custom_forms.models import CustomForm, FormResponse
from forms.models import CitizenFeedback

def test_database_connection():
    """اختبار الاتصال بقاعدة البيانات"""
    print("=== اختبار الاتصال بقاعدة البيانات ===")
    try:
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print("✅ الاتصال بقاعدة البيانات PostgreSQL ناجح")
        return True
    except Exception as e:
        print(f"❌ فشل الاتصال بقاعدة البيانات: {e}")
        return False

def test_user_model():
    """اختبار نموذج المستخدم"""
    print("\n=== اختبار نموذج المستخدم ===")
    try:
        User = get_user_model()
        user_count = User.objects.count()
        print(f"✅ عدد المستخدمين في النظام: {user_count}")
        
        # التحقق من وجود المستخدم الإداري
        if User.objects.filter(username='admin').exists():
            admin_user = User.objects.get(username='admin')
            print(f"✅ المستخدم الإداري موجود: {admin_user.username} ({admin_user.email})")
        else:
            print("⚠️ المستخدم الإداري غير موجود")
        
        return True
    except Exception as e:
        print(f"❌ خطأ في نموذج المستخدم: {e}")
        return False

def test_custom_forms():
    """اختبار نماذج الاستمارات المخصصة"""
    print("\n=== اختبار الاستمارات المخصصة ===")
    try:
        # إحصائيات الاستمارات المخصصة
        forms_count = CustomForm.objects.count()
        responses_count = FormResponse.objects.count()
        
        print(f"✅ عدد الاستمارات المخصصة: {forms_count}")
        print(f"✅ عدد الردود على الاستمارات المخصصة: {responses_count}")
        
        # عرض أول 3 استمارات
        if forms_count > 0:
            print("\n📋 الاستمارات المخصصة الموجودة:")
            for form in CustomForm.objects.all()[:3]:
                print(f"   - {form.title} ({form.category})")
        
        return True
    except Exception as e:
        print(f"❌ خطأ في الاستمارات المخصصة: {e}")
        return False

def test_citizen_feedback():
    """اختبار نماذج ملاحظات المواطنين"""
    print("\n=== اختبار ملاحظات المواطنين ===")
    try:
        feedback_count = CitizenFeedback.objects.count()
        print(f"✅ عدد ملاحظات المواطنين: {feedback_count}")
        
        # عرض أول 3 ملاحظات
        if feedback_count > 0:
            print("\n💬 ملاحظات المواطنين:")
            for feedback in CitizenFeedback.objects.all()[:3]:
                print(f"   - {feedback.subject}: {feedback.message[:50]}...")
        
        return True
    except Exception as e:
        print(f"❌ خطأ في ملاحظات المواطنين: {e}")
        return False

def create_test_data():
    """إنشاء بيانات تجريبية"""
    print("\n=== إنشاء بيانات تجريبية ===")
    try:
        # إنشاء استمارة مخصصة تجريبية
        if not CustomForm.objects.filter(title='استمارة تجريبية').exists():
            test_form = CustomForm.objects.create(
                title='استمارة تجريبية',
                description='هذه استمارة تجريبية لاختبار النظام',
                category='general',
                is_public=True,
                fields=[
                    {
                        'id': 'field_1',
                        'type': 'text',
                        'label': 'الاسم الكامل',
                        'required': True
                    },
                    {
                        'id': 'field_2',
                        'type': 'email',
                        'label': 'البريد الإلكتروني',
                        'required': True
                    },
                    {
                        'id': 'field_3',
                        'type': 'textarea',
                        'label': 'الرسالة',
                        'required': False
                    }
                ]
            )
            print(f"✅ تم إنشاء استمارة تجريبية: {test_form.title}")
        else:
            print("ℹ️ الاستمارة التجريبية موجودة بالفعل")
        
        # إنشاء ملاحظة مواطن تجريبية
        if not CitizenFeedback.objects.filter(subject='رسالة تجريبية').exists():
            test_feedback = CitizenFeedback.objects.create(
                name='أحمد محمد',
                email='ahmed@example.com',
                phone='01234567890',
                subject='رسالة تجريبية',
                message='هذه رسالة تجريبية لاختبار النظام',
                feedback_type='suggestion',
                related_entity='ministry_health'
            )
            print(f"✅ تم إنشاء ملاحظة تجريبية: {test_feedback.subject}")
        else:
            print("ℹ️ الملاحظة التجريبية موجودة بالفعل")
        
        return True
    except Exception as e:
        print(f"❌ خطأ في إنشاء البيانات التجريبية: {e}")
        return False

def main():
    """الدالة الرئيسية للاختبار"""
    print("🚀 بدء اختبار نظام الاستمارات الإلكترونية")
    print("=" * 50)
    
    tests = [
        test_database_connection,
        test_user_model,
        test_custom_forms,
        test_citizen_feedback,
        create_test_data
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 نتائج الاختبار: {passed}/{total} اختبار نجح")
    
    if passed == total:
        print("🎉 جميع الاختبارات نجحت! النظام جاهز للاستخدام")
        print("\n🌐 الروابط المتاحة:")
        print("   - الواجهة الأمامية: http://localhost:3000")
        print("   - منشئ الاستمارات: http://localhost:3000/admin/form-builder")
        print("   - لوحة الإدارة: http://localhost:8000/admin/")
        print("   - تسجيل الدخول: admin / admin123")
    else:
        print("⚠️ بعض الاختبارات فشلت، يرجى مراجعة الأخطاء أعلاه")

if __name__ == '__main__':
    main()
