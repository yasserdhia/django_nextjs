FROM python:3.11-bullseye

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install system dependencies including SQL Server ODBC driver
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    unixodbc \
    unixodbc-dev \
    curl \
    gnupg \
    netcat-traditional \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire project
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p /app/custom_forms/migrations \
    /app/staticfiles \
    /app/media && \
    chmod +x /app/manage.py

# Expose port
EXPOSE 8000

# Run with improved error handling
CMD ["sh", "-c", "echo 'Starting Django application...' && sleep 10 && python debug_django.py && python manage.py collectstatic --noinput --clear && python manage.py makemigrations --noinput && python manage.py migrate --noinput && echo 'Starting server...' && python manage.py runserver 0.0.0.0:8000"]
