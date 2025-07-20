# 🚀 pgAdmin Quick Access

## 🌐 Access URLs
- **pgAdmin**: http://localhost:8080
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin

## 🔑 pgAdmin Login
- **Email**: admin@admin.com
- **Password**: admin

## 🗄️ Database Connection
- **Server Name**: Django PostgreSQL (should be pre-configured)
- **Host**: db
- **Port**: 5432
- **Database**: fullstack_db
- **Username**: postgres
- **Password**: postgres

## 📊 Quick Steps to View User Data

1. **Login to pgAdmin** at http://localhost:8080
2. **Navigate to**: Servers → Django PostgreSQL → Databases → fullstack_db → Schemas → public → Tables
3. **Right-click** on `accounts_user` → View/Edit Data → All Rows
4. **See user accounts** created through the registration system

## 🔍 Sample Users Available
- john_doe (john@example.com)
- jane_smith (jane@example.com)
- Plus any users you create through the registration form

## 📝 Useful SQL Queries
```sql
-- View all users
SELECT username, email, first_name, last_name, is_active, date_joined FROM accounts_user;

-- Count total users
SELECT COUNT(*) as total_users FROM accounts_user;
```

## 🎯 What You Can Do
- ✅ View all user accounts
- ✅ Monitor user registrations
- ✅ Execute custom SQL queries
- ✅ Backup and restore database
- ✅ Manage user permissions
- ✅ View database statistics

---
**Enjoy managing your database! 🎉**
