# نظام إدارة الاستمارات الحكومية - الأمانة العامة لمجلس الوزراء

## 🏛️ نظرة عامة

نظام شامل لإدارة الاستمارات الحكومية في جمهورية العراق، مصمم خصيصاً للأمانة العامة لمجلس الوزراء. يوفر النظام واجهة حديثة وسهلة الاستخدام لجمع وإدارة البيانات الحكومية واقتراحات المواطنين.

## ✨ المميزات الرئيسية

### 🔐 نظام المصادقة
- تسجيل دخول آمن باستخدام JWT
- إدارة المستخدمين والصلاحيات
- حماية البيانات الشخصية

### 📝 الاستمارات
- **استمارة الجهات الحكومية**: جمع معلومات شاملة عن الجهات الحكومية
- **استمارة اقتراحات المواطنين**: استقبال اقتراحات وشكاوى المواطنين
- نظام متعدد الخطوات لسهولة التعبئة
- دعم المرفقات والملفات

### 🎨 واجهة المستخدم
- تصميم متجاوب يعمل على جميع الأجهزة
- دعم الوضع الليلي (Dark Mode)
- تأثيرات بصرية متطورة (Glass Morphism)
- دعم كامل للغة العربية وتخطيط RTL

### 📊 لوحة التحكم الإدارية
- إحصائيات شاملة عن الاستمارات
- إدارة حالة الاستمارات (قيد المراجعة، موافق، مرفوض)
- جداول تفاعلية لعرض البيانات
- نظام تصفية وبحث متقدم

## 🛠️ التقنيات المستخدمة

### Backend
- **Django 4.2** - إطار العمل الرئيسي
- **Django REST Framework** - لبناء API
- **PostgreSQL** - قاعدة البيانات
- **JWT Authentication** - نظام المصادقة
- **Djoser** - إدارة المستخدمين

### Frontend
- **Next.js 14** - إطار العمل الأساسي
- **TypeScript** - لكتابة كود أكثر أماناً
- **Tailwind CSS** - لتصميم الواجهة
- **React Hook Form** - لإدارة النماذج
- **Axios** - للتواصل مع API
- **React Hot Toast** - للإشعارات

### أدوات إضافية
- **Docker & Docker Compose** - لإعداد البيئة
- **pgAdmin** - لإدارة قاعدة البيانات
- **ESLint & Prettier** - لجودة الكود

## 🚀 دليل التشغيل

### المتطلبات
- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- Docker (اختياري)

### التشغيل باستخدام Docker

```bash
# استنساخ المشروع
git clone <repository-url>
cd django_project

# تشغيل جميع الخدمات
docker-compose up -d

# إنشاء قاعدة البيانات
docker-compose exec backend python manage.py migrate

# إنشاء مستخدم إداري
docker-compose exec backend python manage.py createsuperuser
```

### التشغيل اليدوي

#### Backend (Django)
```bash
cd backend

# إنشاء بيئة افتراضية
python -m venv venv
source venv/bin/activate  # على Windows: venv\Scripts\activate

# تثبيت المكتبات
pip install -r requirements.txt

# إعداد قاعدة البيانات
python manage.py migrate

# إنشاء مستخدم إداري
python manage.py createsuperuser

# تشغيل السيرفر
python manage.py runserver
```

#### Frontend (Next.js)
```bash
cd frontend

# تثبيت المكتبات
npm install

# تشغيل السيرفر
npm run dev
```

## 📱 كيفية الاستخدام

### للمواطنين
1. التسجيل في النظام
2. تسجيل الدخول
3. اختيار نوع الاستمارة:
   - استمارة الجهات الحكومية
   - اقتراحات وشكاوى المواطنين
4. تعبئة البيانات المطلوبة
5. إرسال الاستمارة
6. تتبع حالة الاستمارة

### للإداريين
1. تسجيل الدخول بحساب إداري
2. الوصول للوحة التحكم الإدارية
3. مراجعة الاستمارات المقدمة
4. تحديث حالة الاستمارات
5. إدارة المستخدمين والصلاحيات

## 🔧 الإعدادات

### متغيرات البيئة (Backend)
```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgres://user:password@localhost:5432/dbname
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### متغيرات البيئة (Frontend)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📊 هيكل المشروع

```
django_project/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── forms/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── next.config.js
└── docker-compose.yml
```

## 🔒 الأمان

- تشفير كلمات المرور باستخدام Django's built-in hashing
- حماية CSRF
- التحقق من صحة البيانات على مستوى الخادم والعميل
- استخدام HTTPS في الإنتاج
- إعدادات CORS محدودة

## 🤝 المساهمة

1. إنشاء fork للمشروع
2. إنشاء branch جديد للميزة
3. إجراء التغييرات المطلوبة
4. إضافة الاختبارات
5. إرسال Pull Request

## 📞 الدعم والتواصل

- البريد الإلكتروني: support@cabinet.gov.iq
- الهاتف: +964-1-123-4567
- العنوان: الأمانة العامة لمجلس الوزراء، بغداد، العراق

## 📄 الترخيص

هذا المشروع مخصص للاستخدام الحكومي في جمهورية العراق.

---

**تم التطوير بواسطة فريق تطوير الأنظمة الحكومية**
**الأمانة العامة لمجلس الوزراء - جمهورية العراق**
