#!/usr/bin/env python
"""
اختبار إصلاح خطأ related_entity
"""
import os
import sys
import django
from django.conf import settings

# Add the project directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Configure Django
django.setup()

from forms.models import CitizenFeedback
from forms.serializers import CitizenFeedbackCreateSerializer

def test_citizen_feedback_creation():
    """اختبار إنشاء ملاحظة مواطن جديدة"""
    print("🧪 اختبار إنشاء ملاحظة مواطن...")
    
    # بيانات تجريبية
    test_data = {
        'citizen_name': 'احمد محمد',
        'citizen_phone': '07701234567',
        'citizen_email': 'ahmed@email.com',
        'citizen_address': 'بغداد - الكرخ',
        'citizen_id': '1234567890',
        'age': 30,
        'gender': 'male',
        'education_level': 'bachelor',
        'occupation': 'مهندس',
        'governorate': 'baghdad',
        'city': 'بغداد',
        'feedback_type': 'suggestion',
        'title': 'اقتراح تحسين الخدمات',
        'description': 'أقترح تحسين الخدمات الإلكترونية للمواطنين...',
        'related_entity': 'وزارة الداخلية',  # نص عادي الآن
        'priority': 'medium',
        'preferred_contact_method': 'email',
        'previous_attempts': False,
        'consent_data_processing': True,
        'consent_contact': True,
    }
    
    # إنشاء الـ serializer
    serializer = CitizenFeedbackCreateSerializer(data=test_data)
    
    if serializer.is_valid():
        print("✅ البيانات صحيحة")
        try:
            # حفظ البيانات
            feedback = serializer.save()
            print(f"✅ تم إنشاء الملاحظة بنجاح: {feedback.id}")
            print(f"📋 الجهة المعنية: {feedback.related_entity}")
            print(f"📋 نوع الملاحظة: {feedback.get_feedback_type_display()}")
        except Exception as e:
            print(f"❌ خطأ في الحفظ: {e}")
    else:
        print("❌ خطأ في التحقق من البيانات:")
        for field, errors in serializer.errors.items():
            print(f"  - {field}: {errors}")

if __name__ == '__main__':
    test_citizen_feedback_creation()
