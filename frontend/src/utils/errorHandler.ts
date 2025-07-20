// utils/errorHandler.ts
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export interface ErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  non_field_errors?: string[];
}

export const handleApiError = (error: AxiosError<ErrorResponse>) => {
  console.error('API Error:', error);
  
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        if (data.errors) {
          // Handle validation errors
          const fieldErrors = Object.entries(data.errors);
          fieldErrors.forEach(([field, messages]) => {
            messages.forEach(message => {
              toast.error(`${field}: ${message}`, {
                duration: 4000,
                icon: '⚠️',
              });
            });
          });
        } else if (data.non_field_errors) {
          data.non_field_errors.forEach(error => {
            toast.error(error, {
              duration: 4000,
              icon: '⚠️',
            });
          });
        } else {
          toast.error(data.detail || 'خطأ في البيانات المرسلة', {
            duration: 4000,
            icon: '⚠️',
          });
        }
        break;
        
      case 401:
        toast.error('انتهت صلاحية جلسة الدخول. يرجى تسجيل الدخول مرة أخرى.', {
          duration: 4000,
          icon: '🔐',
        });
        // Redirect to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        break;
        
      case 403:
        toast.error('ليس لديك صلاحية للوصول إلى هذا المورد', {
          duration: 4000,
          icon: '🚫',
        });
        break;
        
      case 404:
        toast.error('المورد المطلوب غير موجود', {
          duration: 4000,
          icon: '🔍',
        });
        break;
        
      case 500:
        toast.error('خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً', {
          duration: 4000,
          icon: '🚨',
        });
        break;
        
      default:
        toast.error(data.detail || data.message || 'حدث خطأ غير متوقع', {
          duration: 4000,
          icon: '❌',
        });
    }
  } else if (error.request) {
    // Network error
    toast.error('خطأ في الاتصال بالخادم. تحقق من اتصالك بالإنترنت', {
      duration: 4000,
      icon: '🌐',
    });
  } else {
    // Other errors
    toast.error('حدث خطأ غير متوقع', {
      duration: 4000,
      icon: '❌',
    });
  }
};

export const logError = (error: any, context?: string) => {
  console.group(`🚨 Error ${context ? `in ${context}` : ''}`);
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('Message:', error.message);
  console.error('Response:', error.response);
  console.groupEnd();
};
