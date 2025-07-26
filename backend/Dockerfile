FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    netcat-traditional \
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
