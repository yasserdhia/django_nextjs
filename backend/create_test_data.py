#!/usr/bin/env python
import os
import django
import sys
from datetime import date

# إعداد Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_postgres')
django.setup()

from forms.models import GovernmentEntity, CitizenFeedback, FormSubmission
from accounts.models import User

def create_sample_data():
    try:
        # الحصول على المستخدم المدير
        user = User.objects.get(email='admin@admin.com')
        
        # إنشاء جهات حكومية
        gov1, created = GovernmentEntity.objects.get_or_create(
            entity_name='وزارة الداخلية',
            defaults={
                'entity_type': 'وزارة',
                'governorate': 'بغداد',
                'phone_number': '07801234567',
                'email': 'interior@gov.iq',
                'address': 'ساحة الخلاني، بغداد',
                'manager_name': 'أحمد محمد',
                'manager_position': 'مدير عام',
                'manager_phone': '07801234567',
                'manager_email': 'manager@interior.gov.iq',
                'employee_count': 5000,
                'services_provided': 'الأمن العام، الجوازات، الإقامة',
                'establishment_date': date(2000, 1, 1),
                'submitted_by': user,
                'is_approved': True
            }
        )
        
        gov2, created = GovernmentEntity.objects.get_or_create(
            entity_name='وزارة التربية',
            defaults={
                'entity_type': 'وزارة',
                'governorate': 'بغداد',
                'phone_number': '07801234568',
                'email': 'education@gov.iq',
                'address': 'الجادرية، بغداد',
                'manager_name': 'فاطمة علي',
                'manager_position': 'مدير عام',
                'manager_phone': '07801234568',
                'manager_email': 'manager@education.gov.iq',
                'employee_count': 3000,
                'services_provided': 'التعليم الابتدائي، الثانوي، الجامعي',
                'establishment_date': date(1950, 1, 1),
                'submitted_by': user,
                'is_approved': False
            }
        )
        
        # إنشاء ملاحظات مواطنين
        feedback1, created = CitizenFeedback.objects.get_or_create(
            citizen_name='محمد أحمد',
            citizen_email='mohammed@email.com',
            defaults={
                'citizen_phone': '07701234567',
                'citizen_address': 'بغداد - الكرخ',
                'citizen_id': '123456789',
                'feedback_type': 'complaint',
                'title': 'شكوى حول الخدمات',
                'description': 'هناك تأخير في معالجة الأوراق',
                'priority': 'high',
                'status': 'pending',
                'related_entity': gov1
            }
        )
        
        feedback2, created = CitizenFeedback.objects.get_or_create(
            citizen_name='سارة علي',
            citizen_email='sara@email.com',
            defaults={
                'citizen_phone': '07701234568',
                'citizen_address': 'بغداد - الرصافة',
                'citizen_id': '987654321',
                'feedback_type': 'suggestion',
                'title': 'اقتراح لتحسين الخدمات',
                'description': 'يمكن تحسين الخدمات الإلكترونية',
                'priority': 'medium',
                'status': 'resolved',
                'related_entity': gov2
            }
        )
        
        # إنشاء form submissions
        FormSubmission.objects.get_or_create(
            reference_number='REF-001',
            defaults={
                'submission_type': 'government_entity',
                'submitter_name': 'أحمد محمد',
                'submitter_email': 'ahmed@email.com',
                'government_entity': gov1,
                'processed_by': user
            }
        )
        
        FormSubmission.objects.get_or_create(
            reference_number='REF-002',
            defaults={
                'submission_type': 'citizen_feedback',
                'submitter_name': 'محمد أحمد',
                'submitter_email': 'mohammed@email.com',
                'citizen_feedback': feedback1,
                'processed_by': user
            }
        )
        
        print('✅ تم إنشاء البيانات النموذجية بنجاح')
        print(f'- الجهات الحكومية: {GovernmentEntity.objects.count()}')
        print(f'- ملاحظات المواطنين: {CitizenFeedback.objects.count()}')
        print(f'- تقديمات الاستمارات: {FormSubmission.objects.count()}')
        
    except Exception as e:
        print(f'❌ خطأ في إنشاء البيانات: {e}')

if __name__ == '__main__':
    create_sample_data()
