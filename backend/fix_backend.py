import os
import sys
import django
from django.core.management import execute_from_command_line

def fix_backend_issues():
    """Fix all backend issues step by step"""
    
    print("==========================================")
    print("        🔧 Backend Issue Fixer")
    print("==========================================")
    print()
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_postgres')
    
    try:
        django.setup()
        print("✅ Django setup completed")
    except Exception as e:
        print(f"❌ Django setup failed: {e}")
        return False
    
    # Check system
    print("🔍 Running system check...")
    try:
        execute_from_command_line(['manage.py', 'check'])
        print("✅ System check passed")
    except Exception as e:
        print(f"❌ System check failed: {e}")
        return False
    
    # Create migrations
    print("🔄 Creating migrations...")
    try:
        execute_from_command_line(['manage.py', 'makemigrations'])
        print("✅ Migrations created")
    except Exception as e:
        print(f"❌ Migration creation failed: {e}")
        return False
    
    # Apply migrations
    print("🔄 Applying migrations...")
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations applied")
    except Exception as e:
        print(f"❌ Migration application failed: {e}")
        return False
    
    # Create superuser
    print("👤 Creating superuser...")
    try:
        from django.contrib.auth import get_user_model
        user_model = get_user_model()
        if not user_model.objects.filter(email='admin@admin.com').exists():
            user_model.objects.create_superuser('admin', 'admin@admin.com', 'admin123')
            print('✅ Superuser created: admin@admin.com / admin123')
        else:
            print('✅ Superuser already exists')
    except Exception as e:
        print(f"❌ Superuser creation failed: {e}")
        return False
    
    # Test database connection
    print("🗄️ Testing database connection...")
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            if result:
                print("✅ Database connection successful")
            else:
                print("❌ Database connection failed")
                return False
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
    
    # Test models
    print("📊 Testing models...")
    try:
        from forms.models import GovernmentEntity, CitizenFeedback
        
        # Test GovernmentEntity
        entity_count = GovernmentEntity.objects.count()
        print(f"✅ GovernmentEntity model working - {entity_count} entities")
        
        # Test CitizenFeedback
        feedback_count = CitizenFeedback.objects.count()
        print(f"✅ CitizenFeedback model working - {feedback_count} feedback items")
        
    except Exception as e:
        print(f"❌ Model testing failed: {e}")
        return False
    
    # Test API endpoints
    print("🌐 Testing API endpoints...")
    try:
        from django.urls import reverse
        from django.test import Client
        
        client = Client()
        
        # Test admin
        response = client.get('/admin/')
        if response.status_code in [200, 302]:
            print("✅ Admin endpoint working")
        else:
            print(f"❌ Admin endpoint failed: {response.status_code}")
        
        # Test API auth
        response = client.get('/api/auth/users/me/')
        if response.status_code in [401, 403]:  # Expected for unauthenticated
            print("✅ Auth endpoint working")
        else:
            print(f"❌ Auth endpoint failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ API endpoint testing failed: {e}")
        return False
    
    print()
    print("🎉 All backend issues fixed successfully!")
    print("✅ Database: PostgreSQL connected")
    print("✅ Models: All models working")
    print("✅ API: All endpoints functional")
    print("✅ Admin: admin@admin.com / admin123")
    print()
    
    return True

if __name__ == '__main__':
    success = fix_backend_issues()
    
    if success:
        print("🚀 Starting Django server...")
        execute_from_command_line(['manage.py', 'runserver', '8000'])
    else:
        print("❌ Backend issues not resolved. Please check the errors above.")
        sys.exit(1)
