import subprocess
import sys
import time

def run_command(cmd, description):
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} - Success")
            if result.stdout:
                print(result.stdout)
        else:
            print(f"❌ {description} - Error")
            print(result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ {description} - Exception: {e}")
        return False

def main():
    print("🚀 Starting Django Setup and Test")
    print("=" * 50)
    
    # Change to backend directory
    import os
    os.chdir(r'c:\Users\YASSER\Desktop\django_project\backend')
    
    # Run migrations
    if not run_command("python manage.py migrate", "Running migrations"):
        return
        
    # Create superuser
    print("👤 Creating superuser...")
    create_user_script = '''
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email="admin@admin.com").exists():
    User.objects.create_superuser("admin", "admin@admin.com", "admin123")
    print("✅ Superuser created: admin@admin.com / admin123")
else:
    print("✅ Superuser already exists")
'''
    
    with open('create_user.py', 'w') as f:
        f.write(create_user_script)
    
    run_command("python manage.py shell < create_user.py", "Creating superuser")
    
    # Test login
    print("\n🧪 Testing login...")
    test_script = '''
import requests
import json

url = "http://127.0.0.1:8000/api/auth/token/login/"
data = {"email": "admin@admin.com", "password": "admin123"}

try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
'''
    
    with open('test_login.py', 'w') as f:
        f.write(test_script)
    
    # Start server in background
    print("\n🚀 Starting Django server...")
    import threading
    
    def start_server():
        subprocess.run("python manage.py runserver 8000", shell=True)
    
    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True
    server_thread.start()
    
    # Wait a bit for server to start
    time.sleep(3)
    
    # Test the server
    run_command("python test_login.py", "Testing login")
    
    print("\n✅ Setup complete!")
    print("🌐 Django server running on: http://127.0.0.1:8000")
    print("👤 Login credentials: admin@admin.com / admin123")
    print("🔗 API endpoints:")
    print("   - Login: http://127.0.0.1:8000/api/auth/token/login/")
    print("   - Profile: http://127.0.0.1:8000/api/auth/users/me/")
    print("   - Forms: http://127.0.0.1:8000/api/forms/")
    
    # Keep server running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

if __name__ == "__main__":
    main()
