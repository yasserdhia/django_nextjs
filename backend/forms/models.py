# forms/models.py
from django.db import models
from django.core.validators import RegexValidator
from accounts.models import User

class GovernmentEntity(models.Model):
    """نموذج الجهة الحكومية"""
    ENTITY_TYPES = [
        ('ministry', 'وزارة'),
        ('authority', 'هيئة'),
        ('commission', 'لجنة'),
        ('department', 'دائرة'),
        ('directorate', 'مديرية'),
        ('municipality', 'بلدية'),
        ('governorate', 'محافظة'),
        ('other', 'أخرى'),
    ]
    
    GOVERNORATES = [
        ('baghdad', 'بغداد'),
        ('basra', 'البصرة'),
        ('nineveh', 'نينوى'),
        ('erbil', 'أربيل'),
        ('najaf', 'النجف'),
        ('karbala', 'كربلاء'),
        ('wasit', 'واسط'),
        ('maysan', 'ميسان'),
        ('babylon', 'بابل'),
        ('dhi_qar', 'ذي قار'),
        ('anbar', 'الأنبار'),
        ('diyala', 'ديالى'),
        ('kirkuk', 'كركوك'),
        ('salah_al_din', 'صلاح الدين'),
        ('sulaymaniyah', 'السليمانية'),
        ('duhok', 'دهوك'),
        ('muthanna', 'المثنى'),
        ('qadisiyyah', 'القادسية'),
    ]
    
    # معلومات الجهة الأساسية
    entity_name = models.CharField(max_length=200, verbose_name='اسم الجهة')
    entity_type = models.CharField(max_length=50, choices=ENTITY_TYPES, verbose_name='نوع الجهة')
    governorate = models.CharField(max_length=50, choices=GOVERNORATES, verbose_name='المحافظة')
    address = models.TextField(verbose_name='العنوان التفصيلي')
    
    # معلومات الاتصال
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="رقم الهاتف غير صحيح")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, verbose_name='رقم الهاتف')
    email = models.EmailField(verbose_name='البريد الإلكتروني')
    website = models.URLField(blank=True, null=True, verbose_name='الموقع الإلكتروني')
    
    # معلومات المسؤول
    manager_name = models.CharField(max_length=100, verbose_name='اسم المسؤول')
    manager_position = models.CharField(max_length=100, verbose_name='منصب المسؤول')
    manager_phone = models.CharField(validators=[phone_regex], max_length=17, verbose_name='هاتف المسؤول')
    manager_email = models.EmailField(verbose_name='بريد المسؤول الإلكتروني')
    
    # معلومات إضافية
    establishment_date = models.DateField(verbose_name='تاريخ التأسيس')
    employee_count = models.IntegerField(verbose_name='عدد الموظفين')
    annual_budget = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='الميزانية السنوية (دينار)')
    
    # خدمات الجهة
    services_provided = models.TextField(verbose_name='الخدمات المقدمة')
    target_audience = models.TextField(verbose_name='الجمهور المستهدف')
    
    # معلومات تقنية
    has_electronic_system = models.BooleanField(default=False, verbose_name='يوجد نظام إلكتروني')
    system_description = models.TextField(blank=True, verbose_name='وصف النظام الإلكتروني')
    
    # معلومات الشفافية
    publishes_reports = models.BooleanField(default=False, verbose_name='ينشر تقارير دورية')
    has_complaints_system = models.BooleanField(default=False, verbose_name='يوجد نظام شكاوى')
    
    # معلومات الجودة
    has_quality_certificate = models.BooleanField(default=False, verbose_name='يوجد شهادة جودة')
    quality_certificate_type = models.CharField(max_length=100, blank=True, verbose_name='نوع شهادة الجودة')
    
    # معلومات المشاريع
    current_projects = models.TextField(verbose_name='المشاريع الحالية')
    future_plans = models.TextField(verbose_name='الخطط المستقبلية')
    
    # معلومات الشراكات
    partnerships = models.TextField(blank=True, verbose_name='الشراكات مع جهات أخرى')
    international_cooperation = models.TextField(blank=True, verbose_name='التعاون الدولي')
    
    # معلومات التقييم
    performance_indicators = models.TextField(verbose_name='مؤشرات الأداء')
    challenges = models.TextField(verbose_name='التحديات التي تواجه الجهة')
    needs = models.TextField(verbose_name='الاحتياجات المطلوبة')
    
    # معلومات إضافية
    additional_notes = models.TextField(blank=True, verbose_name='ملاحظات إضافية')
    
    # معلومات النظام
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='مقدم الطلب')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التحديث')
    is_approved = models.BooleanField(default=False, verbose_name='تم الموافقة')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                                   related_name='approved_entities', verbose_name='تم الموافقة بواسطة')
    approval_date = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ الموافقة')
    
    class Meta:
        verbose_name = 'الجهة الحكومية'
        verbose_name_plural = 'الجهات الحكومية'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.entity_name} - {self.get_entity_type_display()}"

class CitizenFeedback(models.Model):
    """نموذج ملاحظات المواطنين"""
    FEEDBACK_TYPES = [
        ('complaint', 'شكوى'),
        ('suggestion', 'اقتراح'),
        ('inquiry', 'استفسار'),
        ('compliment', 'شكر وتقدير'),
        ('report', 'بلاغ'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'منخفض'),
        ('medium', 'متوسط'),
        ('high', 'عالي'),
        ('urgent', 'عاجل'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'قيد المراجعة'),
        ('in_progress', 'قيد المعالجة'),
        ('resolved', 'تم الحل'),
        ('closed', 'مغلق'),
    ]
    
    # معلومات المواطن
    citizen_name = models.CharField(max_length=100, verbose_name='اسم المواطن')
    citizen_phone = models.CharField(max_length=17, verbose_name='رقم الهاتف', blank=True)
    citizen_email = models.EmailField(verbose_name='البريد الإلكتروني', blank=True)
    citizen_address = models.TextField(verbose_name='العنوان', blank=True)
    citizen_id = models.CharField(max_length=20, verbose_name='رقم الهوية', blank=True)
    
    # معلومات إضافية عن المواطن
    age = models.IntegerField(verbose_name='العمر', blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('male', 'ذكر'), ('female', 'أنثى')], verbose_name='الجنس', blank=True)
    education_level = models.CharField(max_length=20, choices=[
        ('primary', 'ابتدائي'),
        ('intermediate', 'متوسط'),
        ('secondary', 'ثانوي'),
        ('diploma', 'دبلوم'),
        ('bachelor', 'بكالوريوس'),
        ('master', 'ماجستير'),
        ('phd', 'دكتوراه'),
    ], verbose_name='المستوى التعليمي', blank=True)
    occupation = models.CharField(max_length=100, verbose_name='المهنة', blank=True)
    governorate = models.CharField(max_length=50, verbose_name='المحافظة', blank=True)
    city = models.CharField(max_length=100, verbose_name='المدينة', blank=True)
    
    # معلومات الاتصال المفضل
    preferred_contact_method = models.CharField(max_length=20, choices=[
        ('email', 'البريد الإلكتروني'),
        ('phone', 'الهاتف'),
        ('sms', 'الرسائل النصية'),
        ('mail', 'البريد العادي'),
    ], verbose_name='طريقة التواصل المفضلة', blank=True)
    
    # معلومات المحاولات السابقة
    previous_attempts = models.BooleanField(default=False, verbose_name='محاولات سابقة')
    previous_attempts_description = models.TextField(verbose_name='وصف المحاولات السابقة', blank=True)
    
    # معلومات الموافقة
    consent_data_processing = models.BooleanField(default=False, verbose_name='موافقة معالجة البيانات')
    consent_contact = models.BooleanField(default=False, verbose_name='موافقة التواصل')
    
    # معلومات الملاحظة
    feedback_type = models.CharField(max_length=50, choices=FEEDBACK_TYPES, verbose_name='نوع الملاحظة')
    title = models.CharField(max_length=200, verbose_name='عنوان الملاحظة')
    description = models.TextField(verbose_name='وصف تفصيلي')
    related_entity = models.CharField(max_length=200, verbose_name='الجهة المعنية')
    
    # معلومات الأولوية والحالة
    priority = models.CharField(max_length=20, choices=PRIORITY_LEVELS, default='medium', verbose_name='الأولوية')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='الحالة')
    
    # معلومات المتابعة
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                                   verbose_name='مسند إلى')
    admin_notes = models.TextField(blank=True, verbose_name='ملاحظات الإدارة')
    resolution = models.TextField(blank=True, verbose_name='الحل المتخذ')
    
    # معلومات النظام
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التحديث')
    resolved_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ الحل')
    
    class Meta:
        verbose_name = 'ملاحظة المواطن'
        verbose_name_plural = 'ملاحظات المواطنين'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.citizen_name} - {self.title}"

class FormSubmission(models.Model):
    """نموذج لتتبع تقديم الاستمارات"""
    SUBMISSION_TYPES = [
        ('government_entity', 'جهة حكومية'),
        ('citizen_feedback', 'ملاحظة مواطن'),
    ]
    
    submission_type = models.CharField(max_length=50, choices=SUBMISSION_TYPES, verbose_name='نوع التقديم')
    reference_number = models.CharField(max_length=20, unique=True, verbose_name='الرقم المرجعي')
    submitter_name = models.CharField(max_length=100, verbose_name='اسم المقدم')
    submitter_email = models.EmailField(verbose_name='بريد المقدم')
    
    # ربط بالنماذج الأخرى
    government_entity = models.OneToOneField(GovernmentEntity, on_delete=models.CASCADE, 
                                           null=True, blank=True, verbose_name='الجهة الحكومية')
    citizen_feedback = models.OneToOneField(CitizenFeedback, on_delete=models.CASCADE, 
                                          null=True, blank=True, verbose_name='ملاحظة المواطن')
    
    # معلومات النظام
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ التقديم')
    processed_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ المعالجة')
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                                   verbose_name='تم المعالجة بواسطة')
    
    class Meta:
        verbose_name = 'تقديم استمارة'
        verbose_name_plural = 'تقديمات الاستمارات'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.reference_number} - {self.submitter_name}"
    
    def save(self, *args, **kwargs):
        if not self.reference_number:
            # إنشاء رقم مرجعي تلقائي
            import random
            import string
            self.reference_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        super().save(*args, **kwargs)
