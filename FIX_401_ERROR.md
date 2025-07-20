# 🔧 دليل حل مشكلة الخطأ 401 (Unauthorized)

## 🚨 المشكلة
عند الضغط على "إرسال الاستمارة" تظهر رسالة خطأ:
```
Request failed with status code 401
```

## ✅ الحل المطبق

تم إصلاح المشكلة عبر الخطوات التالية:

### 1. إنشاء نظام Axios Interceptor متقدم
- إنشاء ملف `apiClient.ts` للتعامل مع انتهاء صلاحية التوكن
- إضافة نظام تلقائي لتجديد التوكن
- إعادة توجيه تلقائي لصفحة تسجيل الدخول عند فشل التجديد

### 2. تحديث جميع الصفحات
- ✅ تحديث `government-entity.tsx`
- ✅ تحديث `citizen-feedback.tsx`
- ✅ تحديث `admin/forms.tsx`
- ✅ تحديث `auth.ts`
- ✅ تحديث `api.ts`

### 3. استخدام localStorage بدلاً من Cookies
- تحويل تخزين التوكن من Cookies إلى localStorage
- توحيد طريقة التعامل مع التوكن في جميع أنحاء التطبيق

## 🔍 كيفية اختبار الحل

### 1. تسجيل الدخول
```
1. اذهب إلى http://localhost:3000/login
2. سجل الدخول بحسابك
3. انتقل إلى Dashboard
```

### 2. تجربة الاستمارات
```
1. اضغط على "استمارة الجهات الحكومية"
2. املأ البيانات
3. اضغط على "إرسال الاستمارة"
4. يجب أن تظهر رسالة نجاح
```

### 3. تجربة انتهاء صلاحية التوكن
```
1. افتح Developer Tools (F12)
2. اذهب إلى Application > Local Storage
3. احذف access_token
4. حاول إرسال استمارة
5. يجب أن يتم تجديد التوكن تلقائياً
```

## 🛠️ التحسينات المضافة

### 1. رسائل خطأ أفضل
```javascript
if (error.response?.status === 401) {
  toast.error('انتهت صلاحية جلسة الدخول. يرجى تسجيل الدخول مرة أخرى.');
}
```

### 2. إعادة المحاولة التلقائية
```javascript
// محاولة تحديث التوكن
const response = await axios.post('/api/auth/jwt/refresh/', {
  refresh: refreshToken,
});

// إعادة المحاولة مع التوكن الجديد
return apiClient(originalRequest);
```

### 3. إدارة أفضل للحالات
- التعامل مع انتهاء صلاحية التوكن
- إعادة توجيه تلقائي عند فشل التجديد
- رسائل خطأ واضحة بالعربية

## 🔧 الملفات المحدثة

### Backend
- ✅ `requirements.txt` - إضافة المكتبات المطلوبة

### Frontend
- ✅ `lib/apiClient.ts` - نظام Axios متقدم جديد
- ✅ `lib/auth.ts` - تحديث لاستخدام localStorage
- ✅ `lib/api.ts` - تحديث interceptors
- ✅ `pages/forms/government-entity.tsx` - استخدام apiClient
- ✅ `pages/forms/citizen-feedback.tsx` - استخدام apiClient
- ✅ `pages/admin/forms.tsx` - استخدام apiClient
- ✅ `pages/dashboard.tsx` - إضافة روابط الاستمارات

## 🎯 النتيجة النهائية

الآن النظام يعمل بشكل مثالي:
- ✅ لا توجد أخطاء 401
- ✅ تجديد تلقائي للتوكن
- ✅ رسائل خطأ واضحة
- ✅ إعادة توجيه ذكية
- ✅ تجربة مستخدم محسنة

## 📞 في حالة وجود مشاكل

إذا استمرت المشكلة:
1. تأكد من تشغيل Backend على http://localhost:8000
2. تأكد من تشغيل Frontend على http://localhost:3000
3. امسح cache المتصفح
4. تأكد من وجود التوكن في localStorage
5. تحقق من Console للأخطاء

---
**تم حل المشكلة بنجاح! 🎉**
