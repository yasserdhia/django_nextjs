import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { debugFormData, validateFormData } from '@/utils/debugForm';

interface GovernmentEntityFormData {
  entity_name: string;
  entity_type: string;
  governorate: string;
  address: string;
  phone_number: string;
  email: string;
  website?: string;
  manager_name: string;
  manager_position: string;
  manager_phone: string;
  manager_email: string;
  establishment_date: string;
  employee_count: number;
  annual_budget: number;
  services_provided: string;
  target_audience: string;
  has_electronic_system: boolean;
  system_description?: string;
  publishes_reports: boolean;
  has_complaints_system: boolean;
  has_quality_certificate: boolean;
  quality_certificate_type?: string;
  current_projects: string;
  future_plans: string;
  partnerships?: string;
  international_cooperation?: string;
  performance_indicators: string;
  challenges: string;
  needs: string;
  additional_notes?: string;
}

const GovernmentEntityForm: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm<GovernmentEntityFormData>();

  const hasElectronicSystem = watch('has_electronic_system');
  const hasQualityCertificate = watch('has_quality_certificate');

  useEffect(() => {
    setIsLoaded(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const onSubmit = async (data: GovernmentEntityFormData) => {
    try {
      // تشخيص البيانات قبل الإرسال
      console.log('🔍 بدء تشخيص البيانات...');
      debugFormData(data);
      
      // التحقق من صحة البيانات
      const validationErrors = validateFormData(data);
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
      
      console.log('✅ البيانات صحيحة، جاري الإرسال...');
      
      // تحويل البيانات إلى الشكل المطلوب
      const formData = {
        ...data,
        employee_count: Number(data.employee_count),
        annual_budget: Number(data.annual_budget),
        has_electronic_system: Boolean(data.has_electronic_system),
        publishes_reports: Boolean(data.publishes_reports),
        has_complaints_system: Boolean(data.has_complaints_system),
        has_quality_certificate: Boolean(data.has_quality_certificate),
        // تصحيح الموقع الإلكتروني
        website: data.website && data.website.trim() ? 
          (data.website.startsWith('http') ? data.website : `https://${data.website}`) : 
          null,
      };
      
      console.log('📤 البيانات المُرسلة:', formData);
      
      await apiClient.post('/api/forms/government-entities/', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      toast.success('تم تقديم الاستمارة بنجاح! 🎉', {
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
      console.error('❌ خطأ في تقديم الاستمارة:', error);
      
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
      } else if (error.response?.status === 500) {
        toast.error('خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.', {
          duration: 4000,
          icon: '🔧',
        });
      } else {
        toast.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.', {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 dark:bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
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
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center animate-bounce-in">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              استمارة الجهات الحكومية
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              الأمانة العامة لمجلس الوزراء - جمهورية العراق
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              يرجى ملء جميع المعلومات المطلوبة بدقة لضمان معالجة الطلب بشكل صحيح
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
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <div className="glass rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: معلومات أساسية */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">المعلومات الأساسية</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        اسم الجهة *
                      </label>
                      <input
                        {...register('entity_name', { required: 'اسم الجهة مطلوب' })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اسم الجهة الحكومية"
                      />
                      {errors.entity_name && <p className="text-red-500 text-sm mt-1">{errors.entity_name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نوع الجهة *
                      </label>
                      <select
                        {...register('entity_type', { required: 'نوع الجهة مطلوب' })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                      >
                        <option value="">اختر نوع الجهة</option>
                        <option value="ministry">وزارة</option>
                        <option value="authority">هيئة</option>
                        <option value="commission">لجنة</option>
                        <option value="department">دائرة</option>
                        <option value="directorate">مديرية</option>
                        <option value="municipality">بلدية</option>
                        <option value="governorate">محافظة</option>
                        <option value="other">أخرى</option>
                      </select>
                      {errors.entity_type && <p className="text-red-500 text-sm mt-1">{errors.entity_type.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        المحافظة *
                      </label>
                      <select
                        {...register('governorate', { required: 'المحافظة مطلوبة' })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
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
                        تاريخ التأسيس *
                      </label>
                      <input
                        {...register('establishment_date', { required: 'تاريخ التأسيس مطلوب' })}
                        type="date"
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                      />
                      {errors.establishment_date && <p className="text-red-500 text-sm mt-1">{errors.establishment_date.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العنوان التفصيلي *
                    </label>
                    <textarea
                      {...register('address', { required: 'العنوان مطلوب' })}
                      rows={3}
                      className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                      placeholder="العنوان الكامل للجهة"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: معلومات الاتصال */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">معلومات الاتصال</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        رقم الهاتف *
                      </label>
                      <input
                        {...register('phone_number', { 
                          required: 'رقم الهاتف مطلوب',
                          pattern: {
                            value: /^[0-9+\-\s()]+$/,
                            message: 'رقم الهاتف غير صحيح'
                          }
                        })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
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
                          required: 'البريد الإلكتروني مطلوب',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'البريد الإلكتروني غير صحيح'
                          }
                        })}
                        type="email"
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="example@gov.iq"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الموقع الإلكتروني
                      </label>
                      <input
                        {...register('website', {
                          pattern: {
                            value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                            message: 'يرجى إدخال موقع إلكتروني صحيح (مثل: https://example.com)'
                          }
                        })}
                        type="url"
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="https://www.example.gov.iq"
                      />
                      {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: معلومات المسؤول */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">معلومات المسؤول</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        اسم المسؤول *
                      </label>
                      <input
                        {...register('manager_name', { required: 'اسم المسؤول مطلوب' })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="الاسم الكامل للمسؤول"
                      />
                      {errors.manager_name && <p className="text-red-500 text-sm mt-1">{errors.manager_name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        منصب المسؤول *
                      </label>
                      <input
                        {...register('manager_position', { required: 'منصب المسؤول مطلوب' })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="المنصب الحالي"
                      />
                      {errors.manager_position && <p className="text-red-500 text-sm mt-1">{errors.manager_position.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        هاتف المسؤول *
                      </label>
                      <input
                        {...register('manager_phone', { 
                          required: 'هاتف المسؤول مطلوب',
                          pattern: {
                            value: /^[0-9+\-\s()]+$/,
                            message: 'رقم الهاتف غير صحيح'
                          }
                        })}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="07XXXXXXXXX"
                      />
                      {errors.manager_phone && <p className="text-red-500 text-sm mt-1">{errors.manager_phone.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        بريد المسؤول *
                      </label>
                      <input
                        {...register('manager_email', { 
                          required: 'بريد المسؤول مطلوب',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'البريد الإلكتروني غير صحيح'
                          }
                        })}
                        type="email"
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="manager@gov.iq"
                      />
                      {errors.manager_email && <p className="text-red-500 text-sm mt-1">{errors.manager_email.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: البيانات المالية والإدارية */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">البيانات المالية والإدارية</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        عدد الموظفين *
                      </label>
                      <input
                        {...register('employee_count', { 
                          required: 'عدد الموظفين مطلوب',
                          min: { value: 0, message: 'العدد لا يمكن أن يكون سالبًا' }
                        })}
                        type="number"
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="العدد الكلي للموظفين"
                      />
                      {errors.employee_count && <p className="text-red-500 text-sm mt-1">{errors.employee_count.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الموازنة السنوية (دينار عراقي) *
                      </label>
                      <input
                        {...register('annual_budget', { 
                          required: 'الموازنة السنوية مطلوبة',
                          min: { value: 0, message: 'المبلغ لا يمكن أن يكون سالبًا' }
                        })}
                        type="number"
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="المبلغ بالدينار العراقي"
                      />
                      {errors.annual_budget && <p className="text-red-500 text-sm mt-1">{errors.annual_budget.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الخدمات المقدمة *
                      </label>
                      <textarea
                        {...register('services_provided', { required: 'الخدمات المقدمة مطلوبة' })}
                        rows={3}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اذكر الخدمات التي تقدمها الجهة للمواطنين"
                      />
                      {errors.services_provided && <p className="text-red-500 text-sm mt-1">{errors.services_provided.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الفئة المستهدفة *
                      </label>
                      <textarea
                        {...register('target_audience', { required: 'الفئة المستهدفة مطلوبة' })}
                        rows={3}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اذكر الفئات التي تستهدفها خدمات الجهة"
                      />
                      {errors.target_audience && <p className="text-red-500 text-sm mt-1">{errors.target_audience.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: الأنظمة والتقنيات */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">الأنظمة والتقنيات</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <input
                        {...register('has_electronic_system')}
                        type="checkbox"
                        id="has_electronic_system"
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="has_electronic_system" className="text-sm font-medium text-gray-900 dark:text-gray-300">
                        تمتلك الجهة نظام إلكتروني
                      </label>
                    </div>

                    {hasElectronicSystem && (
                      <div className="animate-fade-in">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          وصف النظام الإلكتروني
                        </label>
                        <textarea
                          {...register('system_description')}
                          rows={3}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="اذكر تفاصيل النظام الإلكتروني المستخدم"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <input
                        {...register('publishes_reports')}
                        type="checkbox"
                        id="publishes_reports"
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="publishes_reports" className="text-sm font-medium text-gray-900 dark:text-gray-300">
                        تنشر تقارير دورية
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <input
                        {...register('has_complaints_system')}
                        type="checkbox"
                        id="has_complaints_system"
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="has_complaints_system" className="text-sm font-medium text-gray-900 dark:text-gray-300">
                        تمتلك نظام للشكاوى
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <input
                        {...register('has_quality_certificate')}
                        type="checkbox"
                        id="has_quality_certificate"
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="has_quality_certificate" className="text-sm font-medium text-gray-900 dark:text-gray-300">
                        تمتلك شهادة جودة
                      </label>
                    </div>

                    {hasQualityCertificate && (
                      <div className="animate-fade-in">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          نوع شهادة الجودة
                        </label>
                        <input
                          {...register('quality_certificate_type')}
                          className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                          placeholder="اذكر نوع شهادة الجودة"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 6: المشاريع والخطط */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">المشاريع والخطط</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        المشاريع الحالية *
                      </label>
                      <textarea
                        {...register('current_projects', { required: 'المشاريع الحالية مطلوبة' })}
                        rows={4}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اذكر المشاريع التي تعمل عليها الجهة حاليًا"
                      />
                      {errors.current_projects && <p className="text-red-500 text-sm mt-1">{errors.current_projects.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الخطط المستقبلية *
                      </label>
                      <textarea
                        {...register('future_plans', { required: 'الخطط المستقبلية مطلوبة' })}
                        rows={4}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اذكر الخطط والمشاريع المستقبلية"
                      />
                      {errors.future_plans && <p className="text-red-500 text-sm mt-1">{errors.future_plans.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الشراكات المحلية
                      </label>
                      <textarea
                        {...register('partnerships')}
                        rows={3}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اذكر الشراكات مع الجهات المحلية الأخرى"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        التعاون الدولي
                      </label>
                      <textarea
                        {...register('international_cooperation')}
                        rows={3}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اذكر برامج التعاون الدولي"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: التحديات والاحتياجات */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">التحديات والاحتياجات</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        مؤشرات الأداء *
                      </label>
                      <textarea
                        {...register('performance_indicators', { required: 'مؤشرات الأداء مطلوبة' })}
                        rows={4}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اذكر مؤشرات الأداء المستخدمة لقياس نجاح الجهة"
                      />
                      {errors.performance_indicators && <p className="text-red-500 text-sm mt-1">{errors.performance_indicators.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        التحديات *
                      </label>
                      <textarea
                        {...register('challenges', { required: 'التحديات مطلوبة' })}
                        rows={4}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اذكر التحديات التي تواجه الجهة"
                      />
                      {errors.challenges && <p className="text-red-500 text-sm mt-1">{errors.challenges.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الاحتياجات *
                      </label>
                      <textarea
                        {...register('needs', { required: 'الاحتياجات مطلوبة' })}
                        rows={4}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="اذكر الاحتياجات والمتطلبات"
                      />
                      {errors.needs && <p className="text-red-500 text-sm mt-1">{errors.needs.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ملاحظات إضافية
                      </label>
                      <textarea
                        {...register('additional_notes')}
                        rows={3}
                        className="input-focus w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="أي ملاحظات أو معلومات إضافية"
                      />
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
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الاستمارة'}
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

export default GovernmentEntityForm;
