# إعدادات الاتصال بـ SQL Server من SSMS

## المعلومات الصحيحة للاتصال

### إعدادات الاتصال:
- **Server name:** `localhost,1433`
- **Authentication:** SQL Server Authentication
- **Login:** `sa`
- **Password:** `Password123`

### خطوات مهمة:

1. **افتح SQL Server Management Studio**

2. **في نافذة Connect to Server أدخل:**
   - Server type: Database Engine
   - Server name: `localhost,1433`
   - Authentication: SQL Server Authentication
   - Login: `sa`
   - Password: `Password123`

3. **اضغط على "Options >>"**

4. **في تبويب "Connection Properties":**
   - ✅ تأكد من تفعيل "Trust server certificate"
   - أو في تبويب "Additional Connection Parameters" أضف: `TrustServerCertificate=true`

5. **اضغط Connect**

## إذا استمر الخطأ:

### الحل 1: تحقق من تشغيل SQL Server
```bash
docker compose ps
```

### الحل 2: تحقق من سجلات SQL Server
```bash
docker compose logs db
```

### الحل 3: إعادة تشغيل SQL Server
```bash
docker compose restart db
```

### الحل 4: اختبار الاتصال من Command Line
```bash
docker compose exec db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Password123" -Q "SELECT @@VERSION" -C
```

## بدائل للاتصال:

### استخدام Azure Data Studio (بديل مجاني):
1. حمل Azure Data Studio من Microsoft
2. استخدم نفس إعدادات الاتصال
3. يدعم SQL Server containers بشكل أفضل

### استخدام sqlcmd من Windows:
```cmd
sqlcmd -S localhost,1433 -U sa -P "Password123" -C
```

## ملاحظات مهمة:

- **المنفذ 1433** متاح على جهازك المحلي
- **كلمة المرور:** `Password123` (بدون رموز خاصة لتجنب المشاكل)
- **SSL/TLS:** مطلوب تفعيل Trust Server Certificate
- **Docker:** تأكد أن Docker Desktop يعمل

## اختبار سريع:

اذهب إلى Command Prompt واكتب:
```cmd
telnet localhost 1433
```

إذا اتصل بنجاح، فالمنفذ متاح والمشكلة في إعدادات SSMS.
