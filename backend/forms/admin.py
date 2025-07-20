# forms/admin.py
from django.contrib import admin
from .models import GovernmentEntity, CitizenFeedback, FormSubmission

@admin.register(GovernmentEntity)
class GovernmentEntityAdmin(admin.ModelAdmin):
    list_display = [
        'entity_name', 'entity_type', 'governorate', 'manager_name', 
        'employee_count', 'is_approved', 'created_at'
    ]
    list_filter = [
        'entity_type', 'governorate', 'is_approved', 'has_electronic_system',
        'publishes_reports', 'has_complaints_system', 'created_at'
    ]
    search_fields = [
        'entity_name', 'manager_name', 'email', 'services_provided'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('معلومات الجهة الأساسية', {
            'fields': ('entity_name', 'entity_type', 'governorate', 'address')
        }),
        ('معلومات الاتصال', {
            'fields': ('phone_number', 'email', 'website')
        }),
        ('معلومات المسؤول', {
            'fields': ('manager_name', 'manager_position', 'manager_phone', 'manager_email')
        }),
        ('معلومات إضافية', {
            'fields': ('establishment_date', 'employee_count', 'annual_budget')
        }),
        ('الخدمات', {
            'fields': ('services_provided', 'target_audience')
        }),
        ('معلومات تقنية', {
            'fields': ('has_electronic_system', 'system_description')
        }),
        ('الشفافية والجودة', {
            'fields': ('publishes_reports', 'has_complaints_system', 'has_quality_certificate', 'quality_certificate_type')
        }),
        ('المشاريع والخطط', {
            'fields': ('current_projects', 'future_plans')
        }),
        ('الشراكات', {
            'fields': ('partnerships', 'international_cooperation')
        }),
        ('التقييم', {
            'fields': ('performance_indicators', 'challenges', 'needs')
        }),
        ('ملاحظات', {
            'fields': ('additional_notes',)
        }),
        ('معلومات الموافقة', {
            'fields': ('is_approved', 'approved_by', 'approval_date')
        }),
        ('معلومات النظام', {
            'fields': ('submitted_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('submitted_by', 'approved_by')

@admin.register(CitizenFeedback)
class CitizenFeedbackAdmin(admin.ModelAdmin):
    list_display = [
        'citizen_name', 'feedback_type', 'title', 'priority', 'status', 
        'assigned_to', 'created_at'
    ]
    list_filter = [
        'feedback_type', 'priority', 'status', 'created_at'
    ]
    search_fields = [
        'citizen_name', 'citizen_email', 'title', 'description'
    ]
    readonly_fields = ['created_at', 'updated_at', 'resolved_at']
    
    fieldsets = (
        ('معلومات المواطن', {
            'fields': ('citizen_name', 'citizen_phone', 'citizen_email', 'citizen_address', 'citizen_id')
        }),
        ('معلومات الملاحظة', {
            'fields': ('feedback_type', 'title', 'description', 'related_entity')
        }),
        ('الأولوية والحالة', {
            'fields': ('priority', 'status')
        }),
        ('معلومات المتابعة', {
            'fields': ('assigned_to', 'admin_notes', 'resolution')
        }),
        ('معلومات النظام', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('related_entity', 'assigned_to')

@admin.register(FormSubmission)
class FormSubmissionAdmin(admin.ModelAdmin):
    list_display = [
        'reference_number', 'submission_type', 'submitter_name', 
        'submitter_email', 'created_at', 'processed_by'
    ]
    list_filter = [
        'submission_type', 'created_at', 'processed_at'
    ]
    search_fields = [
        'reference_number', 'submitter_name', 'submitter_email'
    ]
    readonly_fields = ['reference_number', 'created_at', 'processed_at']
    
    fieldsets = (
        ('معلومات التقديم', {
            'fields': ('reference_number', 'submission_type', 'submitter_name', 'submitter_email')
        }),
        ('المحتوى', {
            'fields': ('government_entity', 'citizen_feedback')
        }),
        ('معلومات المعالجة', {
            'fields': ('processed_by', 'processed_at')
        }),
        ('معلومات النظام', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('processed_by', 'government_entity', 'citizen_feedback')

# تخصيص عنوان Admin
admin.site.site_header = "نظام الأمانة العامة لمجلس الوزراء"
admin.site.site_title = "إدارة الاستمارات"
admin.site.index_title = "لوحة التحكم - الاستمارات الحكومية"
