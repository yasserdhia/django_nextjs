"""
إصلاح مشكلة ProgrammingError في استمارة المواطنين
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CitizenFeedbackFixed(models.Model):
    """نسخة محسنة من نموذج ملاحظات المواطنين"""
    
    FEEDBACK_TYPES = [
        ('complaint', 'شكوى'),
        ('suggestion', 'اقتراح'),
        ('inquiry', 'استفسار'),
        ('compliment', 'شكر وتقدير'),
        ('request', 'طلب'),
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
    
    GENDER_CHOICES = [
        ('male', 'ذكر'),
        ('female', 'أنثى'),
    ]
    
    EDUCATION_LEVELS = [
        ('primary', 'ابتدائي'),
        ('intermediate', 'متوسط'),
        ('secondary', 'ثانوي'),
        ('diploma', 'دبلوم'),
        ('bachelor', 'بكالوريوس'),
        ('master', 'ماجستير'),
        ('phd', 'دكتوراه'),
    ]
    
    CONTACT_METHODS = [
        ('email', 'البريد الإلكتروني'),
        ('phone', 'الهاتف'),
        ('sms', 'الرسائل النصية'),
        ('mail', 'البريد العادي'),
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
    
    # معلومات المواطن - اختيارية للإرسال المجهول
    citizen_name = models.CharField(max_length=100, default='مجهول', verbose_name='اسم المواطن')
    citizen_phone = models.CharField(max_length=17, blank=True, default='', verbose_name='رقم الهاتف')
    citizen_email = models.EmailField(blank=True, default='', verbose_name='البريد الإلكتروني')
    citizen_address = models.TextField(blank=True, default='', verbose_name='العنوان')
    citizen_id = models.CharField(max_length=20, blank=True, default='', verbose_name='رقم الهوية')
    
    # معلومات إضافية عن المواطن
    age = models.IntegerField(null=True, blank=True, verbose_name='العمر')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, verbose_name='الجنس')
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVELS, blank=True, verbose_name='المستوى التعليمي')
    occupation = models.CharField(max_length=100, blank=True, verbose_name='المهنة')
    governorate = models.CharField(max_length=50, choices=GOVERNORATES, blank=True, verbose_name='المحافظة')
    city = models.CharField(max_length=100, blank=True, verbose_name='المدينة')
    
    # معلومات الملاحظة - مطلوبة
    feedback_type = models.CharField(max_length=50, choices=FEEDBACK_TYPES, verbose_name='نوع الملاحظة')
    title = models.CharField(max_length=200, verbose_name='عنوان الملاحظة')
    description = models.TextField(verbose_name='وصف تفصيلي')
    related_entity = models.CharField(max_length=200, verbose_name='الجهة المعنية')
    priority = models.CharField(max_length=20, choices=PRIORITY_LEVELS, default='medium', verbose_name='الأولوية')
    
    # معلومات الاتصال المفضل
    preferred_contact_method = models.CharField(max_length=20, choices=CONTACT_METHODS, blank=True, verbose_name='طريقة التواصل المفضلة')
    
    # معلومات المحاولات السابقة
    previous_attempts = models.BooleanField(default=False, verbose_name='محاولات سابقة')
    previous_attempts_description = models.TextField(blank=True, verbose_name='وصف المحاولات السابقة')
    
    # معلومات الموافقة
    consent_data_processing = models.BooleanField(default=False, verbose_name='موافقة معالجة البيانات')
    consent_contact = models.BooleanField(default=False, verbose_name='موافقة التواصل')
    is_anonymous = models.BooleanField(default=False, verbose_name='إرسال مجهول')
    
    # معلومات الحالة والمتابعة
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='الحالة')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='مسند إلى')
    admin_notes = models.TextField(blank=True, verbose_name='ملاحظات الإدارة')
    resolution = models.TextField(blank=True, verbose_name='الحل المتخذ')
    
    # معلومات النظام
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التحديث')
    resolved_at = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ الحل')
    
    class Meta:
        db_table = 'forms_citizenfeedback'
        verbose_name = 'ملاحظة المواطن'
        verbose_name_plural = 'ملاحظات المواطنين'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.citizen_name} - {self.title}"
    
    def save(self, *args, **kwargs):
        # التأكد من أن الحقول المطلوبة موجودة
        if not self.citizen_name:
            self.citizen_name = 'مجهول'
        
        super().save(*args, **kwargs)
