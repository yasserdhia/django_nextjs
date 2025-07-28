# دليل إعداد SQL Server مع Docker

## متطلبات النظام

1. **Docker Desktop** مثبت ومفعل
2. **SQL Server Management Studio (SSMS)** مثبت على جهازك

## خطوات الإعداد

### 1. تشغيل Docker Containers

```bash
# في مجلد المشروع الرئيسي
docker-compose down  # إيقاف أي containers قديمة
docker-compose build --no-cache  # بناء الصور من جديد
docker-compose up -d  # تشغيل جميع الخدمات
```

### 2. التحقق من تشغيل SQL Server

```bash
# التحقق من حالة الخدمات
docker-compose ps

# عرض سجلات SQL Server
docker-compose logs db

# عرض سجلات Backend
docker-compose logs backend
```

### 3. الاتصال بـ SQL Server من SSMS

**إعدادات الاتصال:**
- **Server name:** `localhost,1433`
- **Authentication:** SQL Server Authentication
- **Login:** `sa`
- **Password:** `Password123`

**أو يمكنك استخدام:**
- **Server name:** `127.0.0.1,1433`

### 4. التحقق من قاعدة البيانات

بعد الاتصال الناجح بـ SSMS، ستجد:
- قاعدة البيانات: `fullstack_db`
- الجداول التي تم إنشاؤها بواسطة Django migrations

### 5. الدخول إلى لوحة إدارة Django

- الرابط: http://localhost:8000/admin/
- اسم المستخدم: `admin`
- كلمة المرور: `admin123`

### 6. الدخول إلى Frontend

- الرابط: http://localhost:3000

## اختبار الاتصال

```bash
# تشغيل اختبار الاتصال
docker-compose exec backend python test_sqlserver.py
```

## استكشاف الأخطاء

### إذا فشل الاتصال بـ SQL Server:

1. **تأكد من تشغيل Container:**
```bash
docker-compose ps
```

2. **تحقق من سجلات SQL Server:**
```bash
docker-compose logs db
```

3. **إعادة تشغيل الخدمات:**
```bash
docker-compose restart
```

### إذا فشل في إنشاء قاعدة البيانات:

```bash
# دخول إلى container وتشغيل الإعداد يدوياً
docker-compose exec backend python setup_sqlserver.py
```

### إذا فشل في تطبيق Migrations:

```bash
# تطبيق migrations يدوياً
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

## معلومات إضافية

### كلمات المرور المستخدمة:
- **SQL Server SA:** `Password123`
- **Django Admin:** `admin` / `admin123`

### المنافذ المستخدمة:
- **SQL Server:** 1433
- **Django Backend:** 8000
- **Next.js Frontend:** 3000

### ملفات الإعدادات:
- إعدادات Django: `backend/backend/settings_sqlserver.py`
- إعدادات Docker: `docker-compose.yml`
- سكريبت الإعداد: `backend/setup_sqlserver.py`

## نصائح

1. **أمان كلمات المرور:** غيّر كلمات المرور قبل النشر في الإنتاج
2. **Backup:** اعمل نسخ احتياطية دورية لقاعدة البيانات
3. **الأداء:** راقب استهلاك الذاكرة والمعالج للـ containers

## الاستمارات المخصصة

بعد الإعداد الناجح، يمكنك:
1. إنشاء استمارات مخصصة من: http://localhost:3000/admin/form-builder
2. إدارة الاستمارات من لوحة Django Admin
3. عرض الردود والبيانات المجمعة
