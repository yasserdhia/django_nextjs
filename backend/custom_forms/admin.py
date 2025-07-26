# Custom Forms Admin

from django.contrib import admin
from .models import CustomForm, FormResponse

@admin.register(CustomForm)
class CustomFormAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_public', 'is_active', 'created_by', 'responses_count', 'created_at']
    list_filter = ['category', 'is_public', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'created_by__first_name', 'created_by__last_name']
    readonly_fields = ['created_at', 'updated_at', 'responses_count']
    ordering = ['-created_at']
    
    fieldsets = (
        ('معلومات أساسية', {
            'fields': ('title', 'description', 'category')
        }),
        ('الإعدادات', {
            'fields': ('is_public', 'is_active')
        }),
        ('بنية الاستمارة', {
            'fields': ('fields',),
            'classes': ('wide',)
        }),
        ('معلومات إضافية', {
            'fields': ('created_by', 'created_at', 'updated_at', 'responses_count'),
            'classes': ('collapse',)
        })
    )

@admin.register(FormResponse)
class FormResponseAdmin(admin.ModelAdmin):
    list_display = ['form', 'submitter_name', 'submitter_email', 'submitted_at']
    list_filter = ['form', 'submitted_at']
    search_fields = ['submitter_name', 'submitter_email', 'form__title']
    readonly_fields = ['submitted_at', 'ip_address']
    ordering = ['-submitted_at']
    
    fieldsets = (
        ('معلومات المرسل', {
            'fields': ('submitter_name', 'submitter_email')
        }),
        ('الاستمارة', {
            'fields': ('form',)
        }),
        ('بيانات الرد', {
            'fields': ('response_data',),
            'classes': ('wide',)
        }),
        ('معلومات إضافية', {
            'fields': ('submitted_at', 'ip_address'),
            'classes': ('collapse',)
        })
    )
