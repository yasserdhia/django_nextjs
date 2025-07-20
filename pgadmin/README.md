# pgAdmin Configuration

## Access Information

- **URL**: http://localhost:8080
- **Email**: admin@admin.com
- **Password**: admin

## Database Connection Details

When connecting to the PostgreSQL database through pgAdmin, use these settings:

- **Host**: db
- **Port**: 5432
- **Database**: fullstack_db
- **Username**: postgres
- **Password**: postgres

## Pre-configured Server

The PostgreSQL server is already configured in pgAdmin with the name "Django PostgreSQL". You should be able to see it in the server list after logging in.

## Database Tables

After running Django migrations, you'll see the following tables:

### Django System Tables
- `auth_user` - User authentication
- `auth_group` - User groups
- `auth_permission` - Permissions
- `django_admin_log` - Admin actions log
- `django_content_type` - Content types
- `django_migrations` - Migration history
- `django_session` - User sessions

### Custom Tables
- `accounts_user` - Custom user model with additional fields
- Other app-specific tables as you add them

## Viewing User Accounts

1. Navigate to **Servers** → **Django PostgreSQL** → **Databases** → **fullstack_db** → **Schemas** → **public** → **Tables**
2. Right-click on `accounts_user` table
3. Select **View/Edit Data** → **All Rows**

## Useful Queries

### View all users
```sql
SELECT id, username, email, first_name, last_name, is_active, is_staff, date_joined 
FROM accounts_user;
```

### View user login sessions
```sql
SELECT s.session_key, s.session_data, s.expire_date, u.username 
FROM django_session s
JOIN accounts_user u ON s.session_data LIKE '%' || u.id || '%';
```

### Count total users
```sql
SELECT COUNT(*) as total_users FROM accounts_user;
```

### View recent registrations
```sql
SELECT username, email, date_joined 
FROM accounts_user 
ORDER BY date_joined DESC 
LIMIT 10;
```

## Managing the Database

### Backup Database
```sql
-- Create backup
pg_dump -h localhost -p 5432 -U postgres -d fullstack_db > backup.sql
```

### Restore Database
```sql
-- Restore from backup
psql -h localhost -p 5432 -U postgres -d fullstack_db < backup.sql
```

## Security Notes

- Change default passwords in production
- Restrict pgAdmin access in production environments
- Use environment variables for sensitive data
- Enable SSL for production databases
