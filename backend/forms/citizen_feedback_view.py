from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import CitizenFeedback
from .serializers import CitizenFeedbackCreateSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_citizen_feedback(request):
    """إنشاء ملاحظة مواطن جديدة مع دعم الإرسال المجهول"""
    
    try:
        data = request.data.copy()
        
        # التحقق من الإرسال المجهول
        is_anonymous = data.get('is_anonymous', False)
        
        if is_anonymous:
            # في الإرسال المجهول، نضع قيم افتراضية للحقول المطلوبة
            data['citizen_name'] = 'مجهول'
            data['citizen_phone'] = ''
            data['citizen_email'] = ''
            data['citizen_address'] = ''
            data['citizen_id'] = ''
        
        # إنشاء الـ serializer
        serializer = CitizenFeedbackCreateSerializer(data=data)
        
        if serializer.is_valid():
            # حفظ البيانات
            feedback = serializer.save()
            
            # إرسال الاستجابة
            response_data = {
                'id': feedback.id,
                'message': 'تم إرسال الملاحظة بنجاح',
                'is_anonymous': is_anonymous,
                'reference_number': f'CF-{feedback.id:06d}'
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Error creating citizen feedback: {str(e)}")
        return Response(
            {'error': 'حدث خطأ أثناء إنشاء الملاحظة', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
