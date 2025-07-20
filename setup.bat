@echo off
echo Setting up Django backend...
echo.

cd backend

echo Creating and applying migrations...
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

echo.
echo Creating superuser...
docker-compose exec backend python manage.py createsuperuser

echo.
echo Setup complete!
pause
