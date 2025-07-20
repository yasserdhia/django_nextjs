// أداة لتشخيص مشاكل تقديم الاستمارة
export interface GovernmentEntityFormData {
  // معلومات الجهة الأساسية
  entity_name: string;
  entity_type: string;
  governorate: string;
  address: string;
  
  // معلومات الاتصال
  phone_number: string;
  email: string;
  website?: string;
  
  // معلومات المسؤول
  manager_name: string;
  manager_position: string;
  manager_phone: string;
  manager_email: string;
  
  // معلومات إضافية
  establishment_date: string;
  employee_count: number;
  annual_budget: number;
  
  // خدمات الجهة
  services_provided: string;
  target_audience: string;
  
  // معلومات تقنية
  has_electronic_system: boolean;
  system_description?: string;
  
  // معلومات الشفافية
  publishes_reports: boolean;
  has_complaints_system: boolean;
  
  // معلومات الجودة
  has_quality_certificate: boolean;
  quality_certificate_type?: string;
  
  // معلومات المشاريع
  current_projects: string;
  future_plans: string;
  
  // معلومات الشراكات
  partnerships?: string;
  international_cooperation?: string;
  
  // معلومات التقييم
  performance_indicators: string;
  challenges: string;
  needs: string;
  
  // معلومات إضافية
  additional_notes?: string;
}

// دالة للتحقق من صحة البيانات قبل الإرسال
export function validateFormData(data: GovernmentEntityFormData): string[] {
  const errors: string[] = [];
  
  // التحقق من الحقول المطلوبة
  if (!data.entity_name?.trim()) errors.push('اسم الجهة مطلوب');
  if (!data.entity_type?.trim()) errors.push('نوع الجهة مطلوب');
  if (!data.governorate?.trim()) errors.push('المحافظة مطلوبة');
  if (!data.address?.trim()) errors.push('العنوان مطلوب');
  
  // التحقق من معلومات الاتصال
  if (!data.phone_number?.trim()) errors.push('رقم الهاتف مطلوب');
  if (!data.email?.trim()) errors.push('البريد الإلكتروني مطلوب');
  
  // التحقق من معلومات المسؤول
  if (!data.manager_name?.trim()) errors.push('اسم المسؤول مطلوب');
  if (!data.manager_position?.trim()) errors.push('منصب المسؤول مطلوب');
  if (!data.manager_phone?.trim()) errors.push('هاتف المسؤول مطلوب');
  if (!data.manager_email?.trim()) errors.push('بريد المسؤول مطلوب');
  
  // التحقق من المعلومات الإضافية
  if (!data.establishment_date?.trim()) errors.push('تاريخ التأسيس مطلوب');
  if (!data.employee_count || data.employee_count <= 0) errors.push('عدد الموظفين مطلوب');
  if (!data.annual_budget || data.annual_budget <= 0) errors.push('الميزانية السنوية مطلوبة');
  
  // التحقق من الخدمات
  if (!data.services_provided?.trim()) errors.push('الخدمات المقدمة مطلوبة');
  if (!data.target_audience?.trim()) errors.push('الجمهور المستهدف مطلوب');
  
  // التحقق من معلومات التقييم
  if (!data.current_projects?.trim()) errors.push('المشاريع الحالية مطلوبة');
  if (!data.future_plans?.trim()) errors.push('الخطط المستقبلية مطلوبة');
  if (!data.performance_indicators?.trim()) errors.push('مؤشرات الأداء مطلوبة');
  if (!data.challenges?.trim()) errors.push('التحديات مطلوبة');
  if (!data.needs?.trim()) errors.push('الاحتياجات مطلوبة');
  
  // التحقق من تنسيق البريد الإلكتروني
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('تنسيق البريد الإلكتروني غير صحيح');
  }
  if (data.manager_email && !emailRegex.test(data.manager_email)) {
    errors.push('تنسيق بريد المسؤول غير صحيح');
  }
  
  // التحقق من رقم الهاتف
  const phoneRegex = /^\+?1?\d{9,15}$/;
  if (data.phone_number && !phoneRegex.test(data.phone_number)) {
    errors.push('تنسيق رقم الهاتف غير صحيح');
  }
  if (data.manager_phone && !phoneRegex.test(data.manager_phone)) {
    errors.push('تنسيق هاتف المسؤول غير صحيح');
  }
  
  // التحقق من الموقع الإلكتروني
  if (data.website && data.website.trim()) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(data.website)) {
      errors.push('الموقع الإلكتروني غير صحيح (يجب أن يكون مثل: https://example.com)');
    }
  }
  
  return errors;
}

// دالة لطباعة البيانات للتشخيص
export function debugFormData(data: GovernmentEntityFormData): void {
  console.log('🔍 تشخيص بيانات الاستمارة:');
  console.log('📋 البيانات المرسلة:', data);
  
  const errors = validateFormData(data);
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
}
