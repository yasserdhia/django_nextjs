# 📋 شرح تفصيلي لمشروع نظام إدارة الاستمارات الحكومية

## 🎯 نظرة عامة على المشروع

### 📝 وصف المشروع
نظام إدارة الاستمارات الحكومية هو تطبيق ويب متكامل مصمم لإدارة وتتبع الاستمارات الحكومية وملاحظات المواطنين. يوفر النظام واجهة سهلة الاستخدام للمواطنين لتقديم اقتراحاتهم وشكاواهم، وأدوات قوية للإدارة لمتابعة ومعالجة هذه الطلبات.

### 🏗️ الهيكل التقني
- **Frontend**: Next.js 13 مع TypeScript و Tailwind CSS
- **Backend**: Django 4.2.7 مع Django REST Framework
- **Database**: PostgreSQL 15
- **Authentication**: JWT Authentication مع Django Simple JWT
- **Containerization**: Docker و Docker Compose
- **Admin Interface**: Django Admin مع pgAdmin للإدارة

---

## 🗂️ هيكل المشروع والملفات

```
django_project/
├── backend/                     # تطبيق Django
│   ├── backend/                 # إعدادات المشروع الأساسية
│   ├── accounts/                # تطبيق إدارة المستخدمين
│   ├── forms/                   # تطبيق إدارة الاستمارات
│   ├── requirements.txt         # مكتبات Python المطلوبة
│   ├── manage.py               # ملف إدارة Django
│   └── docker-entrypoint.sh    # نص تشغيل الحاوية
├── frontend/                   # تطبيق Next.js
│   ├── src/                    # مصدر التطبيق
│   ├── public/                 # الملفات العامة
│   ├── package.json           # مكتبات Node.js
│   └── next.config.js         # إعدادات Next.js
├── pgadmin/                   # إعدادات pgAdmin
├── docker-compose.yml         # تعريف الحاويات
├── forms_api_test.html       # صفحة اختبار API
└── README.md                 # وثائق المشروع
```

---

## 🔧 Backend (Django) - التفاصيل التقنية

### 📂 Backend Structure

#### 1. **backend/backend/** - إعدادات المشروع الأساسية

##### `settings_postgres.py`
```python
# الغرض: إعدادات قاعدة البيانات والمشروع
- Database: PostgreSQL configuration
- Authentication: JWT + Token Auth
- CORS: للسماح بالاتصال من Frontend
- REST Framework: إعدادات API
- Internationalization: دعم اللغة العربية
```

**الأهمية**: 
- نقطة التحكم المركزية لجميع إعدادات المشروع
- تكوين قاعدة البيانات PostgreSQL
- إعدادات الأمان والمصادقة
- تكوين CORS للسماح بالاتصال من Frontend

##### `urls.py`
```python
# الغرض: تعريف مسارات API الرئيسية
urlpatterns = [
    path('admin/', admin.site.urls),           # واجهة الإدارة
    path('api/auth/', include('djoser.urls')), # مصادقة المستخدمين
    path('api/auth/', include('djoser.urls.jwt')), # JWT Authentication
    path('api/auth/', include('djoser.urls.authtoken')), # Token Auth
    path('api/', include('accounts.urls')),    # مسارات المستخدمين
    path('', include('forms.urls')),          # مسارات الاستمارات
]
```

#### 2. **accounts/** - تطبيق إدارة المستخدمين

##### `models.py`
```python
class User(AbstractUser):
    email = models.EmailField(unique=True)     # البريد الإلكتروني كمعرف فريد
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    
    USERNAME_FIELD = 'email'  # استخدام البريد بدلاً من اسم المستخدم
```

**الأهمية**:
- نموذج مستخدم مخصص يستخدم البريد الإلكتروني للتسجيل
- إضافة حقول إضافية حسب الحاجة
- التكامل مع نظام المصادقة في Django

##### `admin.py`
```python
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name')
```

**الأهمية**:
- واجهة إدارة مخصصة للمستخدمين
- تسهيل البحث والتصفية
- عرض المعلومات المهمة

#### 3. **forms/** - تطبيق إدارة الاستمارات

##### `models.py` - النماذج الأساسية

```python
class GovernmentEntity(models.Model):
    """نموذج الجهات الحكومية"""
    entity_name = models.CharField(max_length=200)      # اسم الجهة
    entity_type = models.CharField(max_length=100)      # نوع الجهة
    governorate = models.CharField(max_length=100)      # المحافظة
    phone_number = models.CharField(max_length=20)      # رقم الهاتف
    email = models.EmailField()                         # البريد الإلكتروني
    manager_name = models.CharField(max_length=100)     # اسم المدير
    employee_count = models.IntegerField()              # عدد الموظفين
    is_approved = models.BooleanField(default=False)    # حالة الموافقة
    created_at = models.DateTimeField(auto_now_add=True)
```

**الأهمية**:
- تخزين معلومات الجهات الحكومية
- نظام موافقة للجهات الجديدة
- ربط الجهات بالمستخدمين والملاحظات

```python
class CitizenFeedback(models.Model):
    """نموذج ملاحظات المواطنين"""
    citizen_name = models.CharField(max_length=100)
    citizen_email = models.EmailField()
    feedback_type = models.CharField(max_length=50)     # نوع الملاحظة
    title = models.CharField(max_length=200)            # العنوان
    description = models.TextField()                    # الوصف
    priority = models.CharField(max_length=20)          # الأولوية
    status = models.CharField(max_length=20)            # الحالة
    related_entity = models.ForeignKey(GovernmentEntity) # الجهة المرتبطة
```

**الأهمية**:
- تسجيل ملاحظات وشكاوى المواطنين
- تصنيف الملاحظات حسب النوع والأولوية
- ربط الملاحظات بالجهات الحكومية
- نظام متابعة الحالة

##### `views.py` - واجهات API

```python
class GovernmentEntityViewSet(viewsets.ModelViewSet):
    """API للجهات الحكومية"""
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """موافقة على الجهة الحكومية"""
        
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """إحصائيات الجهات الحكومية"""
```

**الأهمية**:
- واجهة API كاملة لإدارة الجهات الحكومية
- عمليات CRUD (إنشاء، قراءة، تحديث، حذف)
- وظائف إضافية مثل الموافقة والإحصائيات

```python
class DashboardViewSet(viewsets.ViewSet):
    """API لوحة التحكم"""
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """إحصائيات عامة للوحة التحكم"""
        return Response({
            'government_entities': {...},
            'citizen_feedback': {...},
            'total_submissions': ...,
            'active_users': ...
        })
```

**الأهمية**:
- توفير إحصائيات شاملة للنظام
- لوحة تحكم للمديرين
- تجميع البيانات من جميع النماذج

##### `serializers.py` - مسلسلات البيانات

```python
class GovernmentEntitySerializer(serializers.ModelSerializer):
    """مسلسل الجهات الحكومية"""
    class Meta:
        model = GovernmentEntity
        fields = '__all__'

class DashboardStatsSerializer(serializers.Serializer):
    """مسلسل إحصائيات لوحة التحكم"""
    government_entities = GovernmentEntityStatsSerializer()
    citizen_feedback = CitizenFeedbackStatsSerializer()
    total_submissions = serializers.IntegerField()
    active_users = serializers.IntegerField()
```

**الأهمية**:
- تحويل البيانات من وإلى JSON
- التحقق من صحة البيانات
- تنسيق البيانات للعرض

##### `admin.py` - واجهة الإدارة

```python
@admin.register(GovernmentEntity)
class GovernmentEntityAdmin(admin.ModelAdmin):
    list_display = ['entity_name', 'entity_type', 'governorate', 'is_approved']
    list_filter = ['entity_type', 'governorate', 'is_approved']
    search_fields = ['entity_name', 'manager_name', 'email']
    
    fieldsets = (
        ('معلومات الجهة الأساسية', {
            'fields': ('entity_name', 'entity_type', 'governorate')
        }),
        ('معلومات الاتصال', {
            'fields': ('phone_number', 'email', 'website')
        }),
        # المزيد من الحقول...
    )
```

**الأهمية**:
- واجهة إدارة سهلة الاستخدام
- تصفية وبحث متقدم
- تنظيم الحقول في مجموعات

##### `urls.py` - مسارات API

```python
router = DefaultRouter()
router.register(r'government-entities', GovernmentEntityViewSet)
router.register(r'citizen-feedback', CitizenFeedbackViewSet)
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('api/forms/', include(router.urls)),
    path('api/forms/citizen-feedback/create/', create_citizen_feedback),
]
```

**الأهمية**:
- تنظيم مسارات API
- ربط ViewSets بالمسارات
- دعم عمليات REST كاملة

---

## 🎨 Frontend (Next.js) - التفاصيل التقنية

### 📂 Frontend Structure

#### 1. **src/pages/** - صفحات التطبيق

##### `login.tsx`
```typescript
// الغرض: صفحة تسجيل الدخول
const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { register, handleSubmit } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
    router.push('/dashboard');
  };
}
```

**الأهمية**:
- نقطة دخول المستخدمين للنظام
- التكامل مع نظام المصادقة
- التحقق من البيانات
- إعادة توجيه بعد تسجيل الدخول

##### `admin/forms.tsx`
```typescript
// الغرض: صفحة إدارة الاستمارات
const FormsAdminPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalGovernmentEntities: 0,
    totalCitizenFeedback: 0,
    pendingApproval: 0,
    approved: 0
  });
  
  const fetchData = async () => {
    const [entitiesResponse, feedbackResponse, dashboardResponse] = await Promise.all([
      apiClient.get('/api/forms/government-entities/'),
      apiClient.get('/api/forms/citizen-feedback/'),
      apiClient.get('/api/forms/dashboard/stats/')
    ]);
  };
}
```

**الأهمية**:
- صفحة إدارة رئيسية للاستمارات
- عرض الإحصائيات والبيانات
- إدارة الجهات الحكومية والملاحظات
- واجهة سهلة للمديرين

#### 2. **src/contexts/** - إدارة الحالة

##### `AuthContext.tsx`
```typescript
// الغرض: إدارة حالة المصادقة
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/api/auth/token/login/', { email, password });
    localStorage.setItem('access_token', response.data.auth_token);
    setUser(response.data.user);
  };
}
```

**الأهمية**:
- إدارة مركزية لحالة المصادقة
- تخزين معلومات المستخدم
- توفير وظائف تسجيل الدخول والخروج
- حماية الصفحات المحمية

#### 3. **src/utils/** - الأدوات المساعدة

##### `apiClient.ts`
```typescript
// الغرض: عميل API موحد
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة Token تلقائياً
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});
```

**الأهمية**:
- توحيد طريقة التعامل مع API
- إضافة التوكن تلقائياً
- معالجة الأخطاء المركزية
- تسهيل صيانة الكود

---

## 🐳 Docker Configuration

### `docker-compose.yml`
```yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: fullstack_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
  
  backend:
    build: ./backend
    restart: unless-stopped
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/fullstack_db
      - DJANGO_SETTINGS_MODULE=backend.settings_postgres
    ports:
      - "8000:8000"
  
  frontend:
    build: ./frontend
    depends_on:
      - backend
    ports:
      - "3000:3000"
  
  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "8080:80"
```

**الأهمية**:
- تعريف جميع خدمات المشروع
- ربط الخدمات ببعضها
- إعداد متغيرات البيئة
- تسهيل النشر والتطوير

### `backend/Dockerfile`
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# تثبيت المتطلبات
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    netcat-traditional \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# تحويل line endings وإعطاء صلاحيات
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && \
    chmod +x /app/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
```

**الأهمية**:
- تعريف بيئة Python للتطبيق
- تثبيت المتطلبات والمكتبات
- إعداد نص التشغيل
- توفير بيئة معزولة ومتسقة

### `backend/docker-entrypoint.sh`
```bash
#!/bin/bash
set -e

echo "🔄 Waiting for database..."
while ! nc -z db 5432; do
  sleep 2
done
echo "✅ Database is ready!"

echo "🔄 Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "👤 Creating superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@admin.com').exists():
    try:
        User.objects.create_superuser('admin', 'admin@admin.com', 'admin123')
        print('✅ Superuser created: admin@admin.com / admin123')
    except Exception as e:
        print(f'⚠️ Superuser creation failed: {e}')
else:
    print('✅ Superuser already exists')
"

echo "🚀 Starting Django server..."
exec python manage.py runserver 0.0.0.0:8000
```

**الأهمية**:
- انتظار جاهزية قاعدة البيانات
- تطبيق migrations تلقائياً
- إنشاء مستخدم مدير تلقائياً
- تشغيل الخادم

---

## 🔧 الميزات الرئيسية

### 1. **نظام المصادقة**
- **JWT Authentication**: توكن آمن لتسجيل الدخول
- **Token Authentication**: دعم إضافي للتوكن
- **Session Management**: إدارة جلسات المستخدمين
- **Password Security**: تشفير كلمات المرور

### 2. **إدارة الجهات الحكومية**
- **Registration**: تسجيل جهات جديدة
- **Approval System**: نظام موافقة للجهات
- **Data Management**: إدارة شاملة للبيانات
- **Statistics**: إحصائيات مفصلة

### 3. **إدارة ملاحظات المواطنين**
- **Submission System**: نظام تقديم الملاحظات
- **Categorization**: تصنيف حسب النوع والأولوية
- **Status Tracking**: متابعة حالة الملاحظات
- **Assignment**: تعيين المسؤولين

### 4. **لوحة التحكم**
- **Real-time Statistics**: إحصائيات فورية
- **Data Visualization**: عرض البيانات بصرياً
- **Filtering & Search**: تصفية وبحث متقدم
- **Export Capabilities**: تصدير البيانات

### 5. **واجهة الإدارة**
- **Django Admin**: واجهة إدارة قوية
- **pgAdmin**: إدارة قاعدة البيانات
- **User Management**: إدارة المستخدمين
- **Permissions**: نظام صلاحيات متقدم

---

## 🛠️ التقنيات المستخدمة

### Backend Technologies
- **Django 4.2.7**: إطار عمل Python قوي
- **Django REST Framework**: لبناء APIs
- **PostgreSQL 15**: قاعدة بيانات قوية
- **Django Simple JWT**: للمصادقة
- **Djoser**: لإدارة المستخدمين
- **Django CORS Headers**: للتعامل مع CORS

### Frontend Technologies
- **Next.js 13**: إطار React متقدم
- **TypeScript**: لكتابة كود آمن
- **Tailwind CSS**: للتصميم السريع
- **React Hook Form**: لإدارة النماذج
- **Axios**: للتعامل مع API
- **React Hot Toast**: للإشعارات

### DevOps & Tools
- **Docker**: لتطوير ونشر التطبيقات
- **Docker Compose**: لإدارة الخدمات المتعددة
- **pgAdmin**: لإدارة قاعدة البيانات
- **Git**: لإدارة النسخ

---

## 📊 قاعدة البيانات

### Schema Design

#### Users Table (accounts_user)
```sql
CREATE TABLE accounts_user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(254) UNIQUE NOT NULL,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    date_joined TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);
```

#### Government Entities Table (forms_governmententity)
```sql
CREATE TABLE forms_governmententity (
    id SERIAL PRIMARY KEY,
    entity_name VARCHAR(200) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(254),
    address TEXT,
    manager_name VARCHAR(100),
    manager_position VARCHAR(100),
    employee_count INTEGER,
    establishment_date DATE,
    services_provided TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    submitted_by_id INTEGER REFERENCES accounts_user(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Citizen Feedback Table (forms_citizenfeedback)
```sql
CREATE TABLE forms_citizenfeedback (
    id SERIAL PRIMARY KEY,
    citizen_name VARCHAR(100) NOT NULL,
    citizen_email VARCHAR(254) NOT NULL,
    citizen_phone VARCHAR(20),
    citizen_address TEXT,
    citizen_id VARCHAR(50),
    feedback_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending',
    related_entity_id INTEGER REFERENCES forms_governmententity(id),
    assigned_to_id INTEGER REFERENCES accounts_user(id),
    admin_notes TEXT,
    resolution TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);
```

---

## 🚀 التشغيل والاستخدام

### متطلبات التشغيل
- **Docker**: لتشغيل الحاويات
- **Docker Compose**: لإدارة الخدمات
- **Git**: لتحميل المشروع
- **متصفح حديث**: لاستخدام التطبيق

### خطوات التشغيل
```bash
# 1. تحميل المشروع
git clone <repository-url>
cd django_project

# 2. تشغيل جميع الخدمات
docker-compose up -d

# 3. التحقق من الخدمات
docker-compose ps

# 4. الوصول للتطبيق
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Django Admin: http://localhost:8000/admin
# pgAdmin: http://localhost:8080
```

### بيانات الدخول الافتراضية
- **Admin User**: admin@admin.com / admin123
- **pgAdmin**: admin@admin.com / admin

---

## 🔐 الأمان والصلاحيات

### نظام المصادقة
- **JWT Tokens**: توكن آمن مع انتهاء صلاحية
- **Password Hashing**: تشفير كلمات المرور
- **CORS Configuration**: تحديد المصادر المسموحة
- **Permission Classes**: تحديد الصلاحيات لكل API

### مستويات الوصول
- **Public**: الصفحات العامة
- **Authenticated**: المستخدمين المسجلين
- **Staff**: الموظفين
- **Admin**: المديرين فقط

---

## 📈 الإحصائيات والتقارير

### Dashboard Analytics
- **Government Entities**: عدد الجهات الحكومية
- **Citizen Feedback**: عدد ملاحظات المواطنين
- **Approval Status**: حالة الموافقات
- **User Activity**: نشاط المستخدمين
- **Submission Trends**: اتجاهات التقديم

### Data Export
- **CSV Export**: تصدير البيانات
- **PDF Reports**: تقارير PDF
- **Excel Integration**: تكامل مع Excel
- **API Access**: الوصول للبيانات عبر API

---

## 🧪 الاختبار والمراقبة

### ملفات الاختبار
- **forms_api_test.html**: اختبار شامل للـ API
- **test_backend.bat**: اختبار الخدمات
- **monitor_backend.bat**: مراقبة الحاويات

### مراقبة الأداء
- **Container Health**: مراقبة صحة الحاويات
- **Database Performance**: أداء قاعدة البيانات
- **API Response Times**: أوقات استجابة API
- **Error Logging**: تسجيل الأخطاء

---

## 🔄 التطوير والصيانة

### Development Workflow
1. **Local Development**: تطوير محلي
2. **Code Review**: مراجعة الكود
3. **Testing**: اختبار شامل
4. **Docker Build**: بناء الحاويات
5. **Deployment**: النشر

### Maintenance Tasks
- **Database Backups**: نسخ احتياطية
- **Security Updates**: تحديثات الأمان
- **Performance Optimization**: تحسين الأداء
- **Log Management**: إدارة السجلات

---

## 📋 الخلاصة

هذا المشروع يمثل نظاماً متكاملاً لإدارة الاستمارات الحكومية مع الميزات التالية:

### ✅ نقاط القوة
- **Architecture**: هيكل متطور ومرن
- **Security**: أمان متقدم ومصادقة قوية
- **Scalability**: قابلية التوسع
- **User Experience**: تجربة مستخدم ممتازة
- **Admin Tools**: أدوات إدارة قوية

### 🎯 الاستخدامات
- **Government Agencies**: الجهات الحكومية
- **Citizen Services**: خدمات المواطنين
- **Data Management**: إدارة البيانات
- **Reporting**: التقارير والإحصائيات
- **Administrative Tasks**: المهام الإدارية

### 🚀 المستقبل
- **Mobile App**: تطبيق محمول
- **Advanced Analytics**: تحليلات متقدمة
- **Integration**: تكامل مع أنظمة أخرى
- **AI Features**: ميزات الذكاء الاصطناعي
- **Real-time Notifications**: إشعارات فورية

---

## 📞 الدعم والمساعدة

### الوصول للخدمات
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **pgAdmin**: http://localhost:8080

### المراجع المفيدة
- **Django Documentation**: https://docs.djangoproject.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **Docker Documentation**: https://docs.docker.com/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

*هذا المشروع يوفر حلاً شاملاً ومتطوراً لإدارة الاستمارات الحكومية مع التركيز على الأمان والأداء وسهولة الاستخدام.*
