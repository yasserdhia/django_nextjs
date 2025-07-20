#!/usr/bin/env python
"""
اختبار API endpoint لاستمارة المواطنين
"""
import requests
import json

def test_citizen_feedback_api():
    """اختبار API endpoint"""
    print("🧪 اختبار API endpoint لاستمارة المواطنين...")
    
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
    
    # إرسال الطلب
    url = 'http://localhost:8000/api/forms/citizen-feedback/'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN_HERE'  # يجب استبدال هذا بالتوكن الصحيح
    }
    
    try:
        response = requests.post(url, json=test_data, headers=headers)
        
        if response.status_code == 201:
            print("✅ تم إرسال الاستمارة بنجاح!")
            print(f"📋 الاستجابة: {response.json()}")
        else:
            print(f"❌ خطأ في الإرسال: {response.status_code}")
            print(f"📋 تفاصيل الخطأ: {response.json()}")
    
    except requests.exceptions.ConnectionError:
        print("❌ لا يمكن الاتصال بالخادم. تأكد من أن الخادم يعمل على localhost:8000")
    except Exception as e:
        print(f"❌ خطأ غير متوقع: {e}")

if __name__ == '__main__':
    test_citizen_feedback_api()
