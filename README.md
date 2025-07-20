# 🏛️ Government Forms Management System | نظام إدارة الاستمارات الحكومية

<div align="center">

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Django](https://img.shields.io/badge/Django-4.2.7-darkgreen)
![Next.js](https://img.shields.io/badge/Next.js-13+-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

**نظام متكامل لإدارة الاستمارات الحكومية وملاحظات المواطنين**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🛠️ API](#️-api-reference) • [🐳 Docker](#-docker-deployment)

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features) 
- [🏗️ System Architecture](#️-system-architecture)
- [� Quick Start](#-quick-start)
- [🐳 Docker Deployment](#-docker-deployment)
- [🛠️ API Reference](#️-api-reference)
- [🔐 Authentication](#-authentication)
- [🧪 Testing](#-testing)
- [🚨 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)

---

## 🎯 Project Overview

The **Government Forms Management System** is a comprehensive full-stack web application designed for managing government entity registrations and citizen feedback. Built with modern technologies and containerized for easy deployment.

### � Key Highlights

- **Full-Stack Solution**: Django REST API + Next.js Frontend
- **Containerized**: Complete Docker-based deployment
- **Bilingual Support**: Arabic and English interfaces
- **Role-Based Access**: Admin, Staff, and Citizen permissions
- **Real-time Analytics**: Dashboard with comprehensive statistics
- **Mobile Responsive**: Optimized for all devices
- **Production Ready**: Health checks, monitoring, and logging
- **React Hook Form** - Form handling
- **Axios** - API calls
- **React Hot Toast** - Notifications

---

## ✨ Features

### 🏛️ **Government Entity Management**
- ✅ Entity registration with comprehensive information capture
- ✅ Multi-step approval workflow with status tracking  
- ✅ Document attachment and verification system
- ✅ Automated reference number generation
- ✅ Geographic categorization by governorate
- ✅ Service type classification and management

### 👥 **Citizen Feedback System**
- ✅ Complaint, suggestion, and inquiry submission
- ✅ Priority-based categorization (High/Medium/Low)
- ✅ Assignment to appropriate staff members
- ✅ Status tracking and resolution workflow
- ✅ Email notifications and updates
- ✅ Feedback analytics and reporting

### 📊 **Analytics & Dashboard**
- ✅ Real-time statistics and key performance indicators
- ✅ Entity distribution by type and location
- ✅ Feedback trends and resolution rates
- ✅ Staff performance metrics
- ✅ Interactive charts and visualizations
- ✅ Export capabilities for reports

### 🔐 **Security & Authentication**
- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Secure API endpoints with permissions
- ✅ Session management and logout
- ✅ Password encryption and validation
- ✅ CSRF and XSS protection

---

## 🏗️ System Architecture

### 💻 **Technology Stack**

#### Backend Technologies
- **Framework**: Django 4.2.7 with Django REST Framework
- **Database**: PostgreSQL 15 with advanced indexing
- **Authentication**: JWT + Token-based dual system
- **API Documentation**: Auto-generated with DRF browsable API

#### Frontend Technologies
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API with custom hooks
- **Form Handling**: React Hook Form with validation
- **HTTP Client**: Axios with interceptors

#### Infrastructure & DevOps
- **Containerization**: Docker & Docker Compose
- **Database Admin**: pgAdmin 4 with custom configuration
- **Web Server**: Nginx reverse proxy (production)
- **Monitoring**: Custom health check scripts

---

## 🚀 Quick Start

### ⚡ **One-Command Setup**

```bash
# Clone the repository (replace with your GitHub URL)
git clone https://github.com/your-username/government-forms-system.git
cd government-forms-system

# Start all services
docker-compose up -d --build

# Create superuser account
docker-compose exec backend python manage.py createsuperuser

# Access the applications
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend Admin: http://localhost:8000/admin" 
echo "🗄️ Database Admin: http://localhost:8080"
```

### 📋 **Prerequisites**

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher  
- **Git**: For repository cloning
- **Web Browser**: Modern browser (Chrome, Firefox, Safari, Edge)
- **4GB RAM**: Minimum system requirements

### 🔑 **Default Credentials**

| Service | Username | Password | URL |
|---------|----------|----------|-----|
| **Django Admin** | admin@admin.com | admin123 | http://localhost:8000/admin |
| **pgAdmin** | admin@admin.com | admin123 | http://localhost:8080 |
| **Frontend** | Create new account | - | http://localhost:3000 |

---

## � Docker Deployment

### 🏗️ **Container Architecture**

The application consists of 4 main services:

```yaml
services:
  🗄️ db:          PostgreSQL 15 Database
  🐍 backend:     Django REST API Server
  🌐 frontend:    Next.js Application
  🔧 pgadmin:     Database Administration Tool
```

### 🚀 **Docker Commands**

```bash
# 📦 Build and start all services
docker-compose up -d --build

# 📊 Check service status
docker-compose ps

# 📋 View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend

# 🔄 Restart individual service
docker-compose restart backend

# 🛑 Stop all services
docker-compose down

# 🧹 Complete cleanup (removes volumes)
docker-compose down -v --remove-orphans

# 📈 Monitor resource usage
docker stats
```

### 🌍 **Environment Configuration**

Create a `.env` file in the project root:

```env
# Database Configuration
POSTGRES_DB=government_forms_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password_2024
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django Settings
SECRET_KEY=your-super-secret-key-change-in-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key
ACCESS_TOKEN_LIFETIME=60
REFRESH_TOKEN_LIFETIME=1440

# Frontend Settings
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Government Forms Management System

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin123
```

### 🏥 **Health Monitoring**

The system includes built-in health checks and monitoring:

```bash
# Backend health check
curl http://localhost:8000/api/health/

# Database connectivity test
docker-compose exec backend python manage.py dbshell

# Container health status
docker-compose ps
```

---

## 🛠️ API Reference

### 🔐 **Authentication Endpoints**

```http
POST   /api/auth/jwt/create/           # JWT Login
POST   /api/auth/token/login/          # Token Login  
POST   /api/auth/jwt/refresh/          # Refresh JWT
POST   /api/auth/users/                # User Registration
GET    /api/auth/users/me/             # Current User Profile
PUT    /api/auth/users/me/             # Update Profile
POST   /api/auth/users/set_password/   # Change Password
POST   /api/auth/jwt/logout/           # Logout
```

### 🏛️ **Government Entities API**

```http
GET    /api/forms/government-entities/              # List entities
POST   /api/forms/government-entities/              # Create entity
GET    /api/forms/government-entities/{id}/         # Get entity details  
PUT    /api/forms/government-entities/{id}/         # Update entity
DELETE /api/forms/government-entities/{id}/         # Delete entity
POST   /api/forms/government-entities/{id}/approve/ # Approve entity
GET    /api/forms/government-entities/stats/        # Entity statistics
```

### 💭 **Citizen Feedback API**

```http
GET    /api/forms/citizen-feedback/                 # List feedback
POST   /api/forms/citizen-feedback/                 # Submit feedback
GET    /api/forms/citizen-feedback/{id}/            # Get feedback details
PUT    /api/forms/citizen-feedback/{id}/            # Update feedback  
DELETE /api/forms/citizen-feedback/{id}/            # Delete feedback
POST   /api/forms/citizen-feedback/{id}/resolve/    # Mark as resolved
POST   /api/forms/citizen-feedback/{id}/assign/     # Assign to staff
GET    /api/forms/citizen-feedback/stats/           # Feedback statistics
```

### 📊 **Dashboard & Analytics**

```http
GET    /api/forms/dashboard/stats/                  # Overall statistics
GET    /api/forms/analytics/entities-by-type/       # Entity distribution
GET    /api/forms/analytics/feedback-trends/        # Feedback trends
GET    /api/forms/analytics/performance-metrics/    # Performance data
GET    /api/forms/reports/export/{format}/          # Export reports
```

---

## 🔐 Authentication

### 🎫 **JWT Authentication Flow**

The system uses JWT tokens for secure API authentication:

1. **Login**: Submit credentials to `/api/auth/jwt/create/`
2. **Receive Tokens**: Get access and refresh tokens
3. **API Requests**: Include `Authorization: Bearer <token>` header
4. **Token Refresh**: Use refresh token when access token expires
5. **Logout**: Clear tokens from client storage

### 🔒 **Security Features**

- **Password Hashing**: bcrypt with configurable rounds
- **Token Expiration**: Configurable access/refresh token lifetimes
- **Rate Limiting**: API endpoint throttling
- **CORS Protection**: Configurable allowed origins
- **SQL Injection Prevention**: Django ORM with parameterized queries
- **XSS Protection**: Input sanitization and CSP headers
- **Floating elements** for visual appeal
- **Loading states** with smooth transitions
- **Glass morphism** effects

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface
- Adaptive layouts

## �️ Database Management

### pgAdmin Interface
Access the PostgreSQL database through pgAdmin web interface:
- **URL**: http://localhost:8080
- **Login**: admin@admin.com / admin
- **Server**: Pre-configured "Django PostgreSQL" server

### Database Tables
- `accounts_user` - User accounts and profiles
- `auth_*` - Django authentication tables
- `django_*` - Django system tables

### Useful Queries
```sql
-- View all users
SELECT id, username, email, first_name, last_name, is_active, date_joined 
FROM accounts_user;

-- Count total users
SELECT COUNT(*) as total_users FROM accounts_user;

-- Recent registrations
SELECT username, email, date_joined 
FROM accounts_user 
ORDER BY date_joined DESC 
LIMIT 10;
```

## �🔐 Authentication Flow

1. **Registration**: Multi-step form with validation
2. **Login**: Email/username and password
3. **JWT Tokens**: Secure token-based authentication
4. **Protected Routes**: Automatic redirects for unauthenticated users
5. **Logout**: Secure token cleanup

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get user profile

### Admin
- `/admin/` - Django admin interface

## 🐳 Docker Configuration

### Services
- **Frontend**: Next.js application (Port 3000)
- **Backend**: Django application (Port 8000)
- **Database**: PostgreSQL (Port 5432)
- **pgAdmin**: Database management interface (Port 8080)

### Environment Variables
- Database credentials
- Django secret key
- JWT settings

## 🎨 Styling & Animations

### CSS Features
- **Tailwind CSS** for utility-first styling
- **Custom animations** with keyframes
- **Glass morphism** effects
- **Gradient backgrounds**
- **Smooth transitions**

### Animation Types
- Fade in/out effects
- Slide animations
- Bounce effects
- Floating elements
- Glow effects
- Shimmer animations

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

### Database Migrations
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

## 🚀 Production Deployment

The application is containerized and ready for production deployment with:
- Docker multi-stage builds
- Environment-specific configurations
- Database optimization
- Static file serving
- Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

## 🧪 Testing

### � **Backend Testing**

```bash
# Run all Django tests
docker-compose exec backend python manage.py test

# Run specific app tests
docker-compose exec backend python manage.py test forms
docker-compose exec backend python manage.py test accounts

# Run tests with coverage
docker-compose exec backend coverage run --source='.' manage.py test
docker-compose exec backend coverage report
```

### 🌐 **Frontend Testing**

```bash
# Navigate to frontend directory
cd frontend

# Run unit tests
npm test

# Type checking
npm run type-check
```

---

## 🚨 Troubleshooting

### ⚠️ **Common Issues & Solutions**

#### **🐳 Container Issues**

**Problem**: Backend container keeps stopping
```bash
# Check container logs
docker-compose logs backend

# Restart with fresh build
docker-compose down
docker-compose up -d --build
```

**Problem**: Database connection errors
```bash
# Check database container
docker-compose logs db

# Reset database if needed
docker-compose down -v
docker-compose up -d
```

#### **🔐 Authentication Issues**

**Problem**: JWT token errors
```bash
# Create new superuser
docker-compose exec backend python manage.py createsuperuser

# Reset user password via Django shell
docker-compose exec backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='admin@admin.com')
user.set_password('newpassword')
user.save()
"
```

---

## 🤝 Contributing

We welcome contributions! Please see our **[Contributing Guide](CONTRIBUTING.md)** for detailed information.

### 🎯 **Areas for Contribution**

- **🌐 Internationalization** - Additional language support
- **📱 Mobile App** - React Native or Flutter mobile app
- **🔔 Notifications** - Email and SMS notification system
- **📊 Advanced Analytics** - Business intelligence dashboards
- **🧪 Test Coverage** - Additional test cases and scenarios
- **📚 Documentation** - Tutorials, guides, and examples

---

## 📄 License

This project is licensed under the **MIT License** - see the **[LICENSE](LICENSE)** file for details.

---

## 👨‍💻 Author & Maintainer

**Created with ❤️ for government digital transformation**

### 💬 **Contact & Support**

- **🐛 Bug Reports**: [Create an issue](https://github.com/your-username/government-forms-system/issues/new)
- **💡 Feature Requests**: [Request a feature](https://github.com/your-username/government-forms-system/issues/new)  
- **💬 General Questions**: [Start a discussion](https://github.com/your-username/government-forms-system/discussions)

---

## 🙏 Acknowledgments

Special thanks to the open-source community:

- **🐍 [Django](https://djangoproject.com/)** - The web framework for perfectionists with deadlines
- **⚛️ [React](https://reactjs.org/)** & **[Next.js](https://nextjs.org/)** - For making frontend development enjoyable
- **🐘 [PostgreSQL](https://postgresql.org/)** - The world's most advanced open source database
- **🐳 [Docker](https://docker.com/)** - For making deployment consistent
- **🎨 [Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework

---

<div align="center">

### 🌟 **Star this repository if it helped you!** 🌟

**Made with ❤️ for the government digital transformation community**

</div>
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=fullstack_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

### Frontend Configuration

The frontend is configured to work with the backend API through the `next.config.js` file.

## 📁 Project Structure

```
django_project/
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   ├── accounts/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── ...
│   ├── requirements.txt
│   ├── Dockerfile
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── dashboard.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── Dockerfile
│   └── next.config.js
├── docker-compose.yml
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/jwt/create/` - Login
- `POST /api/auth/jwt/refresh/` - Refresh token
- `POST /api/auth/users/` - Register
- `GET /api/auth/users/me/` - Get current user

### User Management
- `GET /api/user/` - Get user profile
- `PUT /api/user/` - Update user profile

## 🎨 Pages

### Frontend Pages
- `/` - Home page with navigation to login/register
- `/login` - User login page
- `/register` - User registration page
- `/dashboard` - Protected dashboard page (requires authentication)

## 🔒 Authentication Flow

1. User registers with email, password, and personal information
2. User logs in with email and password
3. JWT tokens are stored in cookies
4. Protected routes require valid JWT token
5. Automatic token refresh on expiration

## 🐳 Docker Services

- **db**: PostgreSQL database
- **backend**: Django REST API server
- **frontend**: Next.js development server

## 🛡️ Security Features

- JWT authentication with refresh tokens
- CORS configuration
- Password validation
- Protected routes
- Secure cookie storage

## 🔧 Development

### Backend Development
- Django REST Framework for API development
- Custom User model with email authentication
- Djoser for user management
- PostgreSQL database integration

### Frontend Development
- Next.js with TypeScript
- React Hook Form for form handling
- Tailwind CSS for styling
- Axios for API calls
- React Hot Toast for notifications

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

For production deployment:

1. Update environment variables
2. Set `DEBUG=False` in Django settings
3. Configure proper database credentials
4. Set up SSL certificates
5. Use production-ready web servers (Gunicorn, Nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For support and questions, please create an issue in the repository.
