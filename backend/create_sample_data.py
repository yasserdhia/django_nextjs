#!/usr/bin/env python3
"""
Script to create sample data for testing pgAdmin functionality
"""

import os
import sys
import django
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append('/app')

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from accounts.models import User
from django.contrib.auth.hashers import make_password

def create_sample_users():
    """Create sample users for testing"""
    sample_users = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'is_active': True,
            'is_staff': False,
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'is_active': True,
            'is_staff': False,
        },
        {
            'username': 'admin_user',
            'email': 'admin@example.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'is_active': True,
            'is_staff': True,
        },
        {
            'username': 'test_user',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'is_active': False,
            'is_staff': False,
        },
    ]
    
    created_count = 0
    
    for user_data in sample_users:
        try:
            # Check if user already exists
            if not User.objects.filter(username=user_data['username']).exists():
                # Create user with hashed password
                user = User.objects.create(
                    username=user_data['username'],
                    email=user_data['email'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    is_active=user_data['is_active'],
                    is_staff=user_data['is_staff'],
                    password=make_password('password123')  # Default password
                )
                created_count += 1
                print(f"✅ Created user: {user.username}")
            else:
                print(f"⚠️ User {user_data['username']} already exists")
        except Exception as e:
            print(f"❌ Error creating user {user_data['username']}: {e}")
    
    print(f"\n📊 Summary: {created_count} users created successfully")

def print_user_stats():
    """Print user statistics"""
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    staff_users = User.objects.filter(is_staff=True).count()
    
    print("\n📈 User Statistics:")
    print(f"Total Users: {total_users}")
    print(f"Active Users: {active_users}")
    print(f"Staff Users: {staff_users}")

if __name__ == "__main__":
    print("🚀 Creating sample data for pgAdmin testing...")
    create_sample_users()
    print_user_stats()
    print("\n✅ Sample data creation completed!")
    print("\n🌐 You can now view this data in pgAdmin at: http://localhost:8080")
    print("📋 Login: admin@admin.com / admin")
    print("🔍 Navigate to: Servers → Django PostgreSQL → Databases → fullstack_db → Schemas → public → Tables → accounts_user")
