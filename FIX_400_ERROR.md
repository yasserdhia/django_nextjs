# حل مشكلة خطأ 400 (Bad Request) في تقديم الاستمارة

## المشكلة
عند الضغط على زر "تقديم الاستمارة" يظهر الخطأ التالي:
```
Request failed with status code 400
```

## الأسباب المحتملة

### 1. بيانات مفقودة أو غير صحيحة
- حقول مطلوبة فارغة
- تنسيق البيانات غير صحيح
- أنواع البيانات غير متطابقة

### 2. مشاكل في المصادقة
- التوكن منتهي الصلاحية
- التوكن مفقود
- صيغة التوكن غير صحيحة

### 3. مشاكل في الخادم
- خطأ في validation في Django
- مشكلة في serializer
- خطأ في قاعدة البيانات

## التشخيص والحلول

### 1. تحقق من البيانات المرسلة
```typescript
// استخدم الأداة المطورة للتشخيص
import { debugFormData, validateFormData } from '@/utils/debugForm';

const onSubmit = async (data: GovernmentEntityFormData) => {
  // تشخيص البيانات
  debugFormData(data);
  
  // التحقق من صحة البيانات
  const errors = validateFormData(data);
  if (errors.length > 0) {
    console.error('أخطاء في البيانات:', errors);
    return;
  }
  
  // باقي الكود...
};
```

### 2. تحقق من التوكن
```typescript
const token = localStorage.getItem('access_token');
if (!token) {
  console.error('لا يوجد توكن مصادقة');
  router.push('/login');
  return;
}
```

### 3. إضافة logging مفصل
```typescript
// في api.ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    // باقي الكود...
  }
);
```

### 4. التحقق من الخادم
```bash
# تشغيل الخادم
cd c:\Users\YASSER\Desktop\django_project\backend
python manage.py runserver

# التحقق من logs
python manage.py collectstatic
python manage.py migrate
```

### 5. اختبار الاتصال
افتح الصفحة: `http://localhost:3000/test-connection`
لتشغيل اختبارات شاملة للنظام

## الحلول المطبقة

### 1. تحسين معالجة الأخطاء
- إضافة logging مفصل
- عرض رسائل خطأ واضحة
- التحقق من صحة البيانات قبل الإرسال

### 2. تحسين validation
- التحقق من جميع الحقول المطلوبة
- التحقق من تنسيق البيانات
- تحويل أنواع البيانات للشكل المطلوب

### 3. تحسين المصادقة
- التحقق من وجود التوكن
- إضافة التوكن لكل طلب
- معالجة انتهاء صلاحية التوكن

### 4. أداة التشخيص
- إنشاء أداة شاملة للتشخيص
- صفحة اختبار الاتصال
- معلومات مفصلة عن الأخطاء

## خطوات الاستكشاف

1. **افتح Developer Tools في المتصفح**
2. **انتقل إلى Console tab**
3. **اضغط على زر تقديم الاستمارة**
4. **انظر إلى الرسائل المطبوعة**
5. **إذا كان هناك خطأ 400، تحقق من:**
   - البيانات المرسلة
   - رسالة الخطأ من الخادم
   - وجود التوكن

## نصائح إضافية

### للمطورين
- استخدم `debugFormData()` قبل كل إرسال
- تحقق من console للرسائل المفصلة
- استخدم صفحة test-connection للاختبار

### للمستخدمين
- تأكد من ملء جميع الحقول المطلوبة
- تحقق من صحة البريد الإلكتروني
- تأكد من صحة أرقام الهاتف
- تسجيل الدخول مرة أخرى إذا انتهت الجلسة

## ملفات محدثة

1. `/utils/debugForm.ts` - أداة التشخيص
2. `/lib/api.ts` - معالجة أخطاء محسنة
3. `/pages/forms/government-entity.tsx` - تشخيص وvalidation
4. `/pages/test-connection.tsx` - صفحة اختبار شاملة

## اختبار الحل

1. افتح الموقع
2. سجل الدخول
3. اذهب إلى استمارة الجهة الحكومية
4. املأ جميع الحقول
5. اضغط على تقديم
6. تحقق من console للرسائل
7. إذا استمر الخطأ، استخدم صفحة test-connection
