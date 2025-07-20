# forms/serializers.py
from rest_framework import serializers
from .models import GovernmentEntity, CitizenFeedback, FormSubmission

class GovernmentEntitySerializer(serializers.ModelSerializer):
    """مسلسل الجهة الحكومية"""
    entity_type_display = serializers.CharField(source='get_entity_type_display', read_only=True)
    governorate_display = serializers.CharField(source='get_governorate_display', read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.username', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)
    
    class Meta:
        model = GovernmentEntity
        fields = '__all__'
        read_only_fields = ('submitted_by', 'created_at', 'updated_at', 'approved_by', 'approval_date')

class GovernmentEntityCreateSerializer(serializers.ModelSerializer):
    """مسلسل إنشاء الجهة الحكومية"""
    class Meta:
        model = GovernmentEntity
        exclude = ('submitted_by', 'is_approved', 'approved_by', 'approval_date')

class CitizenFeedbackSerializer(serializers.ModelSerializer):
    """مسلسل ملاحظات المواطنين"""
    feedback_type_display = serializers.CharField(source='get_feedback_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    
    class Meta:
        model = CitizenFeedback
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'resolved_at')

class CitizenFeedbackCreateSerializer(serializers.ModelSerializer):
    """مسلسل إنشاء ملاحظة المواطن"""
    
    def validate(self, data):
        """التحقق من صحة البيانات"""
        # إذا لم يكن الإرسال مجهولاً، تحقق من الحقول المطلوبة
        is_anonymous = data.get('is_anonymous', False)
        
        if not is_anonymous:
            required_fields = ['citizen_name', 'citizen_phone', 'citizen_email', 'citizen_address']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(f'{field} is required for non-anonymous submissions')
        
        return data
    
    class Meta:
        model = CitizenFeedback
        exclude = ('assigned_to', 'admin_notes', 'resolution', 'resolved_at', 'status')

class FormSubmissionSerializer(serializers.ModelSerializer):
    """مسلسل تقديم الاستمارة"""
    submission_type_display = serializers.CharField(source='get_submission_type_display', read_only=True)
    processed_by_name = serializers.CharField(source='processed_by.username', read_only=True)
    
    class Meta:
        model = FormSubmission
        fields = '__all__'
        read_only_fields = ('reference_number', 'created_at', 'processed_at', 'processed_by')

# مسلسلات للإحصائيات
class GovernmentEntityStatsSerializer(serializers.Serializer):
    """مسلسل إحصائيات الجهات الحكومية"""
    total_entities = serializers.IntegerField()
    approved_entities = serializers.IntegerField()
    pending_entities = serializers.IntegerField()
    entities_by_type = serializers.DictField()
    entities_by_governorate = serializers.DictField()
    recent_submissions = serializers.IntegerField()

class CitizenFeedbackStatsSerializer(serializers.Serializer):
    """مسلسل إحصائيات ملاحظات المواطنين"""
    total_feedback = serializers.IntegerField()
    pending_feedback = serializers.IntegerField()
    resolved_feedback = serializers.IntegerField()
    feedback_by_type = serializers.DictField()
    feedback_by_priority = serializers.DictField()
    recent_feedback = serializers.IntegerField()

class DashboardStatsSerializer(serializers.Serializer):
    """مسلسل إحصائيات لوحة التحكم"""
    government_entities = GovernmentEntityStatsSerializer()
    citizen_feedback = CitizenFeedbackStatsSerializer()
    total_submissions = serializers.IntegerField()
    active_users = serializers.IntegerField()
