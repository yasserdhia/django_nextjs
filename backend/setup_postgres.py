import os
import sys
import time
import subprocess
import django
from django.core.management import execute_from_command_line

def check_postgres_connection():
    """Check if PostgreSQL is running and accessible"""
    try:
        import psycopg2
        conn = psycopg2.connect(
            host='localhost',
            database='fullstack_db',
            user='postgres',
            password='postgres',
            port='5432'
        )
        conn.close()
        return True
    except Exception as e:
        print(f"PostgreSQL connection failed: {e}")
        return False

def start_postgres_docker():
    """Start PostgreSQL Docker container"""
    try:
        print("🐳 Starting PostgreSQL Docker container...")
        result = subprocess.run(
            ['docker-compose', 'up', '-d', 'db'],
            cwd=r'c:\Users\YASSER\Desktop\django_project',
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ PostgreSQL container started successfully")
            return True
        else:
            print(f"❌ Failed to start PostgreSQL container: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error starting Docker container: {e}")
        return False

def setup_django_with_postgres():
    """Setup Django with PostgreSQL"""
    
    # Set settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_postgres')
    
    # Setup Django
    django.setup()
    
    # Wait for PostgreSQL to be ready
    print("⏳ Waiting for PostgreSQL to be ready...")
    for i in range(30):  # Wait up to 30 seconds
        if check_postgres_connection():
            print("✅ PostgreSQL is ready!")
            break
        time.sleep(1)
        print(f"Waiting... ({i+1}/30)")
    else:
        print("❌ PostgreSQL connection timeout")
        return False
    
    # Run migrations
    print("🔄 Running Django migrations...")
    try:
        execute_from_command_line(['manage.py', 'makemigrations'])
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations completed successfully")
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    # Create superuser
    print("👤 Creating superuser...")
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if not User.objects.filter(email='admin@admin.com').exists():
            User.objects.create_superuser('admin', 'admin@admin.com', 'admin123')
            print('✅ Superuser created: admin@admin.com / admin123')
        else:
            print('✅ Superuser already exists')
    except Exception as e:
        print(f"❌ Superuser creation failed: {e}")
        return False
    
    return True

def main():
    print("==========================================")
    print("    Django + PostgreSQL Setup")
    print("==========================================")
    print()
    
    # Start PostgreSQL
    if not start_postgres_docker():
        print("❌ Failed to start PostgreSQL. Exiting...")
        return
    
    # Setup Django
    if not setup_django_with_postgres():
        print("❌ Failed to setup Django with PostgreSQL. Exiting...")
        return
    
    # Start Django server
    print("🚀 Starting Django server...")
    print("🌐 Server will run on: http://127.0.0.1:8000")
    print("👤 Login: admin@admin.com / admin123")
    print("🗄️  Database: PostgreSQL (localhost:5432)")
    print()
    print("Press Ctrl+C to stop the server")
    print()
    
    try:
        execute_from_command_line(['manage.py', 'runserver', '8000'])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == '__main__':
    main()
