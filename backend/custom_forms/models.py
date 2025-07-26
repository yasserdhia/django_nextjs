# Custom Forms Django App

# models.py
from django.db import models
from django.contrib.auth import get_user_model
import json

User = get_user_model()

class CustomForm(models.Model):
    CATEGORY_CHOICES = [
        ('general', 'عام'),
        ('feedback', 'ملاحظات واقتراحات'),
        ('complaints', 'شكاوى'),
        ('services', 'طلب خدمات'),
        ('employment', 'توظيف'),
        ('surveys', 'استطلاعات رأي'),
    ]
    
    title = models.CharField(max_length=255, verbose_name='عنوان الاستمارة')
    description = models.TextField(blank=True, verbose_name='وصف الاستمارة')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general', verbose_name='فئة الاستمارة')
    fields = models.JSONField(verbose_name='حقول الاستمارة')  # Store form structure as JSON
    is_public = models.BooleanField(default=True, verbose_name='استمارة عامة')
    is_active = models.BooleanField(default=True, verbose_name='نشطة')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='منشئ الاستمارة')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاريخ التحديث')
    
    class Meta:
        verbose_name = 'استمارة مخصصة'
        verbose_name_plural = 'استمارات مخصصة'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def responses_count(self):
        return self.responses.count()

class FormResponse(models.Model):
    form = models.ForeignKey(CustomForm, on_delete=models.CASCADE, related_name='responses', verbose_name='الاستمارة')
    response_data = models.JSONField(verbose_name='بيانات الرد')  # Store form responses as JSON
    submitter_name = models.CharField(max_length=255, verbose_name='اسم المرسل')
    submitter_email = models.EmailField(blank=True, null=True, verbose_name='بريد المرسل')
    submitted_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإرسال')
    ip_address = models.GenericIPAddressField(blank=True, null=True, verbose_name='عنوان IP')
    
    class Meta:
        verbose_name = 'رد استمارة'
        verbose_name_plural = 'ردود الاستمارات'
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f'{self.form.title} - {self.submitter_name}'
