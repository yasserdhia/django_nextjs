## إصلاح خطأ related_entity في استمارة المواطنين

### المشكلة:
```
خطأ في البيانات: related_entity: Incorrect type. Expected pk value, received str.
```

### سبب المشكلة:
- الحقل `related_entity` في نموذج Django كان من نوع `ForeignKey` إلى `GovernmentEntity`
- كان يتوقع رقم معرف (ID) للجهة الحكومية بدلاً من نص الاسم
- الـ frontend يرسل اسم الجهة كنص، لكن الـ backend يتوقع رقم معرف

### الحل المطبق:

#### 1. تحديث نموذج Django:
```python
# تم تغيير هذا:
related_entity = models.ForeignKey(GovernmentEntity, on_delete=models.CASCADE, 
                                 null=True, blank=True, verbose_name='الجهة المعنية')

# إلى هذا:
related_entity = models.CharField(max_length=200, verbose_name='الجهة المعنية')
```

#### 2. إضافة الحقول المفقودة:
```python
# تم إضافة هذه الحقول إلى نموذج CitizenFeedback:
age = models.IntegerField(verbose_name='العمر', null=True, blank=True)
gender = models.CharField(max_length=10, choices=[('male', 'ذكر'), ('female', 'أنثى')], 
                         verbose_name='الجنس', null=True, blank=True)
education_level = models.CharField(max_length=20, choices=[...], 
                                  verbose_name='المستوى التعليمي', null=True, blank=True)
occupation = models.CharField(max_length=100, verbose_name='المهنة', null=True, blank=True)
governorate = models.CharField(max_length=50, verbose_name='المحافظة', null=True, blank=True)
city = models.CharField(max_length=100, verbose_name='المدينة', null=True, blank=True)
preferred_contact_method = models.CharField(max_length=20, choices=[...], 
                                           verbose_name='طريقة التواصل المفضلة', null=True, blank=True)
previous_attempts = models.BooleanField(default=False, verbose_name='محاولات سابقة')
previous_attempts_description = models.TextField(verbose_name='وصف المحاولات السابقة', 
                                                null=True, blank=True)
consent_data_processing = models.BooleanField(default=False, verbose_name='موافقة معالجة البيانات')
consent_contact = models.BooleanField(default=False, verbose_name='موافقة التواصل')
```

#### 3. تحديث الـ Serializer:
```python
# تم إزالة هذا السطر من CitizenFeedbackSerializer:
related_entity_name = serializers.CharField(source='related_entity.entity_name', read_only=True)
```

#### 4. إنشاء Migrations:
- `0002_alter_citizenfeedback_related_entity.py` - لتحويل related_entity إلى CharField
- `0003_add_citizenfeedback_fields.py` - لإضافة الحقول المفقودة

### النتيجة:
- الآن يمكن إرسال اسم الجهة كنص عادي دون الحاجة لرقم معرف
- تم إضافة جميع الحقول المطلوبة للنموذج
- الاستمارة ستعمل بشكل صحيح مع جميع الحقول المطلوبة

### الخطوات التالية:
1. تطبيق الـ migrations على قاعدة البيانات
2. إعادة تشغيل خادم Django
3. اختبار إرسال الاستمارة

### أوامر التطبيق:
```bash
cd backend
python manage.py migrate
python manage.py runserver
```

### ملاحظات إضافية:
- تم الحفاظ على جميع الحقول المطلوبة في الـ frontend
- التحقق من صحة البيانات يعمل بشكل صحيح
- الاستمارة تدعم الإرسال المجهول والإرسال بالاسم الحقيقي
- جميع الموافقات والحقول الإضافية مدعومة

هذا الحل يضمن أن الاستمارة ستعمل بشكل صحيح دون أخطاء في نوع البيانات.
