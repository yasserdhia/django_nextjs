# تشغيل النظام مع SQL Server

## خطوات التشغيل السريع

### 1. إيقاف وحذف البيانات القديمة
```bash
docker-compose down -v
docker volume prune -f
```

### 2. تشغيل النظام
```bash
docker-compose up -d
```

### 3. اختبار الاتصال بـ SQL Server
```bash
# انتظر 30 ثانية لإعداد SQL Server ثم جرب:
docker-compose exec db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Password123" -Q "SELECT @@VERSION" -C
```

### 4. إعداد قاعدة البيانات
```bash
docker-compose exec backend python setup_sqlserver.py
```

### 5. اختبار الاتصال
```bash
docker-compose exec backend python test_sqlserver.py
```

## الروابط المهمة

- **SQL Server Management Studio:** 
  - Server: `localhost,1433`
  - Username: `sa`
  - Password: `Password123`

- **Django Admin:** http://localhost:8000/admin/
  - Username: `admin`
  - Password: `admin123`

- **Frontend:** http://localhost:3000

- **Form Builder:** http://localhost:3000/admin/form-builder

## ملاحظات مهمة

1. **أمان كلمة المرور:** في هذا المثال، استخدمنا كلمة مرور بسيطة للاختبار. في البيئة الإنتاجية، استخدم كلمة مرور قوية.

2. **SQL Server Port:** المنفذ 1433 متاح على جهازك المحلي للاتصال من SSMS.

3. **البيانات:** جميع البيانات محفوظة في Docker volumes وستبقى حتى لو أعدت تشغيل الـ containers.

## استكشاف الأخطاء

### إذا فشل SQL Server في البدء:
```bash
docker-compose logs db
```

### إذا فشل Backend:
```bash
docker-compose logs backend
```

### إعادة بناء Backend:
```bash
docker-compose build backend --no-cache
docker-compose up -d
```
