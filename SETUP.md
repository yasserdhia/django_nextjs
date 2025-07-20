# 🚀 Quick Setup Guide

## Prerequisites
- Docker and Docker Compose installed
- Git (optional, for version control)

## Step 1: Start the Application
```bash
# Navigate to project directory
cd django_project

# Start all services with Docker Compose
docker-compose up --build
```

## Step 2: Initialize the Database
In a new terminal window:
```bash
# Run migrations
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Create superuser for admin access
docker-compose exec backend python manage.py createsuperuser
```

## Step 3: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 🎯 Testing the Application

### 1. Register a New User
1. Go to http://localhost:3000
2. Click "Register" 
3. Fill in the form with:
   - First Name
   - Last Name
   - Username
   - Email
   - Password (minimum 8 characters)
4. Click "Create account"

### 2. Login
1. Go to http://localhost:3000/login
2. Enter your email and password
3. Click "Sign in"
4. You'll be redirected to the dashboard

### 3. View Dashboard
- After login, you'll see your user information
- Click "Logout" to return to login page

## 🔧 Development Commands

### Backend (Django)
```bash
# Access Django shell
docker-compose exec backend python manage.py shell

# Create new Django app
docker-compose exec backend python manage.py startapp myapp

# View logs
docker-compose logs backend
```

### Frontend (Next.js)
```bash
# Access frontend container
docker-compose exec frontend sh

# Install new package
docker-compose exec frontend npm install package-name

# View logs
docker-compose logs frontend
```

### Database
```bash
# Access PostgreSQL
docker-compose exec db psql -U postgres -d fullstack_db

# View database logs
docker-compose logs db
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Port already in use**
   - Stop other services on ports 3000, 8000, or 5432
   - Or modify ports in docker-compose.yml

2. **Database connection error**
   - Ensure PostgreSQL container is running
   - Check database credentials in docker-compose.yml

3. **Frontend can't connect to backend**
   - Verify both containers are running
   - Check network configuration in docker-compose.yml

### Restart Services:
```bash
# Stop all services
docker-compose down

# Start fresh (removes volumes)
docker-compose down -v
docker-compose up --build
```

## 📚 Project Structure Overview

```
django_project/
├── backend/           # Django REST API
│   ├── backend/       # Django settings
│   ├── accounts/      # User authentication
│   └── requirements.txt
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── pages/     # Next.js pages
│   │   ├── components/ # React components
│   │   ├── contexts/  # React contexts
│   │   └── lib/       # Utility functions
│   └── package.json
└── docker-compose.yml # Docker configuration
```

## 🎉 You're Ready!

Your full-stack application is now running with:
- ✅ Django REST API backend
- ✅ Next.js frontend
- ✅ PostgreSQL database
- ✅ Docker containerization
- ✅ JWT authentication
- ✅ Responsive UI with Tailwind CSS

Happy coding! 🚀
