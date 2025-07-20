# إصلاح خطأ related_entity في استمارة المواطنين

## المشكلة الأصلية
كان الخطأ التالي يظهر عند إرسال استمارة ملاحظات المواطنين:

```
خطأ في البيانات: related_entity: Incorrect type. Expected pk value, received str.
```

## سبب المشكلة
- في نموذج Django، كان حقل `related_entity` من نوع `ForeignKey` إلى `GovernmentEntity`
- هذا يعني أن Django يتوقع رقم معرف (primary key) للجهة الحكومية
- لكن الـ frontend كان يرسل اسم الجهة كنص عادي

## الحل المطبق

### 1. تحديث نموذج Django
```python
# في forms/models.py
class CitizenFeedback(models.Model):
    # تم تغيير هذا:
    # related_entity = models.ForeignKey(GovernmentEntity, on_delete=models.CASCADE, ...)
    
    # إلى هذا:
    related_entity = models.CharField(max_length=200, verbose_name='الجهة المعنية')
```

### 2. إضافة الحقول المفقودة
تم إضافة الحقول التالية لنموذج `CitizenFeedback`:
- `age`: العمر
- `gender`: الجنس
- `education_level`: المستوى التعليمي
- `occupation`: المهنة
- `governorate`: المحافظة
- `city`: المدينة
- `preferred_contact_method`: طريقة التواصل المفضلة
- `previous_attempts`: محاولات سابقة
- `previous_attempts_description`: وصف المحاولات السابقة
- `consent_data_processing`: موافقة معالجة البيانات
- `consent_contact`: موافقة التواصل

### 3. تحديث الـ Serializer
```python
# في forms/serializers.py
class CitizenFeedbackSerializer(serializers.ModelSerializer):
    # تم إزالة هذا السطر:
    # related_entity_name = serializers.CharField(source='related_entity.entity_name', read_only=True)
```

### 4. إنشاء الـ Migrations
تم إنشاء الـ migration files التالية:
- `0002_alter_citizenfeedback_related_entity.py`: لتحويل related_entity إلى CharField
- `0003_add_citizenfeedback_fields.py`: لإضافة الحقول المفقودة

## كيفية تطبيق الحل

### 1. تطبيق الـ Migrations
```bash
cd backend
python manage.py migrate
```

### 2. إعادة تشغيل الخادم
```bash
python manage.py runserver
```

### 3. اختبار الحل
يمكنك اختبار الحل باستخدام الملفات التجريبية:

```bash
# اختبار إنشاء ملاحظة مواطن
python test_citizen_feedback.py

# اختبار API endpoint
python test_api_endpoint.py
```

## الفوائد من هذا الحل

1. **مرونة أكبر**: الآن يمكن إدخال أي اسم جهة حكومية دون الحاجة لوجودها في قاعدة البيانات
2. **سهولة الاستخدام**: المستخدم يمكنه كتابة اسم الجهة مباشرة
3. **تجنب الأخطاء**: لا توجد حاجة للبحث عن معرف الجهة الحكومية
4. **دعم كامل للحقول**: تم إضافة جميع الحقول المطلوبة للنموذج

## ملاحظات إضافية

- الحل يحافظ على جميع الوظائف الموجودة
- يدعم الإرسال المجهول والإرسال بالاسم الحقيقي
- جميع التحققات من صحة البيانات تعمل بشكل صحيح
- الاستمارة الآن تعمل بشكل كامل دون أخطاء

## المتطلبات للتشغيل

1. Django 4.2+
2. Django REST Framework
3. PostgreSQL (أو قاعدة بيانات أخرى)
4. Python 3.8+

## الملفات المعدلة

- `forms/models.py`: تحديث نموذج CitizenFeedback
- `forms/serializers.py`: تحديث الـ serializer
- `forms/migrations/0002_alter_citizenfeedback_related_entity.py`: migration جديدة
- `forms/migrations/0003_add_citizenfeedback_fields.py`: migration جديدة

## الاختبار

لاختبار الحل، قم بتشغيل الخادم وإرسال استمارة ملاحظات المواطنين من الـ frontend. يجب أن تعمل الاستمارة بشكل صحيح دون أخطاء.
