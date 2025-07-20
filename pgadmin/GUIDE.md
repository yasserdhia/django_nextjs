# 🗄️ pgAdmin - Database Management Interface

## 🚀 Quick Start

### 1. Access pgAdmin
- **URL**: http://localhost:8080
- **Email**: admin@admin.com
- **Password**: admin

### 2. Connect to Database
The PostgreSQL server should be pre-configured as "Django PostgreSQL". If not, follow these steps:

1. **Right-click** on "Servers" → "Create" → "Server"
2. **General Tab**:
   - Name: `Django PostgreSQL`
   - Server group: `Servers`
3. **Connection Tab**:
   - Host: `db`
   - Port: `5432`
   - Database: `fullstack_db`
   - Username: `postgres`
   - Password: `postgres`

## 📊 Database Overview

### Django Tables
- **accounts_user**: User accounts and profiles
- **auth_group**: User groups and permissions
- **auth_permission**: System permissions
- **django_admin_log**: Admin panel activity log
- **django_content_type**: Content type definitions
- **django_migrations**: Database migration history
- **django_session**: User session data

## 🔍 Common Tasks

### View User Accounts
1. Navigate to: `Servers` → `Django PostgreSQL` → `Databases` → `fullstack_db` → `Schemas` → `public` → `Tables`
2. Right-click on `accounts_user` → `View/Edit Data` → `All Rows`

### Execute Custom Queries
1. Right-click on `fullstack_db` → `Query Tool`
2. Enter your SQL query and click `Execute`

### Useful SQL Queries

```sql
-- View all users with their details
SELECT 
    id,
    username,
    email,
    first_name,
    last_name,
    is_active,
    is_staff,
    is_superuser,
    date_joined,
    last_login
FROM accounts_user
ORDER BY date_joined DESC;

-- Count users by status
SELECT 
    is_active,
    COUNT(*) as user_count
FROM accounts_user
GROUP BY is_active;

-- Recent user registrations (last 7 days)
SELECT 
    username,
    email,
    date_joined
FROM accounts_user
WHERE date_joined >= NOW() - INTERVAL '7 days'
ORDER BY date_joined DESC;

-- Find users by email domain
SELECT 
    username,
    email,
    date_joined
FROM accounts_user
WHERE email LIKE '%@example.com'
ORDER BY date_joined DESC;

-- Active user sessions
SELECT 
    s.session_key,
    s.expire_date,
    u.username,
    u.email
FROM django_session s
JOIN accounts_user u ON s.session_data LIKE '%"_auth_user_id":"' || u.id || '"%'
WHERE s.expire_date > NOW()
ORDER BY s.expire_date DESC;

-- Admin activity log
SELECT 
    al.action_time,
    u.username,
    al.action_flag,
    al.object_repr,
    ct.name as content_type
FROM django_admin_log al
JOIN accounts_user u ON al.user_id = u.id
JOIN django_content_type ct ON al.content_type_id = ct.id
ORDER BY al.action_time DESC
LIMIT 20;
```

## 🛠️ Database Management

### Backup Database
1. Right-click on `fullstack_db` → `Backup`
2. Choose format (SQL, Custom, Directory, TAR)
3. Set filename and location
4. Click `Backup`

### Restore Database
1. Right-click on `fullstack_db` → `Restore`
2. Select backup file
3. Configure restore options
4. Click `Restore`

### Monitor Performance
1. Go to `Dashboard` for server statistics
2. Check `Tools` → `Server Status` for real-time monitoring
3. Use `EXPLAIN ANALYZE` for query optimization

## 🔧 User Management

### Create New User (SQL)
```sql
INSERT INTO accounts_user (
    username, 
    email, 
    first_name, 
    last_name, 
    is_active, 
    is_staff, 
    date_joined, 
    password
) VALUES (
    'newuser', 
    'newuser@example.com', 
    'New', 
    'User', 
    true, 
    false, 
    NOW(), 
    'pbkdf2_sha256$...'  -- Use Django's password hasher
);
```

### Update User Status
```sql
-- Activate user
UPDATE accounts_user SET is_active = true WHERE username = 'username';

-- Make user staff
UPDATE accounts_user SET is_staff = true WHERE username = 'username';

-- Deactivate user
UPDATE accounts_user SET is_active = false WHERE username = 'username';
```

### Delete User
```sql
-- Delete user (be careful!)
DELETE FROM accounts_user WHERE username = 'username';
```

## 📈 Analytics Queries

### User Registration Trends
```sql
SELECT 
    DATE_TRUNC('month', date_joined) as month,
    COUNT(*) as registrations
FROM accounts_user
GROUP BY DATE_TRUNC('month', date_joined)
ORDER BY month;
```

### Daily Active Users (last 30 days)
```sql
SELECT 
    DATE_TRUNC('day', last_login) as day,
    COUNT(*) as active_users
FROM accounts_user
WHERE last_login >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', last_login)
ORDER BY day;
```

### User Activity Summary
```sql
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active THEN 1 END) as active_users,
    COUNT(CASE WHEN is_staff THEN 1 END) as staff_users,
    COUNT(CASE WHEN is_superuser THEN 1 END) as superusers,
    COUNT(CASE WHEN last_login IS NOT NULL THEN 1 END) as users_who_logged_in
FROM accounts_user;
```

## 🔒 Security Best Practices

1. **Change Default Passwords**: Update pgAdmin and PostgreSQL passwords
2. **Restrict Access**: Use firewalls and VPNs for production
3. **Regular Backups**: Schedule automated database backups
4. **Monitor Access**: Review login logs regularly
5. **Use SSL**: Enable SSL for production databases

## 🐛 Troubleshooting

### Connection Issues
- Ensure containers are running: `docker-compose ps`
- Check network connectivity between containers
- Verify port mappings in docker-compose.yml

### Authentication Problems
- Reset pgAdmin by recreating container
- Check PostgreSQL user permissions
- Verify environment variables

### Performance Issues
- Use `EXPLAIN ANALYZE` for slow queries
- Check database indexes
- Monitor resource usage in Docker

## 📞 Support

For more information:
- pgAdmin Documentation: https://www.pgadmin.org/docs/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Django Database Documentation: https://docs.djangoproject.com/en/4.2/ref/databases/

---

**Happy Database Management! 🎉**
