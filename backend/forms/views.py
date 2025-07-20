# forms/views.py
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import GovernmentEntity, CitizenFeedback, FormSubmission
from .serializers import (
    GovernmentEntitySerializer, GovernmentEntityCreateSerializer,
    CitizenFeedbackSerializer, CitizenFeedbackCreateSerializer,
    FormSubmissionSerializer, DashboardStatsSerializer
)
from accounts.models import User

class GovernmentEntityViewSet(viewsets.ModelViewSet):
    """ViewSet للجهات الحكومية"""
    queryset = GovernmentEntity.objects.all()
    serializer_class = GovernmentEntitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return GovernmentEntityCreateSerializer
        return GovernmentEntitySerializer
    
    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)
    
    def get_queryset(self):
        queryset = GovernmentEntity.objects.all()
        
        # تصفية حسب الموافقة
        is_approved = self.request.query_params.get('is_approved', None)
        if is_approved is not None:
            queryset = queryset.filter(is_approved=is_approved.lower() == 'true')
        
        # تصفية حسب نوع الجهة
        entity_type = self.request.query_params.get('entity_type', None)
        if entity_type is not None:
            queryset = queryset.filter(entity_type=entity_type)
        
        # تصفية حسب المحافظة
        governorate = self.request.query_params.get('governorate', None)
        if governorate is not None:
            queryset = queryset.filter(governorate=governorate)
        
        # البحث
        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(
                Q(entity_name__icontains=search) |
                Q(services_provided__icontains=search) |
                Q(manager_name__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        """موافقة على الجهة الحكومية"""
        entity = self.get_object()
        entity.is_approved = True
        entity.approved_by = request.user
        entity.approval_date = timezone.now()
        entity.save()
        
        return Response({'status': 'approved'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        """رفض الجهة الحكومية"""
        entity = self.get_object()
        entity.is_approved = False
        entity.approved_by = None
        entity.approval_date = None
        entity.save()
        
        return Response({'status': 'rejected'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """إحصائيات الجهات الحكومية"""
        total_entities = GovernmentEntity.objects.count()
        approved_entities = GovernmentEntity.objects.filter(is_approved=True).count()
        pending_entities = GovernmentEntity.objects.filter(is_approved=False).count()
        
        # إحصائيات حسب النوع
        entities_by_type = dict(
            GovernmentEntity.objects.values('entity_type')
            .annotate(count=Count('id'))
            .values_list('entity_type', 'count')
        )
        
        # إحصائيات حسب المحافظة
        entities_by_governorate = dict(
            GovernmentEntity.objects.values('governorate')
            .annotate(count=Count('id'))
            .values_list('governorate', 'count')
        )
        
        # التقديمات الأخيرة (آخر 30 يوم)
        last_month = timezone.now() - timedelta(days=30)
        recent_submissions = GovernmentEntity.objects.filter(
            created_at__gte=last_month
        ).count()
        
        stats = {
            'total_entities': total_entities,
            'approved_entities': approved_entities,
            'pending_entities': pending_entities,
            'entities_by_type': entities_by_type,
            'entities_by_governorate': entities_by_governorate,
            'recent_submissions': recent_submissions,
        }
        
        return Response(stats)

class CitizenFeedbackViewSet(viewsets.ModelViewSet):
    """ViewSet لملاحظات المواطنين"""
    queryset = CitizenFeedback.objects.all()
    serializer_class = CitizenFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CitizenFeedbackCreateSerializer
        return CitizenFeedbackSerializer
    
    def get_queryset(self):
        queryset = CitizenFeedback.objects.all()
        
        # تصفية حسب النوع
        feedback_type = self.request.query_params.get('feedback_type', None)
        if feedback_type is not None:
            queryset = queryset.filter(feedback_type=feedback_type)
        
        # تصفية حسب الحالة
        status_filter = self.request.query_params.get('status', None)
        if status_filter is not None:
            queryset = queryset.filter(status=status_filter)
        
        # تصفية حسب الأولوية
        priority = self.request.query_params.get('priority', None)
        if priority is not None:
            queryset = queryset.filter(priority=priority)
        
        # البحث
        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(
                Q(citizen_name__icontains=search) |
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def assign(self, request, pk=None):
        """إسناد الملاحظة لمستخدم"""
        feedback = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(id=user_id)
            feedback.assigned_to = user
            feedback.status = 'in_progress'
            feedback.save()
            
            return Response({'status': 'assigned'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def resolve(self, request, pk=None):
        """حل الملاحظة"""
        feedback = self.get_object()
        resolution = request.data.get('resolution')
        
        feedback.status = 'resolved'
        feedback.resolution = resolution
        feedback.resolved_at = timezone.now()
        feedback.save()
        
        return Response({'status': 'resolved'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def add_note(self, request, pk=None):
        """إضافة ملاحظة إدارية"""
        feedback = self.get_object()
        note = request.data.get('note')
        
        current_notes = feedback.admin_notes or ''
        new_note = f"[{timezone.now().strftime('%Y-%m-%d %H:%M')}] {request.user.username}: {note}"
        
        if current_notes:
            feedback.admin_notes = f"{current_notes}\n{new_note}"
        else:
            feedback.admin_notes = new_note
        
        feedback.save()
        
        return Response({'status': 'note_added'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """إحصائيات ملاحظات المواطنين"""
        total_feedback = CitizenFeedback.objects.count()
        pending_feedback = CitizenFeedback.objects.filter(status='pending').count()
        resolved_feedback = CitizenFeedback.objects.filter(status='resolved').count()
        
        # إحصائيات حسب النوع
        feedback_by_type = dict(
            CitizenFeedback.objects.values('feedback_type')
            .annotate(count=Count('id'))
            .values_list('feedback_type', 'count')
        )
        
        # إحصائيات حسب الأولوية
        feedback_by_priority = dict(
            CitizenFeedback.objects.values('priority')
            .annotate(count=Count('id'))
            .values_list('priority', 'count')
        )
        
        # الملاحظات الأخيرة (آخر 30 يوم)
        last_month = timezone.now() - timedelta(days=30)
        recent_feedback = CitizenFeedback.objects.filter(
            created_at__gte=last_month
        ).count()
        
        stats = {
            'total_feedback': total_feedback,
            'pending_feedback': pending_feedback,
            'resolved_feedback': resolved_feedback,
            'feedback_by_type': feedback_by_type,
            'feedback_by_priority': feedback_by_priority,
            'recent_feedback': recent_feedback,
        }
        
        return Response(stats)

class FormSubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet لتقديمات الاستمارات"""
    queryset = FormSubmission.objects.all()
    serializer_class = FormSubmissionSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = FormSubmission.objects.all()
        
        # تصفية حسب النوع
        submission_type = self.request.query_params.get('submission_type', None)
        if submission_type is not None:
            queryset = queryset.filter(submission_type=submission_type)
        
        # البحث
        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(
                Q(reference_number__icontains=search) |
                Q(submitter_name__icontains=search) |
                Q(submitter_email__icontains=search)
            )
        
        return queryset

class DashboardViewSet(viewsets.ViewSet):
    """ViewSet للوحة التحكم"""
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """إحصائيات عامة للوحة التحكم"""
        # إحصائيات الجهات الحكومية
        gov_entities_stats = {
            'total_entities': GovernmentEntity.objects.count(),
            'approved_entities': GovernmentEntity.objects.filter(is_approved=True).count(),
            'pending_entities': GovernmentEntity.objects.filter(is_approved=False).count(),
            'entities_by_type': dict(
                GovernmentEntity.objects.values('entity_type')
                .annotate(count=Count('id'))
                .values_list('entity_type', 'count')
            ),
            'entities_by_governorate': dict(
                GovernmentEntity.objects.values('governorate')
                .annotate(count=Count('id'))
                .values_list('governorate', 'count')
            ),
            'recent_submissions': GovernmentEntity.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count(),
        }
        
        # إحصائيات ملاحظات المواطنين
        citizen_feedback_stats = {
            'total_feedback': CitizenFeedback.objects.count(),
            'pending_feedback': CitizenFeedback.objects.filter(status='pending').count(),
            'resolved_feedback': CitizenFeedback.objects.filter(status='resolved').count(),
            'feedback_by_type': dict(
                CitizenFeedback.objects.values('feedback_type')
                .annotate(count=Count('id'))
                .values_list('feedback_type', 'count')
            ),
            'feedback_by_priority': dict(
                CitizenFeedback.objects.values('priority')
                .annotate(count=Count('id'))
                .values_list('priority', 'count')
            ),
            'recent_feedback': CitizenFeedback.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count(),
        }
        
        # إحصائيات عامة
        total_submissions = FormSubmission.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        
        stats = {
            'government_entities': gov_entities_stats,
            'citizen_feedback': citizen_feedback_stats,
            'total_submissions': total_submissions,
            'active_users': active_users,
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)
