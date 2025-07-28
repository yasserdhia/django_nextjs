#!/usr/bin/env python
"""
Create test custom form for testing
"""
import os
import sys
import json

# Add the backend directory to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from custom_forms.models import CustomForm
from accounts.models import User

def create_test_form():
    # Get or create a test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"✅ Created test user: {user.username}")
    else:
        print(f"✅ Using existing test user: {user.username}")
    
    # Create test form
    test_form_data = {
        'title': 'استمارة الاقتراحات والشكاوى',
        'description': 'استمارة لجمع اقتراحات وشكاوى المواطنين',
        'category': 'complaints',
        'is_public': True,
        'is_active': True,
        'fields': [
            {
                'id': 'citizen_name',
                'type': 'text',
                'label': 'اسم المواطن',
                'required': True,
                'placeholder': 'ادخل اسمك الكامل'
            },
            {
                'id': 'national_id',
                'type': 'text',
                'label': 'الرقم الوطني',
                'required': True,
                'placeholder': 'ادخل رقمك الوطني'
            },
            {
                'id': 'phone',
                'type': 'tel',
                'label': 'رقم الهاتف',
                'required': True,
                'placeholder': 'ادخل رقم هاتفك'
            },
            {
                'id': 'email',
                'type': 'email',
                'label': 'البريد الإلكتروني',
                'required': False,
                'placeholder': 'ادخل بريدك الإلكتروني (اختياري)'
            },
            {
                'id': 'complaint_type',
                'type': 'select',
                'label': 'نوع الطلب',
                'required': True,
                'options': [
                    {'value': 'complaint', 'label': 'شكوى'},
                    {'value': 'suggestion', 'label': 'اقتراح'},
                    {'value': 'inquiry', 'label': 'استفسار'}
                ]
            },
            {
                'id': 'subject',
                'type': 'text',
                'label': 'موضوع الطلب',
                'required': True,
                'placeholder': 'عنوان مختصر للطلب'
            },
            {
                'id': 'details',
                'type': 'textarea',
                'label': 'تفاصيل الطلب',
                'required': True,
                'placeholder': 'اكتب تفاصيل طلبك هنا...',
                'rows': 5
            },
            {
                'id': 'priority',
                'type': 'select',
                'label': 'درجة الأهمية',
                'required': True,
                'options': [
                    {'value': 'high', 'label': 'عالية'},
                    {'value': 'medium', 'label': 'متوسطة'},
                    {'value': 'low', 'label': 'منخفضة'}
                ]
            }
        ]
    }
    
    # Check if form already exists
    existing_form = CustomForm.objects.filter(title=test_form_data['title']).first()
    if existing_form:
        print(f"✅ Test form already exists: {existing_form.title} (ID: {existing_form.id})")
        return existing_form
    
    # Create the form
    form = CustomForm.objects.create(
        title=test_form_data['title'],
        description=test_form_data['description'],
        category=test_form_data['category'],
        is_public=test_form_data['is_public'],
        is_active=test_form_data['is_active'],
        fields=test_form_data['fields'],
        created_by=user
    )
    
    print(f"✅ Created test form: {form.title} (ID: {form.id})")
    print(f"   📊 Fields: {len(form.fields)}")
    print(f"   🌐 Public: {form.is_public}")
    print(f"   ✅ Active: {form.is_active}")
    
    return form

if __name__ == '__main__':
    print("🚀 Creating Test Custom Form...")
    print("=" * 50)
    
    form = create_test_form()
    
    print("\n✨ Test form ready!")
    print(f"📝 Form ID: {form.id}")
    print(f"🌐 Public URL: http://localhost:3000/forms/public")
    print(f"🔧 Admin URL: http://localhost:3000/admin/forms-management")
