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
        try:
            from django.db import connection
            
            with connection.cursor() as cursor:
                # إحصائيات حسب النوع
                cursor.execute("""
                    SELECT entity_type, COUNT(*) as count 
                    FROM forms_governmententity 
                    WHERE entity_type IS NOT NULL 
                    GROUP BY entity_type
                """)
                entities_by_type = dict(cursor.fetchall())
                
                # إحصائيات حسب المحافظة
                cursor.execute("""
                    SELECT governorate, COUNT(*) as count 
                    FROM forms_governmententity 
                    WHERE governorate IS NOT NULL 
                    GROUP BY governorate
                """)
                entities_by_governorate = dict(cursor.fetchall())
        except Exception:
            entities_by_type = {}
            entities_by_governorate = {}
        
        stats = {
            'total_entities': GovernmentEntity.objects.count(),
            'approved_entities': GovernmentEntity.objects.filter(is_approved=True).count(),
            'pending_entities': GovernmentEntity.objects.filter(is_approved=False).count(),
            'entities_by_type': entities_by_type,
            'entities_by_governorate': entities_by_governorate,
            'recent_submissions': GovernmentEntity.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count(),
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
    
    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)
    
    def get_queryset(self):
        queryset = CitizenFeedback.objects.all()
        
        # تصفية حسب الحالة
        status_filter = self.request.query_params.get('status', None)
        if status_filter is not None:
            queryset = queryset.filter(status=status_filter)
        
        # تصفية حسب نوع الملاحظة
        feedback_type = self.request.query_params.get('feedback_type', None)
        if feedback_type is not None:
            queryset = queryset.filter(feedback_type=feedback_type)
        
        # تصفية حسب الأولوية
        priority = self.request.query_params.get('priority', None)
        if priority is not None:
            queryset = queryset.filter(priority=priority)
        
        # تصفية حسب التقييم
        rating = self.request.query_params.get('rating', None)
        if rating is not None:
            queryset = queryset.filter(rating=rating)
        
        # البحث
        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(
                Q(citizen_name__icontains=search) |
                Q(feedback_text__icontains=search) |
                Q(related_entity__entity_name__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def resolve(self, request, pk=None):
        """تحديد الملاحظة كمحلولة"""
        feedback = self.get_object()
        feedback.status = 'resolved'
        feedback.resolved_by = request.user
        feedback.resolved_at = timezone.now()
        feedback.admin_notes = request.data.get('admin_notes', '')
        feedback.save()
        
        return Response({'status': 'resolved'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        """تحديث حالة الملاحظة"""
        feedback = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in ['pending', 'in_progress', 'resolved']:
            feedback.status = new_status
            if new_status == 'resolved':
                feedback.resolved_by = request.user
                feedback.resolved_at = timezone.now()
            feedback.admin_notes = request.data.get('admin_notes', feedback.admin_notes)
            feedback.save()
            
            return Response({'status': new_status}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """إحصائيات ملاحظات المواطنين"""
        try:
            from django.db import connection
            
            with connection.cursor() as cursor:
                # إحصائيات حسب النوع
                cursor.execute("""
                    SELECT feedback_type, COUNT(*) as count 
                    FROM forms_citizenfeedback 
                    WHERE feedback_type IS NOT NULL 
                    GROUP BY feedback_type
                """)
                feedback_by_type = dict(cursor.fetchall())
                
                # إحصائيات حسب الأولوية
                cursor.execute("""
                    SELECT priority, COUNT(*) as count 
                    FROM forms_citizenfeedback 
                    WHERE priority IS NOT NULL 
                    GROUP BY priority
                """)
                feedback_by_priority = dict(cursor.fetchall())
        except Exception:
            feedback_by_type = {}
            feedback_by_priority = {}
        
        stats = {
            'total_feedback': CitizenFeedback.objects.count(),
            'pending_feedback': CitizenFeedback.objects.filter(status='pending').count(),
            'resolved_feedback': CitizenFeedback.objects.filter(status='resolved').count(),
            'feedback_by_type': feedback_by_type,
            'feedback_by_priority': feedback_by_priority,
            'recent_feedback': CitizenFeedback.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count(),
        }
        
        return Response(stats)

class FormSubmissionViewSet(viewsets.ModelViewSet):
    """ViewSet لمراجعة الاستمارات المقدمة"""
    queryset = FormSubmission.objects.all()
    serializer_class = FormSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = FormSubmission.objects.all()
        
        # تصفية حسب نوع الاستمارة
        submission_type = self.request.query_params.get('submission_type', None)
        if submission_type is not None:
            queryset = queryset.filter(submission_type=submission_type)
        
        # تصفية حسب الحالة
        status_filter = self.request.query_params.get('status', None)
        if status_filter is not None:
            queryset = queryset.filter(status=status_filter)
        
        return queryset

@action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
def dashboard_stats(request):
    """إحصائيات شاملة للوحة الإدارة"""
    
    # إحصائيات الكيانات الحكومية
    try:
        from django.db import connection
        
        with connection.cursor() as cursor:
            # إحصائيات حسب النوع
            cursor.execute("""
                SELECT entity_type, COUNT(*) as count 
                FROM forms_governmententity 
                WHERE entity_type IS NOT NULL 
                GROUP BY entity_type
            """)
            entities_by_type = dict(cursor.fetchall())
            
            # إحصائيات حسب المحافظة
            cursor.execute("""
                SELECT governorate, COUNT(*) as count 
                FROM forms_governmententity 
                WHERE governorate IS NOT NULL 
                GROUP BY governorate
            """)
            entities_by_governorate = dict(cursor.fetchall())
        
        gov_entities_stats = {
            'total_entities': GovernmentEntity.objects.count(),
            'approved_entities': GovernmentEntity.objects.filter(is_approved=True).count(),
            'pending_entities': GovernmentEntity.objects.filter(is_approved=False).count(),
            'entities_by_type': entities_by_type,
            'entities_by_governorate': entities_by_governorate,
            'recent_submissions': GovernmentEntity.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count(),
        }
    except Exception:
        # في حالة فشل الاستعلام، استخدم قيم افتراضية
        gov_entities_stats = {
            'total_entities': GovernmentEntity.objects.count(),
            'approved_entities': GovernmentEntity.objects.filter(is_approved=True).count(),
            'pending_entities': GovernmentEntity.objects.filter(is_approved=False).count(),
            'entities_by_type': {},
            'entities_by_governorate': {},
            'recent_submissions': 0,
        }
    
    # إحصائيات ملاحظات المواطنين
    try:
        # استخدام raw SQL لتجنب مشاكل GROUP BY في SQL Server
        from django.db import connection
        
        with connection.cursor() as cursor:
            # إحصائيات حسب النوع
            cursor.execute("""
                SELECT feedback_type, COUNT(*) as count 
                FROM forms_citizenfeedback 
                WHERE feedback_type IS NOT NULL 
                GROUP BY feedback_type
            """)
            feedback_by_type = dict(cursor.fetchall())
            
            # إحصائيات حسب الأولوية
            cursor.execute("""
                SELECT priority, COUNT(*) as count 
                FROM forms_citizenfeedback 
                WHERE priority IS NOT NULL 
                GROUP BY priority
            """)
            feedback_by_priority = dict(cursor.fetchall())
        
        citizen_feedback_stats = {
            'total_feedback': CitizenFeedback.objects.count(),
            'pending_feedback': CitizenFeedback.objects.filter(status='pending').count(),
            'resolved_feedback': CitizenFeedback.objects.filter(status='resolved').count(),
            'feedback_by_type': feedback_by_type,
            'feedback_by_priority': feedback_by_priority,
            'recent_feedback': CitizenFeedback.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count(),
        }
    except Exception:
        # في حالة فشل الاستعلام، استخدم قيم افتراضية
        citizen_feedback_stats = {
            'total_feedback': CitizenFeedback.objects.count(),
            'pending_feedback': CitizenFeedback.objects.filter(status='pending').count(),
            'resolved_feedback': CitizenFeedback.objects.filter(status='resolved').count(),
            'feedback_by_type': {},
            'feedback_by_priority': {},
            'recent_feedback': 0,
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
