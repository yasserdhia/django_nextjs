# إصلاح مشكلة CORS في تسجيل الدخول

## المشكلة:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:8000/api/auth/jwt/create/. (Reason: CORS request did not succeed).
```

## السبب:
خادم Django لا يعمل أو إعدادات CORS غير صحيحة.

## الحل:

### 1. التأكد من تشغيل خادم Django:

```bash
# افتح terminal جديد
cd c:\Users\YASSER\Desktop\django_project\backend

# تشغيل الخادم
python manage.py runserver 8000
```

### 2. التحقق من أن الخادم يعمل:
- افتح المتصفح واذهب إلى: http://localhost:8000/admin
- يجب أن تظهر صفحة تسجيل الدخول لـ Django Admin

### 3. إذا لم يعمل، تشغيل التشخيص:

```bash
cd c:\Users\YASSER\Desktop\django_project\backend
python diagnose_cors.py
```

### 4. إصلاح إعدادات CORS (تم التطبيق):

✅ تم تحديث `backend/settings.py` مع:
- `CORS_ALLOW_ALL_ORIGINS = True` (للتطوير فقط)
- إضافة headers و methods إضافية
- الاحتفاظ بـ `CORS_ALLOWED_ORIGINS` للأمان

### 5. التحقق من تشغيل Next.js:

```bash
# في terminal آخر
cd c:\Users\YASSER\Desktop\django_project\frontend
npm run dev
```

### 6. اختبار تسجيل الدخول:

1. تأكد من أن Django يعمل على: http://localhost:8000
2. تأكد من أن Next.js يعمل على: http://localhost:3000
3. جرب تسجيل الدخول في صفحة: http://localhost:3000/login

## التحقق من الأخطاء:

### إذا ظهر خطأ CORS:
- تأكد من أن خادم Django يعمل
- تحقق من أن المنفذ 8000 متاح
- تأكد من أن إعدادات CORS صحيحة

### إذا ظهر خطأ 404:
- تحقق من URL patterns في Django
- تأكد من أن djoser مثبت ومضبوط بشكل صحيح

### إذا ظهر خطأ في قاعدة البيانات:
```bash
python manage.py migrate
```

## ملفات مساعدة:

1. **`start_server.bat`**: تشغيل الخادم تلقائياً
2. **`diagnose_cors.py`**: تشخيص المشاكل
3. **إعدادات CORS محسنة** في `settings.py`

## التأكد من نجاح الإصلاح:

1. ✅ Django يعمل على http://localhost:8000
2. ✅ Next.js يعمل على http://localhost:3000
3. ✅ لا يوجد خطأ CORS في console
4. ✅ تسجيل الدخول يعمل بشكل صحيح

## معلومات إضافية:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Auth**: http://localhost:8000/api/auth/

## أوامر سريعة:

```bash
# تشغيل Django
cd backend && python manage.py runserver 8000

# تشغيل Next.js
cd frontend && npm run dev

# تشخيص المشاكل
cd backend && python diagnose_cors.py
```

## إذا استمرت المشكلة:

1. تأكد من أن Python و Node.js مثبتان
2. تحقق من أن جميع المتطلبات مثبتة
3. تأكد من أن قاعدة البيانات تعمل
4. راجع logs الخادم للأخطاء

بعد تطبيق هذه الخطوات، يجب أن تعمل المصادقة بشكل صحيح! 🎉
