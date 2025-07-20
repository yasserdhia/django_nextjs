from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='strongpassword123',
    first_name='Admin',
    last_name='User'
)
print(f"Superuser created: {user.email}")
