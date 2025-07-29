# 📖 شرح شامل لهيكل المشروع - نظام إدارة الاستمارات الحكومية

## 📋 فهرس المحتويات

1. [نظرة عامة على المشروع](#-نظرة-عامة-على-المشروع)
2. [هيكل المشروع العام](#️-هيكل-المشروع-العام)
3. [الباك إند (Django)](#-الباك-إند-django)
4. [الفرونت إند (Next.js)](#-الفرونت-إند-nextjs)
5. [صفحات الويب الرئيسية](#-صفحات-الويب-الرئيسية)
6. [نظام المصادقة والحماية](#-نظام-المصادقة-والحماية)
7. [إدارة الاستمارات](#-إدارة-الاستمارات)
8. [قاعدة البيانات والنماذج](#️-قاعدة-البيانات-والنماذج)
9. [واجهات API](#-واجهات-api)
10. [الخصائص المتقدمة](#-الخصائص-المتقدمة)

---

## 🎯 نظرة عامة على المشروع

**نظام إدارة الاستمارات الحكومية** هو تطبيق ويب متكامل مصمم خصيصاً للأمانة العامة لمجلس الوزراء. يوفر النظام:

- **إدارة الجهات الحكومية** - تسجيل وإدارة الجهات الحكومية
- **ملاحظات المواطنين** - نظام للشكاوى والاقتراحات
- **الاستمارات المخصصة** - إنشاء استمارات ديناميكية قابلة للتخصيص
- **لوحة الإدارة** - إحصائيات وتقارير شاملة
- **نظام مصادقة متقدم** - JWT مع حماية الصفحات

---

## 🏗️ هيكل المشروع العام

```
django_nextjs/
├── 📁 backend/          # خادم Django (API)
├── 📁 frontend/         # تطبيق Next.js (الواجهة)
├── 📁 pgadmin/          # إعدادات إدارة قاعدة البيانات
├── 📄 docker-compose.yml
├── 📄 README.md
└── 📄 database_schema.txt
```

---

## 🐍 الباك إند (Django)

### 📁 الهيكل الأساسي

```
backend/
├── 📁 accounts/         # نظام المصادقة والمستخدمين
├── 📁 forms/            # الاستمارات التقليدية
├── 📁 custom_forms/     # الاستمارات المخصصة
├── 📁 backend/          # إعدادات Django الرئيسية
├── 📄 manage.py
└── 📄 requirements.txt
```

### 🔐 تطبيق accounts - نظام المصادقة

**الملفات الرئيسية:**
- `📄 models.py` - نموذج المستخدم المخصص
- `📄 serializers.py` - تسلسل بيانات المستخدمين
- `📄 views.py` - عرض ملف المستخدم الشخصي
- `📄 admin.py` - إدارة المستخدمين
- `📄 urls.py` - مسارات API

**النموذج الأساسي:**
```python
# accounts/models.py
class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    
    USERNAME_FIELD = 'email'  # استخدام البريد الإلكتروني للدخول
```

**مسارات API:**
- `GET /api/user/` - جلب بيانات المستخدم الحالي
- `PUT /api/user/` - تحديث بيانات المستخدم

### 📋 تطبيق forms - الاستمارات التقليدية

**النماذج الرئيسية:**

1. **GovernmentEntity** - الجهات الحكومية
```python
# forms/models.py
class GovernmentEntity(models.Model):
    entity_name = models.CharField(max_length=255)  # اسم الجهة
    entity_type = models.CharField(max_length=100)  # نوع الجهة
    contact_person = models.CharField(max_length=255)  # المسؤول
    phone_number = models.CharField(max_length=20)  # الهاتف
    email = models.EmailField()  # البريد الإلكتروني
    address = models.TextField()  # العنوان
    description = models.TextField()  # الوصف
```

2. **CitizenFeedback** - ملاحظات المواطنين
```python
class CitizenFeedback(models.Model):
    citizen_name = models.CharField(max_length=255)  # اسم المواطن
    citizen_phone = models.CharField(max_length=20)  # الهاتف
    citizen_email = models.EmailField()  # البريد الإلكتروني
    feedback_type = models.CharField(max_length=50)  # نوع الملاحظة
    title = models.CharField(max_length=255)  # العنوان
    description = models.TextField()  # الوصف
    priority = models.CharField(max_length=20)  # الأولوية
    status = models.CharField(max_length=50)  # الحالة
```

**مسارات API:**
- `GET/POST /api/forms/government-entities/` - إدارة الجهات الحكومية
- `GET/POST /api/forms/citizen-feedback/` - إدارة ملاحظات المواطنين
- `GET /api/forms/dashboard/stats/` - إحصائيات لوحة الإدارة

### 🎨 تطبيق custom_forms - الاستمارات المخصصة

**النماذج الرئيسية:**

1. **CustomForm** - الاستمارة المخصصة
```python
# custom_forms/models.py
class CustomForm(models.Model):
    title = models.CharField(max_length=255)  # عنوان الاستمارة
    description = models.TextField(blank=True)  # الوصف
    category = models.CharField(max_length=50)  # الفئة
    fields = models.JSONField()  # حقول الاستمارة (JSON)
    is_public = models.BooleanField(default=True)  # عامة
    is_active = models.BooleanField(default=True)  # نشطة
    created_by = models.ForeignKey(User)  # منشئ الاستمارة
```

2. **FormResponse** - ردود الاستمارات
```python
class FormResponse(models.Model):
    form = models.ForeignKey(CustomForm)  # الاستمارة
    response_data = models.JSONField()  # بيانات الرد (JSON)
    submitter_name = models.CharField(max_length=255)  # اسم المرسل
    submitter_email = models.EmailField()  # بريد المرسل
    submitted_at = models.DateTimeField(auto_now_add=True)  # تاريخ الإرسال
    ip_address = models.GenericIPAddressField()  # عنوان IP
```

**مسارات API:**
- `GET /api/custom-forms/` - قائمة جميع الاستمارات
- `GET /api/custom-forms/public/` - الاستمارات العامة
- `POST /api/custom-forms/create/` - إنشاء استمارة جديدة
- `GET /api/custom-forms/manage/` - استمارات المستخدم الحالي
- `POST /api/custom-forms/submit/` - إرسال رد على استمارة
- `GET /api/custom-forms/responses/{form_id}/` - ردود استمارة معينة

---

## 🌐 الفرونت إند (Next.js)

### 📁 الهيكل الأساسي

```
frontend/src/
├── 📁 components/       # المكونات المشتركة
├── 📁 contexts/         # السياقات (Context)
├── 📁 pages/            # صفحات التطبيق
├── 📁 styles/           # ملفات التنسيق
└── 📁 utils/            # وظائف مساعدة
```

### 🧩 المكونات الرئيسية

**📄 components/ProtectedRoute.tsx**
- حماية الصفحات التي تتطلب تسجيل دخول
- إعادة توجيه المستخدمين غير المصادق عليهم

**📄 components/ThemeToggle.tsx**
- تبديل بين الوضع المظلم والفاتح
- حفظ التفضيل في localStorage

### 🎭 السياقات (Contexts)

**📄 contexts/AuthContext.tsx**
- إدارة حالة المصادقة
- وظائف تسجيل الدخول/الخروج/التسجيل
- حفظ بيانات المستخدم

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

**📄 contexts/ThemeContext.tsx**
- إدارة وضع الألوان (فاتح/مظلم)
- تطبيق التغييرات على كامل التطبيق

---

## 📄 صفحات الويب الرئيسية

### 🏠 الصفحة الرئيسية

**📍 الملف:** `frontend/src/pages/index.tsx`

**الوظيفة:**
- صفحة الترحيب والتعريف بالنظام
- أزرار للانتقال لتسجيل الدخول أو التسجيل
- عرض مميزات النظام

**المكونات:**
- تصميم متجاوب مع خلفية متحركة
- بطاقات تعريفية بالخصائص
- أزرار Call-to-Action

### 🔐 صفحة تسجيل الدخول

**📍 الملف:** `frontend/src/pages/login.tsx`

**الوظيفة:**
- نموذج تسجيل دخول بالبريد الإلكتروني وكلمة المرور
- التحقق من صحة البيانات
- رسائل خطأ ونجاح

**المميزات:**
- تصميم أنيق مع تأثيرات بصرية
- إظهار/إخفاء كلمة المرور
- التحقق الفوري من البيانات
- تبديل الوضع المظلم/الفاتح

**سير العمل:**
1. المستخدم يدخل البريد الإلكتروني وكلمة المرور
2. النظام يرسل طلب إلى `/api/auth/jwt/create/`
3. في حالة النجاح: حفظ الرموز المميزة والانتقال للوحة الإدارة
4. في حالة الفشل: عرض رسالة خطأ

### 📝 صفحة التسجيل

**📍 الملف:** `frontend/src/pages/register.tsx`

**الوظيفة:**
- نموذج تسجيل مستخدم جديد بخطوتين
- جمع البيانات الشخصية ومعلومات الحساب

**الخطوة الأولى - البيانات الشخصية:**
- الاسم الأول والأخير
- رقم الهاتف
- العنوان

**الخطوة الثانية - بيانات الحساب:**
- اسم المستخدم
- البريد الإلكتروني
- كلمة المرور مع التأكيد

**المميزات:**
- شريط تقدم يوضح الخطوة الحالية
- التحقق من البيانات لكل خطوة
- تصميم متجاوب مع تأثيرات بصرية

### 🏢 لوحة الإدارة الرئيسية

**📍 الملف:** `frontend/src/pages/dashboard.tsx`

**الوظيفة:**
- لوحة تحكم شاملة للنظام
- عرض الإحصائيات الرئيسية
- روابط سريعة للوظائف المهمة

**الأقسام الرئيسية:**

1. **بطاقات الإحصائيات:**
   - عدد الاستمارات المقدمة
   - الاستمارات المعتمدة
   - قيد المراجعة
   - المستخدمين النشطين

2. **النشاطات الأخيرة:**
   - قائمة بآخر العمليات في النظام
   - تواريخ وأوقات العمليات

3. **الإجراءات السريعة:**
   - أزرار للوصول السريع للوظائف المهمة
   - استمارة الجهات الحكومية
   - اقتراحات وشكاوى المواطنين
   - الاستمارات العامة
   - إنشاء استمارة مخصصة

4. **الملف الشخصي:**
   - صورة رمزية للمستخدم
   - اسم المستخدم والبريد الإلكتروني

---

## 🎨 صفحات إدارة الاستمارات

### 🔧 صفحة إنشاء الاستمارات المخصصة

**📍 الملف:** `frontend/src/pages/admin/form-builder.tsx`

**الوظيفة:**
- منشئ استمارات بصري (مثل Google Forms)
- إمكانية إضافة حقول مختلفة بالسحب والإفلات

**أنواع الحقول المدعومة:**
- حقل نص قصير
- حقل نص طويل (textarea)
- قائمة منسدلة (select)
- أزرار اختيار (radio)
- مربعات اختيار (checkbox)
- حقل بريد إلكتروني
- حقل رقم هاتف
- حقل تاريخ

**المميزات:**
- سحب وإفلات الحقول
- تحرير خصائص كل حقل
- معاينة مباشرة للاستمارة
- حفظ الاستمارة بصيغة JSON

### 📊 صفحة إدارة الاستمارات المخصصة

**📍 الملف:** `frontend/src/pages/admin/forms-management.tsx`

**الوظيفة:**
- عرض جميع الاستمارات المخصصة للمستخدم
- إدارة ردود الاستمارات
- إحصائيات مفصلة لكل استمارة

**الوظائف المتاحة:**
- عرض قائمة الاستمارات
- تحرير الاستمارات
- عرض الردود
- نسخ الاستمارات
- تصدير البيانات (JSON, Excel, PDF)
- حذف الاستمارات

**إدارة الردود:**
- عرض جميع ردود استمارة معينة
- تفاصيل كل رد (التاريخ، المرسل، البيانات)
- البحث والتصفية
- التصدير

### 🌐 صفحة الاستمارات العامة

**📍 الملف:** `frontend/src/pages/forms/public.tsx`

**الوظيفة:**
- عرض الاستمارات المتاحة للجمهور
- إمكانية ملء وإرسال الاستمارات

**المميزات:**
- تصفية الاستمارات حسب الفئة
- عرض وصف كل استمارة
- ملء الاستمارة تفاعلياً
- إرسال الردود
- تأكيد الإرسال

### 📋 صفحة إدارة الاستمارات التقليدية

**📍 الملف:** `frontend/src/pages/admin/forms.tsx`

**الوظيفة:**
- إدارة الجهات الحكومية وملاحظات المواطنين
- عرض الإحصائيات والبيانات

**التبويبات:**
1. **الجهات الحكومية:**
   - عرض قائمة الجهات المسجلة
   - إضافة جهة جديدة
   - تحرير بيانات الجهات
   - حذف الجهات

2. **ملاحظات المواطنين:**
   - عرض الشكاوى والاقتراحات
   - تصفية حسب النوع والحالة
   - الموافقة أو الرفض
   - إضافة ملاحظات إدارية

---

## 🔐 نظام المصادقة والحماية

### JWT (JSON Web Tokens)

**الإعداد:**
```python
# backend/settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
}
```

**مسارات المصادقة:**
- `POST /api/auth/jwt/create/` - تسجيل الدخول
- `POST /api/auth/jwt/refresh/` - تجديد الرمز المميز
- `POST /api/auth/users/` - تسجيل مستخدم جديد
- `GET /api/auth/users/me/` - جلب بيانات المستخدم الحالي

### حماية الصفحات

**المكون:** `components/ProtectedRoute.tsx`
```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
```

### إدارة الحالة

**AuthContext** يوفر:
- حالة المستخدم الحالي
- وظائف تسجيل الدخول/الخروج
- تجديد الرموز المميزة تلقائياً
- حفظ البيانات في localStorage

---

## 📊 إدارة الاستمارات

### الاستمارات التقليدية

**الجهات الحكومية:**
- نموذج ثابت بحقول محددة مسبقاً
- التحقق من صحة البيانات
- إدارة من خلال Django Admin

**ملاحظات المواطنين:**
- استمارة للشكاوى والاقتراحات
- تصنيف حسب النوع والأولوية
- نظام موافقة/رفض

### الاستمارات المخصصة

**إنشاء الاستمارات:**
1. المستخدم ينشئ استمارة جديدة
2. يضيف الحقول المطلوبة
3. يحدد نوع كل حقل وخصائصه
4. يحفظ الاستمارة بصيغة JSON

**معالجة الردود:**
1. المستخدم يملأ الاستمارة
2. البيانات تُرسل كـ JSON
3. تُحفظ في قاعدة البيانات
4. يمكن عرضها وتصديرها

**مثال على بنية JSON:**
```json
{
  "fields": [
    {
      "id": "citizen_name",
      "type": "text",
      "label": "اسم المواطن",
      "required": true,
      "placeholder": "ادخل اسمك الكامل"
    },
    {
      "id": "complaint_type",
      "type": "select",
      "label": "نوع الطلب",
      "required": true,
      "options": [
        {"value": "complaint", "label": "شكوى"},
        {"value": "suggestion", "label": "اقتراح"}
      ]
    }
  ]
}
```

---

## 🗄️ قاعدة البيانات والنماذج

### SQL Server 2019

**الإعداد:**
```python
# backend/settings_postgres.py
DATABASES = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': 'formsdb',
        'USER': 'sa',
        'PASSWORD': 'YourPassword',
        'HOST': 'localhost',
        'PORT': '1433',
    }
}
```

### النماذج الرئيسية

**accounts.User:**
- نموذج مستخدم مخصص
- استخدام البريد الإلكتروني للدخول
- حقول إضافية للاسم

**forms.GovernmentEntity:**
- بيانات الجهات الحكومية
- معلومات الاتصال
- الوصف والنوع

**forms.CitizenFeedback:**
- ملاحظات المواطنين
- التصنيف والأولوية
- حالة المعالجة

**custom_forms.CustomForm:**
- الاستمارات المخصصة
- بنية الحقول (JSON)
- إعدادات النشر

**custom_forms.FormResponse:**
- ردود الاستمارات
- البيانات (JSON)
- معلومات المرسل

---

## 🌐 واجهات API

### مصادقة الطلبات

جميع الطلبات المحمية تتطلب:
```javascript
headers: {
  'Authorization': 'Bearer ' + accessToken,
  'Content-Type': 'application/json'
}
```

### API الاستمارات التقليدية

**الجهات الحكومية:**
- `GET /api/forms/government-entities/` - قائمة الجهات
- `POST /api/forms/government-entities/` - إضافة جهة جديدة
- `PUT /api/forms/government-entities/{id}/` - تحديث جهة
- `DELETE /api/forms/government-entities/{id}/` - حذف جهة

**ملاحظات المواطنين:**
- `GET /api/forms/citizen-feedback/` - قائمة الملاحظات
- `POST /api/forms/citizen-feedback/` - إضافة ملاحظة جديدة
- `PUT /api/forms/citizen-feedback/{id}/` - تحديث ملاحظة

### API الاستمارات المخصصة

**إدارة الاستمارات:**
- `GET /api/custom-forms/` - جميع الاستمارات (محمي)
- `GET /api/custom-forms/public/` - الاستمارات العامة
- `POST /api/custom-forms/create/` - إنشاء استمارة (محمي)
- `GET /api/custom-forms/manage/` - استمارات المستخدم (محمي)
- `PUT /api/custom-forms/manage/{id}/` - تحديث استمارة (محمي)
- `DELETE /api/custom-forms/manage/{id}/` - حذف استمارة (محمي)

**إدارة الردود:**
- `POST /api/custom-forms/submit/` - إرسال رد (عام)
- `GET /api/custom-forms/responses/{form_id}/` - ردود استمارة (محمي)

**عمليات إضافية:**
- `POST /api/custom-forms/duplicate/{form_id}/` - نسخ استمارة
- `GET /api/custom-forms/export/{form_id}/{format}/` - تصدير ردود

---

## ⚡ الخصائص المتقدمة

### تصدير البيانات

**الصيغ المدعومة:**
- **JSON:** للاستخدام التقني
- **Excel:** للتحليل والمعالجة
- **PDF:** للطباعة والأرشفة

**التنفيذ:**
```typescript
const exportData = async (formId: number, format: string) => {
  const response = await apiClient.get(
    `/api/custom-forms/export/${formId}/${format}/`
  );
  // تحميل الملف
};
```

### البحث والتصفية

**في الاستمارات:**
- تصفية حسب الفئة
- البحث في العنوان والوصف
- ترتيب حسب التاريخ

**في الردود:**
- تصفية حسب التاريخ
- البحث في اسم المرسل
- ترتيب مختلف

### الإشعارات

**استخدام react-hot-toast:**
```typescript
toast.success('تم الحفظ بنجاح! 🎉');
toast.error('حدث خطأ أثناء الحفظ');
toast.loading('جاري الحفظ...');
```

### تبديل الوضع المظلم/الفاتح

**التنفيذ:**
- استخدام CSS variables
- حفظ التفضيل في localStorage
- تطبيق فوري على كامل التطبيق

### التصميم المتجاوب

**استخدام Tailwind CSS:**
- دعم كامل للأجهزة المختلفة
- تصميم mobile-first
- تأثيرات بصرية متقدمة

---

## 🔧 إعدادات الإنتاج

### Docker

**الحاويات:**
- **Backend:** Django + SQL Server
- **Frontend:** Next.js
- **Database:** SQL Server 2019

### المتغيرات البيئية

**للباك إند:**
```env
DJANGO_SETTINGS_MODULE=backend.settings_postgres
SECRET_KEY=your-secret-key
DATABASE_URL=mssql://user:pass@host:port/db
DEBUG=False
```

**للفرونت إند:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### نشر التطبيق

1. **إعداد قاعدة البيانات**
2. **تشغيل Migrations**
3. **إنشاء Superuser**
4. **جمع الملفات الثابتة**
5. **تشغيل الخوادم**

---

## 📈 الإحصائيات والتقارير

### لوحة الإدارة

**الإحصائيات المعروضة:**
- إجمالي الاستمارات
- الاستمارات النشطة
- عدد الردود
- المستخدمين النشطين

**التقارير:**
- النشاطات الأخيرة
- الاتجاهات الزمنية
- أكثر الاستمارات استخداماً

### التحليلات

**البيانات المجمعة:**
- معدل الاستجابة للاستمارات
- أوقات الذروة
- الفئات الأكثر شعبية
- معدل إكمال الاستمارات

---

## 🛡️ الأمان والحماية

### حماية البيانات

**التشفير:**
- JWT للمصادقة
- HTTPS للاتصالات
- تشفير كلمات المرور

**التحقق من الصلاحيات:**
- حماية مستوى API
- فصل البيانات حسب المستخدم
- تسجيل العمليات

### مراقبة النظام

**سجلات النشاط:**
- تسجيل جميع العمليات
- مراقبة محاولات الدخول
- تتبع التغييرات

---

## 🚀 خطط التطوير المستقبلية

### الميزات المقترحة

1. **نظام إشعارات متقدم**
2. **تقارير مخصصة**
3. **API للتكامل مع أنظمة أخرى**
4. **دعم المرفقات في الاستمارات**
5. **نظام الموافقات متعدد المستويات**
6. **تطبيق جوال**

### التحسينات التقنية

1. **تحسين الأداء**
2. **إضافة Redis للتخزين المؤقت**
3. **تحسين قاعدة البيانات**
4. **إضافة اختبارات آلية**
5. **نظام النسخ الاحتياطي الآلي**

---

## 📞 الدعم والصيانة

### المراقبة

- **حالة الخوادم**
- **أداء قاعدة البيانات**
- **استخدام الموارد**
- **أخطاء التطبيق**

### الصيانة

- **النسخ الاحتياطية اليومية**
- **تحديث التبعيات**
- **مراجعة الأمان**
- **تحسين الأداء**

---

## 🎯 خلاصة

هذا النظام يوفر حلاً متكاملاً لإدارة الاستمارات الحكومية مع مميزات متقدمة مثل:

✅ **نظام مصادقة آمن**  
✅ **واجهة مستخدم حديثة ومتجاوبة**  
✅ **إدارة متقدمة للاستمارات**  
✅ **تصدير وتحليل البيانات**  
✅ **دعم SQL Server Management Studio 22**  
✅ **تصميم قابل للتوسع والصيانة**  

النظام جاهز للاستخدام في البيئة الإنتاجية ويمكن تخصيصه حسب احتياجات الأمانة العامة لمجلس الوزراء.
