import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { debugCitizenFeedbackData, validateCitizenFeedbackData } from '@/utils/debugCitizenFeedback';

interface CitizenFeedbackFormData {
  feedback_type: string;
  full_name: string;
  national_id: string;
  phone_number: string;
  email: string;
  governorate: string;
  city: string;
  address: string;
  age: number;
  gender: string;
  education_level: string;
  occupation: string;
  related_entity: string;
  subject: string;
  description: string;
  priority: string;
  preferred_contact_method: string;
  previous_attempts: boolean;
  previous_attempts_description?: string;
  supporting_documents?: FileList;
  is_anonymous: boolean;
  consent_data_processing: boolean;
  consent_contact: boolean;
}

const CitizenFeedbackForm: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm<CitizenFeedbackFormData>();

  const feedbackType = watch('feedback_type');
  const isAnonymous = watch('is_anonymous');
  const previousAttempts = watch('previous_attempts');

  useEffect(() => {
    setIsLoaded(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const onSubmit = async (data: CitizenFeedbackFormData) => {
    try {
      console.log('🔍 بدء تشخيص بيانات استمارة المواطنين...');
      debugCitizenFeedbackData(data);
      
      // التحقق من صحة البيانات
      const validationErrors = validateCitizenFeedbackData(data);
      if (validationErrors.length > 0) {
        console.error('❌ أخطاء في البيانات:', validationErrors);
        toast.error(`خطأ في البيانات: ${validationErrors.join(', ')}`, {
          duration: 6000,
          icon: '⚠️',
        });
        return;
      }
      
      // التحقق من وجود التوكن
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('❌ لا يوجد توكن مصادقة');
        toast.error('يرجى تسجيل الدخول مرة أخرى', {
          duration: 4000,
          icon: '🔐',
        });
        router.push('/login');
        return;
      }
      
      console.log('✅ البيانات صحيحة، جاري معالجة البيانات...');
      
      // إذا كان المستخدم يريد الإرسال بشكل مجهول، نحذف المعلومات الشخصية
      if (data.is_anonymous) {
        console.log('🎭 الإرسال المجهول مفعل، حذف المعلومات الشخصية...');
        // لا نرسل المعلومات الشخصية في الإرسال المجهول
        data.full_name = 'مجهول';
        data.national_id = '';
        data.phone_number = '';
        data.email = '';
        data.address = '';
      }

      const formData = new FormData();
      
      // إضافة البيانات النصية
      console.log('📝 إضافة البيانات النصية...');
      
      // تحويل أسماء الحقول لتتطابق مع Django model
      const fieldMapping = {
        'full_name': 'citizen_name',
        'phone_number': 'citizen_phone',
        'email': 'citizen_email',
        'address': 'citizen_address',
        'national_id': 'citizen_id',
        'subject': 'title',
        'related_entity': 'related_entity',
        'feedback_type': 'feedback_type',
        'description': 'description',
        'priority': 'priority',
        'governorate': 'governorate',
        'city': 'city',
        'age': 'age',
        'gender': 'gender',
        'education_level': 'education_level',
        'occupation': 'occupation',
        'preferred_contact_method': 'preferred_contact_method',
        'previous_attempts': 'previous_attempts',
        'previous_attempts_description': 'previous_attempts_description',
        'consent_data_processing': 'consent_data_processing',
        'consent_contact': 'consent_contact',
        'is_anonymous': 'is_anonymous',
      };
      
      Object.keys(data).forEach(key => {
        if (key !== 'supporting_documents' && data[key as keyof CitizenFeedbackFormData] !== undefined) {
          const value = data[key as keyof CitizenFeedbackFormData];
          
          // تخطي الحقول الفارغة للإرسال المجهول
          if (data.is_anonymous && ['full_name', 'national_id', 'phone_number', 'email', 'address'].includes(key)) {
            const djangoFieldName = fieldMapping[key as keyof typeof fieldMapping] || key;
            if (key === 'full_name') {
              formData.append(djangoFieldName, 'مجهول');
            } else {
              formData.append(djangoFieldName, '');
            }
            console.log(`🎭 أضيف ${djangoFieldName} (${key}) للإرسال المجهول:`, key === 'full_name' ? 'مجهول' : '');
          } else if (value !== null && value !== '' && value !== undefined) {
            // استخدام اسم الحقل المناسب لـ Django
            const djangoFieldName = fieldMapping[key as keyof typeof fieldMapping] || key;
            formData.append(djangoFieldName, value as string);
            console.log(`✅ أضيف ${djangoFieldName} (${key}):`, value);
          }
        }
      });

      // إضافة الملفات إذا كانت موجودة
      if (data.supporting_documents && data.supporting_documents.length > 0) {
        console.log('📎 إضافة الملفات المرفقة...');
        for (let i = 0; i < data.supporting_documents.length; i++) {
          formData.append('supporting_documents', data.supporting_documents[i]);
          console.log(`✅ أضيف ملف ${i + 1}:`, data.supporting_documents[i].name);
        }
      }

      console.log('📤 إرسال البيانات إلى الخادم...');
      
      await apiClient.post('/api/forms/citizen-feedback/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('✅ تم الإرسال بنجاح!');
      
      toast.success('تم إرسال الاقتراح/الشكوى بنجاح! 🎉', {
        duration: 4000,
        icon: '✅',
      });
      
      reset();
      setCurrentStep(1);
      
      // إعادة توجيه لصفحة النتائج
      setTimeout(() => {
        router.push('/forms/success');
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ خطأ في إرسال استمارة المواطنين:', error);
      
      // تسجيل تفاصيل الخطأ
      if (error.response) {
        console.error('📋 تفاصيل الخطأ:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        });
        
        // طباعة البيانات الخام للخطأ
        console.error('📋 البيانات الخام للخطأ:', error.response.data);
        
        // محاولة تحليل الخطأ
        try {
          const errorData = error.response.data;
          console.error('🔍 تحليل الخطأ:', JSON.stringify(errorData, null, 2));
        } catch (parseError) {
          console.error('❌ لا يمكن تحليل بيانات الخطأ:', parseError);
        }
      }
      
      if (error.response?.status === 401) {
        toast.error('انتهت صلاحية جلسة الدخول. يرجى تسجيل الدخول مرة أخرى.', {
          duration: 4000,
          icon: '🔐',
        });
        router.push('/login');
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        console.error('🔍 تفاصيل خطأ 400:', errorData);
        
        if (errorData && typeof errorData === 'object') {
          // عرض أخطاء محددة من الخادم
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              }
              return `${field}: ${messages}`;
            })
            .join('\n');
          
          console.error('📋 رسائل الخطأ المفصلة:', errorMessages);
          
          toast.error(`خطأ في البيانات:\n${errorMessages}`, {
            duration: 8000,
            icon: '⚠️',
          });
        } else {
          toast.error('البيانات المرسلة غير صحيحة. يرجى مراجعة الحقول والمحاولة مرة أخرى.', {
            duration: 4000,
            icon: '⚠️',
          });
        }
      } else {
        toast.error('حدث خطأ أثناء إرسال الاقتراح/الشكوى. يرجى المحاولة مرة أخرى.', {
          duration: 4000,
          icon: '❌',
        });
      }
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري التحقق من صلاحية الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300 dark:bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-300 dark:bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center animate-bounce-in">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              استمارة الاقتراحات والشكاوى
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              الأمانة العامة لمجلس الوزراء - جمهورية العراق
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              صوتك مهم! شاركنا اقتراحاتك وشكاواك لتحسين الخدمات الحكومية
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">الخطوة {currentStep} من {totalSteps}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(getProgressPercentage())}% مكتمل</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <div className="glass rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: نوع الاقتراح/الشكوى */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">نوع الاقتراح/الشكوى</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نوع الرسالة *
                      </label>
                      <select
                        {...register('feedback_type', { required: 'نوع الرسالة مطلوب' })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                      >
                        <option value="">اختر نوع الرسالة</option>
                        <option value="complaint">شكوى</option>
                        <option value="suggestion">اقتراح</option>
                        <option value="inquiry">استفسار</option>
                        <option value="compliment">إطراء</option>
                        <option value="request">طلب</option>
                      </select>
                      {errors.feedback_type && <p className="text-red-500 text-sm mt-1">{errors.feedback_type.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الأولوية *
                      </label>
                      <select
                        {...register('priority', { required: 'الأولوية مطلوبة' })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                      >
                        <option value="">اختر الأولوية</option>
                        <option value="low">منخفضة</option>
                        <option value="medium">متوسطة</option>
                        <option value="high">عالية</option>
                        <option value="urgent">عاجلة</option>
                      </select>
                      {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الجهة المعنية *
                      </label>
                      <input
                        {...register('related_entity', { required: 'الجهة المعنية مطلوبة' })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اسم الجهة الحكومية المعنية"
                      />
                      {errors.related_entity && <p className="text-red-500 text-sm mt-1">{errors.related_entity.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الموضوع *
                      </label>
                      <input
                        {...register('subject', { required: 'الموضوع مطلوب' })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="موضوع الاقتراح/الشكوى باختصار"
                      />
                      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        التفاصيل *
                      </label>
                      <textarea
                        {...register('description', { required: 'التفاصيل مطلوبة' })}
                        rows={5}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اكتب التفاصيل الكاملة للاقتراح/الشكوى..."
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>
                  </div>

                  {/* Anonymous Option */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <input
                        {...register('is_anonymous')}
                        type="checkbox"
                        id="is_anonymous"
                        className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="is_anonymous" className="text-sm font-medium text-gray-900 dark:text-gray-300">
                        أرغب في الإرسال بشكل مجهول (لن يتم عرض أو حفظ معلوماتي الشخصية)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: المعلومات الشخصية */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    المعلومات الشخصية
                    {isAnonymous && <span className="text-orange-600 dark:text-orange-400 text-lg"> (مجهول)</span>}
                  </h2>
                  
                  {isAnonymous ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">إرسال مجهول</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        اخترت الإرسال بشكل مجهول. لن يتم طلب معلوماتك الشخصية.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          الاسم الكامل *
                        </label>
                        <input
                          {...register('full_name', { required: !isAnonymous ? 'الاسم الكامل مطلوب' : false })}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="الاسم الكامل"
                        />
                        {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          رقم الهوية
                        </label>
                        <input
                          {...register('national_id')}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="رقم الهوية/البطاقة الوطنية"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          رقم الهاتف *
                        </label>
                        <input
                          {...register('phone_number', { 
                            required: !isAnonymous ? 'رقم الهاتف مطلوب' : false,
                            pattern: {
                              value: /^[0-9+\-\s()]+$/,
                              message: 'رقم الهاتف غير صحيح'
                            }
                          })}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="07XXXXXXXXX"
                        />
                        {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          البريد الإلكتروني *
                        </label>
                        <input
                          {...register('email', { 
                            required: !isAnonymous ? 'البريد الإلكتروني مطلوب' : false,
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'البريد الإلكتروني غير صحيح'
                            }
                          })}
                          type="email"
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="example@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          المحافظة *
                        </label>
                        <select
                          {...register('governorate', { required: !isAnonymous ? 'المحافظة مطلوبة' : false })}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                        >
                          <option value="">اختر المحافظة</option>
                          <option value="baghdad">بغداد</option>
                          <option value="basra">البصرة</option>
                          <option value="nineveh">نينوى</option>
                          <option value="erbil">أربيل</option>
                          <option value="najaf">النجف</option>
                          <option value="karbala">كربلاء</option>
                          <option value="wasit">واسط</option>
                          <option value="maysan">ميسان</option>
                          <option value="babylon">بابل</option>
                          <option value="dhi_qar">ذي قار</option>
                          <option value="anbar">الأنبار</option>
                          <option value="diyala">ديالى</option>
                          <option value="kirkuk">كركوك</option>
                          <option value="salah_al_din">صلاح الدين</option>
                          <option value="sulaymaniyah">السليمانية</option>
                          <option value="duhok">دهوك</option>
                          <option value="muthanna">المثنى</option>
                          <option value="qadisiyyah">القادسية</option>
                        </select>
                        {errors.governorate && <p className="text-red-500 text-sm mt-1">{errors.governorate.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          المدينة *
                        </label>
                        <input
                          {...register('city', { required: !isAnonymous ? 'المدينة مطلوبة' : false })}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="المدينة"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          العنوان التفصيلي *
                        </label>
                        <textarea
                          {...register('address', { required: !isAnonymous ? 'العنوان مطلوب' : false })}
                          rows={3}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="العنوان التفصيلي"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          العمر *
                        </label>
                        <input
                          {...register('age', { 
                            required: !isAnonymous ? 'العمر مطلوب' : false,
                            min: { value: 18, message: 'العمر يجب أن يكون 18 سنة على الأقل' },
                            max: { value: 100, message: 'العمر يجب أن يكون أقل من 100 سنة' }
                          })}
                          type="number"
                          min="18"
                          max="100"
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="العمر"
                        />
                        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          الجنس *
                        </label>
                        <select
                          {...register('gender', { required: !isAnonymous ? 'الجنس مطلوب' : false })}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                        >
                          <option value="">اختر الجنس</option>
                          <option value="male">ذكر</option>
                          <option value="female">أنثى</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          المستوى التعليمي *
                        </label>
                        <select
                          {...register('education_level', { required: !isAnonymous ? 'المستوى التعليمي مطلوب' : false })}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                        >
                          <option value="">اختر المستوى التعليمي</option>
                          <option value="primary">ابتدائي</option>
                          <option value="intermediate">متوسط</option>
                          <option value="secondary">ثانوي</option>
                          <option value="diploma">دبلوم</option>
                          <option value="bachelor">بكالوريوس</option>
                          <option value="master">ماجستير</option>
                          <option value="phd">دكتوراه</option>
                        </select>
                        {errors.education_level && <p className="text-red-500 text-sm mt-1">{errors.education_level.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          المهنة *
                        </label>
                        <input
                          {...register('occupation', { required: !isAnonymous ? 'المهنة مطلوبة' : false })}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="المهنة"
                        />
                        {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation.message}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: معلومات إضافية */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">معلومات إضافية</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          طريقة التواصل المفضلة
                        </label>
                        <select
                          {...register('preferred_contact_method')}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                        >
                          <option value="">اختر طريقة التواصل</option>
                          <option value="email">البريد الإلكتروني</option>
                          <option value="phone">الهاتف</option>
                          <option value="sms">الرسائل النصية</option>
                          <option value="mail">البريد العادي</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          المرفقات
                        </label>
                        <input
                          {...register('supporting_documents')}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          يمكن إرفاق ملفات بصيغة PDF, DOC, JPG, PNG (حد أقصى 10MB)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <input
                        {...register('previous_attempts')}
                        type="checkbox"
                        id="previous_attempts"
                        className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="previous_attempts" className="text-sm font-medium text-gray-900 dark:text-gray-300">
                        سبق لي التقدم بنفس الموضوع
                      </label>
                    </div>

                    {previousAttempts && (
                      <div className="animate-fade-in">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          تفاصيل المحاولات السابقة
                        </label>
                        <textarea
                          {...register('previous_attempts_description')}
                          rows={3}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="اذكر تفاصيل المحاولات السابقة والنتائج"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: الموافقات والإرسال */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">الموافقات والإرسال</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        سياسة الخصوصية
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
                        نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقًا لقوانين حماية البيانات المعمول بها في جمهورية العراق.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                          <input
                            {...register('consent_data_processing', { required: 'موافقة معالجة البيانات مطلوبة' })}
                            type="checkbox"
                            id="consent_data_processing"
                            className="w-5 h-5 mt-1 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="consent_data_processing" className="text-sm text-gray-900 dark:text-gray-300">
                            أوافق على معالجة بياناتي الشخصية لأغراض النظر في الاقتراح/الشكوى والرد عليها *
                          </label>
                        </div>
                        {errors.consent_data_processing && <p className="text-red-500 text-sm mt-1">{errors.consent_data_processing.message}</p>}

                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                          <input
                            {...register('consent_contact')}
                            type="checkbox"
                            id="consent_contact"
                            className="w-5 h-5 mt-1 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="consent_contact" className="text-sm text-gray-900 dark:text-gray-300">
                            أوافق على التواصل معي بخصوص هذا الاقتراح/الشكوى
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        ملاحظات مهمة
                      </h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• سيتم مراجعة الاقتراح/الشكوى خلال 5-7 أيام عمل</li>
                        <li>• سيتم إشعارك بالتطورات عبر البريد الإلكتروني</li>
                        <li>• يمكنك تتبع حالة الاقتراح/الشكوى من خلال لوحة التحكم</li>
                        <li>• المعلومات المقدمة ستبقى سرية وآمنة</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  السابق
                </button>
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الاقتراح/الشكوى'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenFeedbackForm;
