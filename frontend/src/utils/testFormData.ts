// اختبار إرسال بيانات صحيحة للاستمارة
import api from '@/lib/api';

// بيانات اختبار صحيحة
const testFormData = {
  // معلومات الجهة الأساسية
  entity_name: 'وزارة التخطيط',
  entity_type: 'ministry',
  governorate: 'baghdad',
  address: 'بغداد - شارع الصدر - مجمع الوزارات',
  
  // معلومات الاتصال
  phone_number: '07901234567',
  email: 'info@mop.gov.iq',
  website: 'https://mop.gov.iq',
  
  // معلومات المسؤول
  manager_name: 'د. أحمد العراقي',
  manager_position: 'وزير التخطيط',
  manager_phone: '07901234568',
  manager_email: 'minister@mop.gov.iq',
  
  // معلومات إضافية
  establishment_date: '2003-05-01',
  employee_count: 500,
  annual_budget: 1000000000,
  
  // خدمات الجهة
  services_provided: 'وضع السياسات الاقتصادية، التخطيط الاستراتيجي، إدارة المشاريع التنموية',
  target_audience: 'الحكومة العراقية، المواطنون، القطاع الخاص',
  
  // معلومات تقنية
  has_electronic_system: true,
  system_description: 'نظام إدارة المشاريع الحكومية الإلكتروني',
  
  // معلومات الشفافية
  publishes_reports: true,
  has_complaints_system: true,
  
  // معلومات الجودة
  has_quality_certificate: true,
  quality_certificate_type: 'ISO 9001:2015',
  
  // معلومات المشاريع
  current_projects: 'مشروع التنمية الوطنية 2024، مشروع البنية التحتية الرقمية',
  future_plans: 'تطوير النظام الرقمي الحكومي، تحسين كفاءة الخدمات',
  
  // معلومات الشراكات
  partnerships: 'وزارة المالية، البنك المركزي العراقي',
  international_cooperation: 'البنك الدولي، الأمم المتحدة',
  
  // معلومات التقييم
  performance_indicators: 'معدل إنجاز المشاريع 85%، رضا المواطنين 78%',
  challenges: 'نقص التمويل، التحديات التقنية، البيروقراطية',
  needs: 'تطوير الكوادر، تحديث الأنظمة، زيادة الميزانية',
  
  // معلومات إضافية
  additional_notes: 'تسعى الوزارة لتحقيق التنمية المستدامة في العراق'
};

// دالة لاختبار الإرسال
export async function testFormSubmission(): Promise<void> {
  try {
    console.log('🔍 بدء اختبار إرسال البيانات...');
    
    // التحقق من التوكن
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ لا يوجد توكن مصادقة');
      throw new Error('يرجى تسجيل الدخول أولاً');
    }
    
    console.log('✅ التوكن موجود');
    console.log('📤 البيانات المرسلة:', testFormData);
    
    // إرسال البيانات
    const response = await api.post('/api/forms/government-entities/', testFormData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('✅ نجح الإرسال!');
    console.log('📥 الرد:', response.data);
    
  } catch (error: any) {
    console.error('❌ فشل الإرسال:', error);
    
    if (error.response) {
      console.error('📋 تفاصيل الخطأ:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
      
      // تحليل أخطاء 400
      if (error.response.status === 400) {
        console.error('🔍 تحليل خطأ 400:');
        const errorData = error.response.data;
        
        if (typeof errorData === 'object') {
          Object.entries(errorData).forEach(([field, messages]) => {
            console.error(`❌ ${field}:`, messages);
          });
        }
      }
    }
    
    throw error;
  }
}

// دالة للتحقق من صحة البيانات
export function validateTestData(): string[] {
  const errors: string[] = [];
  
  // التحقق من الحقول المطلوبة
  const requiredFields = [
    'entity_name', 'entity_type', 'governorate', 'address',
    'phone_number', 'email', 'manager_name', 'manager_position',
    'manager_phone', 'manager_email', 'establishment_date',
    'employee_count', 'annual_budget', 'services_provided',
    'target_audience', 'current_projects', 'future_plans',
    'performance_indicators', 'challenges', 'needs'
  ];
  
  requiredFields.forEach(field => {
    const value = testFormData[field as keyof typeof testFormData];
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors.push(`الحقل ${field} مطلوب`);
    }
  });
  
  // التحقق من تنسيق البريد الإلكتروني
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(testFormData.email)) {
    errors.push('تنسيق البريد الإلكتروني غير صحيح');
  }
  if (!emailRegex.test(testFormData.manager_email)) {
    errors.push('تنسيق بريد المسؤول غير صحيح');
  }
  
  // التحقق من رقم الهاتف
  const phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(testFormData.phone_number)) {
    errors.push('رقم الهاتف يجب أن يكون 11 رقم');
  }
  if (!phoneRegex.test(testFormData.manager_phone)) {
    errors.push('رقم هاتف المسؤول يجب أن يكون 11 رقم');
  }
  
  // التحقق من التاريخ
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(testFormData.establishment_date)) {
    errors.push('تنسيق التاريخ غير صحيح (يجب أن يكون YYYY-MM-DD)');
  }
  
  // التحقق من الأرقام
  if (testFormData.employee_count <= 0) {
    errors.push('عدد الموظفين يجب أن يكون أكبر من صفر');
  }
  if (testFormData.annual_budget <= 0) {
    errors.push('الميزانية يجب أن تكون أكبر من صفر');
  }
  
  return errors;
}

// دالة لطباعة ملخص البيانات
export function printDataSummary(): void {
  console.log('📊 ملخص بيانات الاختبار:');
  console.log('🏛️ اسم الجهة:', testFormData.entity_name);
  console.log('🏷️ نوع الجهة:', testFormData.entity_type);
  console.log('🌍 المحافظة:', testFormData.governorate);
  console.log('👥 عدد الموظفين:', testFormData.employee_count);
  console.log('💰 الميزانية:', testFormData.annual_budget);
  console.log('📧 البريد الإلكتروني:', testFormData.email);
  console.log('📱 رقم الهاتف:', testFormData.phone_number);
  
  const errors = validateTestData();
  if (errors.length > 0) {
    console.error('❌ أخطاء في البيانات:', errors);
  } else {
    console.log('✅ جميع البيانات صحيحة');
  }
}

export default testFormData;
