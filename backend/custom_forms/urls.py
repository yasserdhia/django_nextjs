# Custom Forms URLs

from django.urls import path
from . import views

urlpatterns = [
    # قائمة جميع الاستمارات
    path('', views.CustomFormListAllView.as_view(), name='custom_form_list_all'),
    
    # إنشاء وإدارة الاستمارات
    path('create/', views.CustomFormCreateView.as_view(), name='custom_form_create'),
    path('public/', views.CustomFormListView.as_view(), name='custom_form_public_list'),
    path('manage/', views.CustomFormManageView.as_view(), name='custom_form_manage'),
    path('manage/<int:pk>/', views.CustomFormUpdateView.as_view(), name='custom_form_update'),
    
    # ردود الاستمارات
    path('submit/', views.FormResponseCreateView.as_view(), name='form_response_create'),
    path('responses/<int:form_id>/', views.FormResponseListView.as_view(), name='form_responses'),
    
    # عمليات إضافية
    path('duplicate/<int:form_id>/', views.duplicate_form, name='duplicate_form'),
    path('export/<int:form_id>/<str:format_type>/', views.export_responses, name='export_responses'),
]
