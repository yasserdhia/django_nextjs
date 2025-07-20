import requests
import json

def test_login():
    url = "http://127.0.0.1:8000/api/auth/token/login/"
    data = {
        "email": "admin@admin.com",
        "password": "admin123"
    }
    
    print("🔍 Testing login endpoint...")
    print(f"URL: {url}")
    print(f"Data: {data}")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            token_data = response.json()
            print(f"Token: {token_data.get('auth_token', 'No token found')}")
            return token_data.get('auth_token')
        else:
            print("❌ Login failed!")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_protected_endpoint(token):
    if not token:
        print("No token available for testing")
        return
        
    url = "http://127.0.0.1:8000/api/auth/users/me/"
    headers = {"Authorization": f"Token {token}"}
    
    print("\n🔍 Testing protected endpoint...")
    print(f"URL: {url}")
    print(f"Headers: {headers}")
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Protected endpoint accessible!")
        else:
            print("❌ Protected endpoint failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    token = test_login()
    test_protected_endpoint(token)
