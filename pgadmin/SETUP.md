# pgAdmin Setup Guide

## Accessing pgAdmin

1. **Open pgAdmin**: Navigate to http://localhost:8080
2. **Login**: Use admin@admin.com / admin
3. **Server Connection**: The PostgreSQL server should be pre-configured

## Manual Server Setup (if needed)

If the server is not automatically configured:

1. **Add New Server**:
   - Right-click on "Servers" → "Create" → "Server"

2. **General Tab**:
   - Name: Django PostgreSQL
   - Server group: Servers

3. **Connection Tab**:
   - Host name/address: db
   - Port: 5432
   - Maintenance database: fullstack_db
   - Username: postgres
   - Password: postgres

4. **Save** the configuration

## Database Management Tasks

### 1. View User Accounts
- Navigate to: Servers → Django PostgreSQL → Databases → fullstack_db → Schemas → public → Tables
- Right-click on `accounts_user` → View/Edit Data → All Rows

### 2. Monitor Database Activity
- Go to Dashboard to see server statistics
- Check Tools → Server Status for real-time monitoring

### 3. Backup Database
- Right-click on `fullstack_db` → Backup
- Choose backup options and save location

### 4. Execute Custom Queries
- Right-click on `fullstack_db` → Query Tool
- Write and execute SQL queries

### 5. User Management
```sql
-- Create new user
INSERT INTO accounts_user (username, email, first_name, last_name, is_active, is_staff, date_joined)
VALUES ('newuser', 'user@example.com', 'John', 'Doe', true, false, NOW());

-- Update user status
UPDATE accounts_user SET is_active = false WHERE username = 'username';

-- Delete user
DELETE FROM accounts_user WHERE username = 'username';
```

## Troubleshooting

### Connection Issues
- Ensure both db and pgAdmin containers are running
- Check Docker network connectivity
- Verify port mappings in docker-compose.yml

### Authentication Problems
- Reset pgAdmin password by recreating the container
- Check PostgreSQL user permissions

### Performance Issues
- Monitor query execution time in pgAdmin
- Use EXPLAIN for query optimization
- Check database indexes

## Security Recommendations

1. **Change Default Passwords**: Update both pgAdmin and PostgreSQL passwords
2. **Restrict Access**: Use firewalls to limit pgAdmin access
3. **Enable SSL**: Configure SSL for production databases
4. **Regular Backups**: Schedule automated database backups
5. **Monitor Access**: Review pgAdmin logs regularly

## Production Considerations

- Use environment variables for sensitive data
- Enable authentication and authorization
- Configure proper logging
- Set up monitoring and alerting
- Implement backup strategies
