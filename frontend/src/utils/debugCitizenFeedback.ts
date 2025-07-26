// أداة التحقق من صحة بيانات استمارة المواطنين
export interface CitizenFeedbackFormData {
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

// دالة للتحقق من صحة البيانات
export function validateCitizenFeedbackData(data: CitizenFeedbackFormData): string[] {
  const errors: string[] = [];
  
  // التحقق من الحقول المطلوبة
  if (!data.feedback_type?.trim()) errors.push('نوع الملاحظة مطلوب');
  if (!data.subject?.trim()) errors.push('موضوع الملاحظة مطلوب');
  if (!data.description?.trim()) errors.push('وصف الملاحظة مطلوب');
  
  // إذا لم يكن الإرسال مجهولاً، تحقق من المعلومات الشخصية
  if (!data.is_anonymous) {
    if (!data.full_name?.trim()) errors.push('الاسم الكامل مطلوب');
    if (!data.phone_number?.trim()) errors.push('رقم الهاتف مطلوب');
    if (!data.email?.trim()) errors.push('البريد الإلكتروني مطلوب');
    if (!data.address?.trim()) errors.push('العنوان مطلوب');
    
    // التحقق من تنسيق البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push('تنسيق البريد الإلكتروني غير صحيح');
    }
    
    // التحقق من رقم الهاتف
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (data.phone_number && !phoneRegex.test(data.phone_number)) {
      errors.push('رقم الهاتف غير صحيح');
    }
    
    // التحقق من رقم الهوية
    if (data.national_id && data.national_id.length < 10) {
      errors.push('رقم الهوية يجب أن يكون 10 أرقام على الأقل');
    }
    
    // التحقق من العمر
    if (!data.age || data.age < 18 || data.age > 100) {
      errors.push('العمر يجب أن يكون بين 18 و 100 سنة');
    }
    
    // التحقق من الجنس
    if (!data.gender?.trim()) errors.push('الجنس مطلوب');
    
    // التحقق من المستوى التعليمي
    if (!data.education_level?.trim()) errors.push('المستوى التعليمي مطلوب');
    
    // التحقق من المهنة
    if (!data.occupation?.trim()) errors.push('المهنة مطلوبة');
    
    // التحقق من المحافظة والمدينة
    if (!data.governorate?.trim()) errors.push('المحافظة مطلوبة');
    if (!data.city?.trim()) errors.push('المدينة مطلوبة');
  } else {
    // في الإرسال المجهول، فقط المحافظة والمدينة مطلوبة
    if (!data.governorate?.trim()) errors.push('المحافظة مطلوبة');
    if (!data.city?.trim()) errors.push('المدينة مطلوبة');
  }
  
  // التحقق من المحاولات السابقة
  if (data.previous_attempts && !data.previous_attempts_description?.trim()) {
    errors.push('وصف المحاولات السابقة مطلوب');
  }
  
  return errors;
}

// دالة لطباعة البيانات للتشخيص
export function debugCitizenFeedbackData(data: CitizenFeedbackFormData): void {
  console.log('🔍 تشخيص بيانات استمارة المواطنين:');
  console.log('📋 البيانات المرسلة:', data);
  
  const errors = validateCitizenFeedbackData(data);
  if (errors.length > 0) {
    console.error('❌ أخطاء في البيانات:', errors);
  } else {
    console.log('✅ جميع البيانات صحيحة');
  }
  
  // التحقق من وجود التوكن
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('❌ لا يوجد توكن مصادقة');
  } else {
    console.log('✅ توكن المصادقة موجود');
  }
  
  // التحقق من الإرسال المجهول
  if (data.is_anonymous) {
    console.log('🎭 الإرسال المجهول مفعل');
  } else {
    console.log('👤 الإرسال بالاسم الحقيقي');
  }
}

// دالة لتحويل أسماء الحقول إلى تنسيق Django
export function convertFieldNamesForDjango(data: CitizenFeedbackFormData): Record<string, any> {
  const fieldMapping = {
    'full_name': 'citizen_name',
    'phone_number': 'citizen_phone',
    'email': 'citizen_email',
    'address': 'citizen_address',
    'national_id': 'citizen_id',
    'subject': 'title',
  };
  
  const convertedData: Record<string, any> = {};
  
  Object.keys(data).forEach(key => {
    if (key !== 'supporting_documents') {
      const value = data[key as keyof CitizenFeedbackFormData];
      if (value !== null && value !== '' && value !== undefined) {
        const djangoFieldName = fieldMapping[key as keyof typeof fieldMapping] || key;
        convertedData[djangoFieldName] = value;
      }
    }
  });
  
  return convertedData;
}

// Create named export object
const debugCitizenFeedbackUtils = {
  validateCitizenFeedbackData,
  debugCitizenFeedbackData,
  convertFieldNamesForDjango
};

export default debugCitizenFeedbackUtils;
