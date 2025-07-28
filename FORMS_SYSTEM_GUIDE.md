# نظام الاستمارات الإلكترونية - PostgreSQL

## نظرة عامة

لضمان الاستقرار وسهولة الاستخدام، قمنا بتكوين النظام ليعمل مع **PostgreSQL** بدلاً من SQL Server. PostgreSQL يوفر دعم أفضل للـ JSONField والميزات المتقدمة التي نحتاجها للاستمارات الديناميكية.

## الميزات المتاحة

### ✅ الاستمارات العامة (Public Forms)
- **إنشاء استمارات متاحة للجميع**
- **رابط مشاركة عام** 
- **جمع البيانات دون تسجيل دخول**
- **تخزين في قاعدة البيانات PostgreSQL**

### ✅ الاستمارات الخاصة (Custom Forms)  
- **منشئ الاستمارات التفاعلي** (Form Builder)
- **إدارة كاملة للحقول والخيارات**
- **تخزين البيانات في PostgreSQL**
- **واجهة إدارة متقدمة**

## تشغيل النظام

### 1. إيقاف وإعادة بناء النظام
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### 2. تطبيق Migrations
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### 3. إنشاء مستخدم إداري
```bash
docker-compose exec backend python manage.py createsuperuser
```

## إعدادات قاعدة البيانات

### PostgreSQL Configuration:
- **Host:** localhost
- **Port:** 5432  
- **Database:** fullstack_db
- **Username:** postgres
- **Password:** postgres

### أدوات الإدارة المتاحة:
- **pgAdmin:** يمكن إضافته لاحقاً
- **Django Admin:** http://localhost:8000/admin/
- **Database Browser:** أي أداة تدعم PostgreSQL

## روابط النظام

### 🌐 الواجهات الرئيسية:
- **الصفحة الرئيسية:** http://localhost:3000
- **منشئ الاستمارات:** http://localhost:3000/admin/form-builder  
- **لوحة الإدارة:** http://localhost:8000/admin/
- **واجهة API:** http://localhost:8000/api/

### 📋 الاستمارات المتاحة:
- **استمارة ملاحظات المواطنين:** http://localhost:3000/forms/citizen-feedback
- **استمارة الكيانات الحكومية:** http://localhost:3000/forms/government-entity

## إدارة البيانات

### عرض الاستمارات المخصصة:
```bash
# عرض جميع الاستمارات
docker-compose exec backend python manage.py shell -c "
from custom_forms.models import CustomForm
for form in CustomForm.objects.all():
    print(f'📋 {form.title} - Category: {form.category}')
"

# عرض الردود
docker-compose exec backend python manage.py shell -c "
from custom_forms.models import FormResponse
print(f'📊 Total Responses: {FormResponse.objects.count()}')
"
```

### عرض بيانات الاستمارات العامة:
```bash
# عرض ملاحظات المواطنين
docker-compose exec backend python manage.py shell -c "
from forms.models import CitizenFeedback
print(f'💬 Citizen Feedback: {CitizenFeedback.objects.count()}')
for feedback in CitizenFeedback.objects.all()[:5]:
    print(f'- {feedback.subject}: {feedback.message[:50]}...')
"
```

## تخزين البيانات

### 🗄️ جداول قاعدة البيانات الرئيسية:

#### للاستمارات المخصصة:
- **custom_forms_customform** - معلومات الاستمارات
- **custom_forms_formresponse** - ردود المستخدمين

#### للاستمارات العامة:
- **forms_citizenfeedback** - ملاحظات المواطنين
- **forms_governmententity** - بيانات الكيانات الحكومية

#### للنظام:
- **auth_user** - المستخدمين
- **django_admin_log** - سجل الإدارة

## النسخ الاحتياطي والاستعادة

### إنشاء نسخة احتياطية:
```bash
docker-compose exec db pg_dump -U postgres fullstack_db > backup.sql
```

### استعادة النسخة الاحتياطية:
```bash  
docker-compose exec -T db psql -U postgres fullstack_db < backup.sql
```

## الاختبار والتطوير

### اختبار النظام:
```bash
# اختبار الاتصال بقاعدة البيانات
docker-compose exec backend python manage.py check

# اختبار API endpoints
curl http://localhost:8000/api/forms/

# اختبار الواجهة الأمامية
curl http://localhost:3000
```

## الخطوات التالية

1. **✅ النظام جاهز للاستخدام الفوري**
2. **📋 إنشاء استمارات مخصصة جديدة**
3. **📊 مراقبة البيانات المجمعة**
4. **🔒 إضافة ميزات الأمان المتقدمة**
5. **📈 تحليل البيانات والتقارير**

## ملاحظات مهمة

- **PostgreSQL** أكثر استقراراً للاستمارات الديناميكية
- **JSON Fields** تعمل بشكل مثالي لتخزين بيانات الاستمارات
- **Performance** ممتاز للاستخدام المكثف
- **Backup** سهل ومرن
