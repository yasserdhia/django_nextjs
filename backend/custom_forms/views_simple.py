# Custom Forms Views - Simple Version

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
import json

from .models import CustomForm, FormResponse
from .serializers import (
    CustomFormSerializer, CustomFormCreateSerializer,
    FormResponseSerializer, FormResponseCreateSerializer
)

class CustomFormCreateView(generics.CreateAPIView):
    """إنشاء استمارة مخصصة جديدة"""
    serializer_class = CustomFormCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class CustomFormListView(generics.ListAPIView):
    """قائمة الاستمارات العامة"""
    serializer_class = CustomFormSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return CustomForm.objects.filter(is_public=True, is_active=True)

class CustomFormManageView(generics.ListAPIView):
    """إدارة الاستمارات للمستخدم الحالي"""
    serializer_class = CustomFormSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CustomForm.objects.filter(created_by=self.request.user)

class CustomFormUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """تحديث أو حذف استمارة مخصصة"""
    serializer_class = CustomFormSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CustomForm.objects.filter(created_by=self.request.user)

class FormResponseCreateView(generics.CreateAPIView):
    """إرسال رد على استمارة"""
    serializer_class = FormResponseCreateSerializer
    permission_classes = [AllowAny]

class FormResponseListView(generics.ListAPIView):
    """عرض ردود استمارة معينة"""
    serializer_class = FormResponseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        form_id = self.kwargs['form_id']
        form = get_object_or_404(CustomForm, id=form_id, created_by=self.request.user)
        return FormResponse.objects.filter(form=form)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def duplicate_form(request, form_id):
    """نسخ استمارة موجودة"""
    try:
        original_form = CustomForm.objects.get(id=form_id, created_by=request.user)
        new_form = CustomForm.objects.create(
            title=f"{original_form.title} (نسخة)",
            description=original_form.description,
            category=original_form.category,
            fields=original_form.fields,
            is_public=original_form.is_public,
            is_active=False,
            created_by=request.user
        )
        serializer = CustomFormSerializer(new_form)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except CustomForm.DoesNotExist:
        return Response({'error': 'الاستمارة غير موجودة'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_responses(request, form_id, format_type):
    """تصدير ردود الاستمارة - JSON فقط"""
    try:
        form = CustomForm.objects.get(id=form_id, created_by=request.user)
        responses = FormResponse.objects.filter(form=form).order_by('-submitted_at')
        
        data = {
            'form_title': form.title,
            'responses': [{
                'submitter_name': r.submitter_name,
                'submitter_email': r.submitter_email,
                'submitted_at': r.submitted_at.isoformat(),
                'response_data': r.response_data
            } for r in responses]
        }
        
        response_obj = HttpResponse(
            json.dumps(data, ensure_ascii=False, indent=2),
            content_type='application/json'
        )
        response_obj['Content-Disposition'] = f'attachment; filename="form_responses_{form.id}.json"'
        return response_obj
    except CustomForm.DoesNotExist:
        return Response({'error': 'الاستمارة غير موجودة'}, status=status.HTTP_404_NOT_FOUND)
