@echo off
chcp 65001 >nul
echo ================================================
echo          رفع تلقائي كامل للمشروع
echo ================================================
echo.

REM إنشاء المستودع باستخدام PowerShell
echo 🔧 إنشاء المستودع تلقائياً...

powershell -Command "& {
    $headers = @{
        'Accept' = 'application/vnd.github.v3+json'
        'User-Agent' = 'PowerShell'
    }
    $body = @{
        'name' = 'government-forms-management-system'
        'description' = 'Government forms and citizen feedback management system built with Django + Next.js'
        'private' = $false
        'auto_init' = $false
    } | ConvertTo-Json
    
    Write-Host '📝 محاولة إنشاء المستودع...'
    Write-Host '🔗 URL: https://api.github.com/user/repos'
    Write-Host '👤 User: yasserdhia'
    Write-Host ''
    Write-Host '⚠️  يتطلب Personal Access Token للإنشاء الأوتوماتيكي'
    Write-Host '🔑 أو سيتم فتح صفحة الإنشاء يدوياً...'
    
    Start-Process 'https://github.com/new'
    Start-Sleep -Seconds 3
}"

echo.
echo 📋 تفاصيل المستودع المطلوب:
echo    الاسم: government-forms-management-system
echo    الوصف: نظام إدارة النماذج الحكومية Django + Next.js  
echo    النوع: عام (Public)
echo    التهيئة: بدون ملفات ابتدائية
echo.
echo ⏳ انتظار 15 ثانية للسماح بإنشاء المستودع...

timeout /t 15 /nobreak >nul

echo.
echo 🔄 بدء عملية الرفع...

REM إزالة remote القديم
git remote remove origin 2>nul

REM إضافة remote جديد
echo ✅ إضافة المستودع الجديد...
git remote add origin https://github.com/yasserdhia/government-forms-management-system.git

REM تحويل إلى main branch
echo ✅ تحويل إلى main branch...
git branch -M main

REM الرفع
echo.
echo 🚀 رفع المشروع إلى GitHub...
echo 🔐 المصادقة مطلوبة:
echo    المستخدم: yasserdhia
echo    كلمة المرور: Personal Access Token الخاص بك
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo              🎉 نجح الرفع! 🎉
    echo ================================================
    echo.
    echo ✅ تم رفع المشروع بنجاح
    echo 🌐 الرابط: https://github.com/yasserdhia/government-forms-management-system
    echo.
    echo 📊 إحصائيات:
    for /f %%i in ('git ls-files ^| find /c /v ""') do echo    الملفات: %%i
    for /f %%i in ('git rev-list --count HEAD') do echo    الcommits: %%i
    echo.
    echo 🎯 الخطوات التالية:
    echo    ⭐ إضافة نجمة للمستودع
    echo    🏷️ إضافة موضوعات: django, nextjs, government
    echo    📋 تفعيل Issues و Discussions  
    echo    🤝 مشاركة مع المجتمع
    echo.
    
    REM فتح المستودع
    start https://github.com/yasserdhia/government-forms-management-system
    
    echo 🎊 تهانينا! مشروع إدارة النماذج الحكومية أصبح متاحاً على GitHub!
) else (
    echo.
    echo ================================================
    echo              ❌ فشل الرفع
    echo ================================================
    echo.
    echo 💡 حلول محتملة:
    echo    1. استخدم Personal Access Token بدلاً من كلمة المرور
    echo    2. تأكد من إنشاء المستودع على GitHub
    echo    3. تحقق من اسم المستودع والمستخدم
    echo    4. جرب: git push -u origin main
    echo.
    echo 🔑 أنشئ token من: https://github.com/settings/tokens
    echo 📖 الدليل الكامل في: FINAL_UPLOAD_GUIDE.md
)

echo.
echo انتهت عملية الرفع.
pause
