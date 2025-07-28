#!/usr/bin/env python
"""
Test script for Custom Forms API endpoints
"""
import os
import sys
import json
import requests
from datetime import datetime

# Add the backend directory to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

# Import models
from custom_forms.models import CustomForm, FormResponse
from django.contrib.auth.models import User

BASE_URL = 'http://localhost:8000'

def test_api_endpoints():
    print("🔧 Testing Custom Forms API Endpoints...")
    print("=" * 50)
    
    # Test 1: Check if custom forms API is accessible
    try:
        response = requests.get(f'{BASE_URL}/api/custom-forms/')
        print(f"✅ GET /api/custom-forms/ - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   📊 Found {len(data)} custom forms")
            if data:
                print(f"   📝 First form: {data[0]['title']}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Error connecting to API: {str(e)}")
        return
    
    # Test 2: Check public forms endpoint
    try:
        response = requests.get(f'{BASE_URL}/api/custom-forms/public/')
        print(f"✅ GET /api/custom-forms/public/ - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   📊 Found {len(data)} public forms")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 3: Check specific form responses
    forms = CustomForm.objects.all()
    if forms:
        form = forms.first()
        try:
            response = requests.get(f'{BASE_URL}/api/custom-forms/{form.id}/responses/')
            print(f"✅ GET /api/custom-forms/{form.id}/responses/ - Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   📊 Found {len(data)} responses for form '{form.title}'")
            else:
                print(f"   ❌ Error: {response.text}")
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    # Test 4: Test form submission
    if forms:
        form = forms.first()
        test_data = {
            'submitter_name': 'Test User',
            'submitter_email': 'test@example.com',
            'response_data': {
                'field1': 'Test Response',
                'field2': 'Another Test Value'
            }
        }
        
        try:
            response = requests.post(
                f'{BASE_URL}/api/custom-forms/{form.id}/submit/',
                json=test_data,
                headers={'Content-Type': 'application/json'}
            )
            print(f"✅ POST /api/custom-forms/{form.id}/submit/ - Status: {response.status_code}")
            if response.status_code in [200, 201]:
                print(f"   📝 Test submission successful")
                data = response.json()
                print(f"   📊 Response ID: {data.get('id', 'N/A')}")
            else:
                print(f"   ❌ Error: {response.text}")
        except Exception as e:
            print(f"❌ Error: {str(e)}")

def check_database_data():
    print("\n🗄️ Checking Database Data...")
    print("=" * 50)
    
    # Check CustomForm objects
    forms_count = CustomForm.objects.count()
    print(f"📝 Total Custom Forms in DB: {forms_count}")
    
    if forms_count > 0:
        for form in CustomForm.objects.all()[:3]:  # Show first 3
            print(f"   - {form.title} (ID: {form.id}, Active: {form.is_active}, Public: {form.is_public})")
    
    # Check FormResponse objects
    responses_count = FormResponse.objects.count()
    print(f"📊 Total Form Responses in DB: {responses_count}")
    
    if responses_count > 0:
        for response in FormResponse.objects.all()[:3]:  # Show first 3
            print(f"   - Form: {response.form.title}, Submitter: {response.submitter_name}, Date: {response.submitted_at}")

if __name__ == '__main__':
    print("🚀 Custom Forms API Test Script")
    print("=" * 50)
    
    check_database_data()
    test_api_endpoints()
    
    print("\n✨ Test completed!")
