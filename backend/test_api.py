#!/usr/bin/env python
"""
اختبار API endpoints بشكل مباشر
"""
import requests
import json

def test_api_endpoints():
    """اختبار endpoints المختلفة"""
    
    base_url = "http://localhost:8000"
    
    print("🔍 اختبار API endpoints...")
    
    # اختبار الـ health check
    try:
        response = requests.get(f"{base_url}/admin/")
        print(f"✅ Admin page: {response.status_code}")
    except Exception as e:
        print(f"❌ Admin page خطأ: {e}")
    
    # اختبار JWT create endpoint
    try:
        response = requests.post(f"{base_url}/api/auth/jwt/create/", {
            "email": "test@example.com",
            "password": "testpass123"
        })
        print(f"✅ JWT create endpoint: {response.status_code}")
        if response.status_code == 400:
            print("   (400 طبيعي - بيانات غير صحيحة)")
    except Exception as e:
        print(f"❌ JWT create endpoint خطأ: {e}")
    
    # اختبار users endpoint
    try:
        response = requests.get(f"{base_url}/api/auth/users/")
        print(f"✅ Users endpoint: {response.status_code}")
    except Exception as e:
        print(f"❌ Users endpoint خطأ: {e}")
    
    # اختبار CORS headers
    try:
        response = requests.options(f"{base_url}/api/auth/jwt/create/", headers={
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        })
        print(f"✅ CORS preflight: {response.status_code}")
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        }
        print(f"   CORS Headers: {cors_headers}")
    except Exception as e:
        print(f"❌ CORS preflight خطأ: {e}")

if __name__ == '__main__':
    print("🧪 اختبار API endpoints\n")
    test_api_endpoints()
    print("\n✅ انتهى الاختبار!")
    print("\nإذا كانت جميع الاختبارات تعمل، فالمشكلة في الـ frontend")
    print("إذا كانت الاختبارات فاشلة، فالمشكلة في الـ backend")
