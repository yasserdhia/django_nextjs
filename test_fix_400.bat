@echo off
echo ========================================
echo   اختبار مشكلة خطأ 400 في الاستمارة
echo ========================================

echo.
echo 1. التحقق من تشغيل الخادم...
cd /d "c:\Users\YASSER\Desktop\django_project\backend"
python manage.py check

echo.
echo 2. إنشاء قاعدة البيانات...
python manage.py migrate

echo.
echo 3. تشغيل الخادم في الخلفية...
start /b python manage.py runserver 127.0.0.1:8000

echo.
echo 4. انتظار تشغيل الخادم...
timeout /t 5 /nobreak >nul

echo.
echo 5. تشغيل Frontend...
cd /d "c:\Users\YASSER\Desktop\django_project\frontend"
start npm run dev

echo.
echo 6. انتظار تشغيل Frontend...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   تم تشغيل النظام بنجاح!
echo ========================================
echo.
echo الروابط المهمة:
echo - الموقع الرئيسي: http://localhost:3000
echo - صفحة اختبار الاتصال: http://localhost:3000/test-connection
echo - استمارة الجهة الحكومية: http://localhost:3000/forms/government-entity
echo - Admin Django: http://localhost:8000/admin
echo.
echo للاختبار:
echo 1. افتح http://localhost:3000/test-connection
echo 2. اضغط على "تشغيل الاختبارات"
echo 3. اضغط على "اختبار الخادم مباشرة" (تحقق من Console)
echo 4. راجع النتائج في الصفحة
echo 5. تحقق من console في Developer Tools (F12)
echo 6. إذا استمر الخطأ، اذهب إلى الاستمارة واملأها
echo 7. راقب الرسائل المفصلة في Console
echo.
echo نصائح للتشخيص:
echo - تأكد من تسجيل الدخول أولاً
echo - تحقق من رسائل Console للتفاصيل
echo - ابحث عن رسائل تبدأ بـ "🔍" أو "❌"
echo - لاحظ تفاصيل الخطأ من الخادم
echo.
echo للإيقاف:
echo اضغط Ctrl+C في النوافذ المفتوحة
echo.
pause
