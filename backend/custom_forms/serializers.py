# Custom Forms Serializers

from rest_framework import serializers
from .models import CustomForm, FormResponse
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']

class CustomFormSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    responses_count = serializers.ReadOnlyField()
    
    class Meta:
        model = CustomForm
        fields = [
            'id', 'title', 'description', 'category', 'fields', 
            'is_public', 'is_active', 'created_by', 'created_at', 
            'updated_at', 'responses_count'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

class CustomFormCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomForm
        fields = [
            'title', 'description', 'category', 'fields', 
            'is_public', 'is_active'
        ]

class FormResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormResponse
        fields = [
            'id', 'form', 'response_data', 'submitter_name', 
            'submitter_email', 'submitted_at', 'ip_address'
        ]
        read_only_fields = ['submitted_at', 'ip_address']

class FormResponseCreateSerializer(serializers.ModelSerializer):
    form_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = FormResponse
        fields = [
            'form_id', 'response_data', 'submitter_name', 'submitter_email'
        ]
    
    def create(self, validated_data):
        form_id = validated_data.pop('form_id')
        try:
            form = CustomForm.objects.get(id=form_id)
            validated_data['form'] = form
        except CustomForm.DoesNotExist:
            raise serializers.ValidationError('الاستمارة غير موجودة')
        
        # Get IP address from request
        request = self.context.get('request')
        if request:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                validated_data['ip_address'] = x_forwarded_for.split(',')[0]
            else:
                validated_data['ip_address'] = request.META.get('REMOTE_ADDR')
        
        return super().create(validated_data)
