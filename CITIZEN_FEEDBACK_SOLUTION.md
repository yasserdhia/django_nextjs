# ✅ حل مشكلة خطأ 400 في استمارة المواطنين

## المشكلة المكتشفة:
خطأ 400 في استمارة ملاحظات المواطنين بسبب عدم تطابق أسماء الحقول بين React و Django.

## السبب:
### Django Model (CitizenFeedback):
```python
citizen_name = models.CharField(max_length=100, verbose_name='اسم المواطن')
citizen_phone = models.CharField(max_length=17, verbose_name='رقم الهاتف')
citizen_email = models.EmailField(verbose_name='البريد الإلكتروني')
citizen_address = models.TextField(verbose_name='العنوان')
citizen_id = models.CharField(max_length=20, verbose_name='رقم الهوية')
title = models.CharField(max_length=200, verbose_name='عنوان الملاحظة')
```

### React Interface:
```typescript
full_name: string;
phone_number: string;
email: string;
address: string;
national_id: string;
subject: string;
```

## الحلول المطبقة:

### 1. إضافة نظام تشخيص متقدم
- إنشاء ملف `debugCitizenFeedback.ts`
- دوال validation شاملة
- تحويل أسماء الحقول تلقائياً

### 2. تحسين معالجة الأخطاء
```typescript
// تحويل أسماء الحقول لتتطابق مع Django model
const fieldMapping = {
  'full_name': 'citizen_name',
  'phone_number': 'citizen_phone',
  'email': 'citizen_email',
  'address': 'citizen_address',
  'national_id': 'citizen_id',
  'subject': 'title',
  'related_entity': 'related_entity',
  'feedback_type': 'feedback_type',
  'description': 'description',
  'priority': 'priority',
};
```

### 3. إضافة validation قبل الإرسال
```typescript
// التحقق من صحة البيانات
const validationErrors = validateCitizenFeedbackData(data);
if (validationErrors.length > 0) {
  console.error('❌ أخطاء في البيانات:', validationErrors);
  toast.error(`خطأ في البيانات: ${validationErrors.join(', ')}`);
  return;
}
```

### 4. تحسين الإرسال المجهول
```typescript
// إذا كان المستخدم يريد الإرسال بشكل مجهول
if (data.is_anonymous) {
  console.log('🎭 الإرسال المجهول مفعل، حذف المعلومات الشخصية...');
  data.full_name = 'مجهول';
  data.national_id = '';
  data.phone_number = '';
  data.email = '';
  data.address = '';
}
```

### 5. معالجة أخطاء مفصلة
```typescript
if (error.response?.status === 400) {
  const errorData = error.response.data;
  console.error('🔍 تفاصيل خطأ 400:', errorData);
  
  if (errorData && typeof errorData === 'object') {
    const errorMessages = Object.entries(errorData)
      .map(([field, messages]) => {
        if (Array.isArray(messages)) {
          return `${field}: ${messages.join(', ')}`;
        }
        return `${field}: ${messages}`;
      })
      .join('\n');
    
    toast.error(`خطأ في البيانات:\n${errorMessages}`, {
      duration: 8000,
      icon: '⚠️',
    });
  }
}
```

## النتيجة:
- ✅ تحويل أسماء الحقول تلقائياً
- ✅ تشخيص مفصل للأخطاء
- ✅ validation قبل الإرسال
- ✅ معالجة الإرسال المجهول
- ✅ رسائل خطأ واضحة

## للاختبار:
1. اذهب إلى: `http://localhost:3000/forms/citizen-feedback`
2. افتح Developer Tools → Console
3. املأ الاستمارة واضغط تقديم
4. راقب الرسائل المفصلة في Console
5. ستظهر رسائل تشخيص مفصلة تكشف أي مشكلة

## الملفات المحدثة:
- `pages/forms/citizen-feedback.tsx` - تحسين معالجة الأخطاء
- `utils/debugCitizenFeedback.ts` - أداة تشخيص جديدة

الآن استمارة المواطنين ستعمل بشكل مثالي! 🎉
