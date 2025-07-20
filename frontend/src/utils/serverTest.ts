// اختبار مباشر للخادم Django
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// اختبار حالة الخادم
export async function testServerHealth(): Promise<void> {
  try {
    console.log('🏥 اختبار حالة الخادم...');
    const response = await axios.get(`${API_URL}/api/health/`);
    console.log('✅ الخادم يعمل:', response.data);
  } catch (error: any) {
    console.error('❌ الخادم لا يعمل:', error.message);
    
    // اختبار اتصال أساسي
    try {
      await axios.get(`${API_URL}/`);
      console.log('✅ الاتصال الأساسي يعمل');
    } catch (basicError) {
      console.error('❌ لا يمكن الاتصال بالخادم:', basicError.message);
    }
  }
}

// اختبار endpoint الاستمارة
export async function testFormsEndpoint(): Promise<void> {
  try {
    console.log('📋 اختبار endpoint الاستمارة...');
    
    // الحصول على التوكن
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('لا يوجد توكن');
    }
    
    // اختبار GET للاستمارات
    const response = await axios.get(`${API_URL}/api/forms/government-entities/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ endpoint الاستمارة يعمل:', response.data);
  } catch (error: any) {
    console.error('❌ مشكلة في endpoint الاستمارة:', error.response?.data || error.message);
  }
}

// اختبار إرسال بيانات بسيطة
export async function testSimpleSubmission(): Promise<void> {
  try {
    console.log('📤 اختبار إرسال بيانات بسيطة...');
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('لا يوجد توكن');
    }
    
    // بيانات بسيطة للاختبار
    const simpleData = {
      entity_name: 'اختبار بسيط',
      entity_type: 'ministry',
      governorate: 'baghdad',
      address: 'عنوان تجريبي',
      phone_number: '07901234567',
      email: 'test@example.com',
      manager_name: 'مدير تجريبي',
      manager_position: 'مدير',
      manager_phone: '07901234568',
      manager_email: 'manager@example.com',
      establishment_date: '2020-01-01',
      employee_count: 10,
      annual_budget: 1000000,
      services_provided: 'خدمات',
      target_audience: 'جمهور',
      has_electronic_system: false,
      publishes_reports: false,
      has_complaints_system: false,
      has_quality_certificate: false,
      current_projects: 'مشاريع',
      future_plans: 'خطط',
      performance_indicators: 'مؤشرات',
      challenges: 'تحديات',
      needs: 'احتياجات'
    };
    
    console.log('📤 إرسال البيانات:', simpleData);
    
    const response = await axios.post(`${API_URL}/api/forms/government-entities/`, simpleData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ تم الإرسال بنجاح:', response.data);
    
  } catch (error: any) {
    console.error('❌ فشل الإرسال:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.error('🔍 تفاصيل خطأ 400:', error.response.data);
    }
  }
}

// اختبار التوكن
export async function testAuthToken(): Promise<void> {
  try {
    console.log('🔑 اختبار التوكن...');
    
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    console.log('📋 معلومات التوكن:');
    console.log('- Access Token:', token ? 'موجود' : 'غير موجود');
    console.log('- Refresh Token:', refreshToken ? 'موجود' : 'غير موجود');
    
    if (token) {
      // فحص صلاحية التوكن
      const response = await axios.get(`${API_URL}/api/auth/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ التوكن صالح:', response.data);
    } else {
      console.error('❌ لا يوجد توكن');
    }
    
  } catch (error: any) {
    console.error('❌ التوكن غير صالح:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('🔄 محاولة تحديث التوكن...');
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(`${API_URL}/api/auth/jwt/refresh/`, {
            refresh: refreshToken
          });
          
          const newToken = refreshResponse.data.access;
          localStorage.setItem('access_token', newToken);
          
          console.log('✅ تم تحديث التوكن');
        } catch (refreshError: any) {
          console.error('❌ فشل تحديث التوكن:', refreshError.response?.data || refreshError.message);
        }
      }
    }
  }
}

// تشغيل جميع الاختبارات
export async function runAllTests(): Promise<void> {
  console.log('🚀 بدء اختبارات شاملة...');
  console.log('===============================');
  
  await testServerHealth();
  console.log('-------------------------------');
  
  await testAuthToken();
  console.log('-------------------------------');
  
  await testFormsEndpoint();
  console.log('-------------------------------');
  
  await testSimpleSubmission();
  console.log('-------------------------------');
  
  console.log('✅ انتهت جميع الاختبارات');
}

// تشغيل الاختبارات عند تحميل الصفحة (للتطوير)
if (typeof window !== 'undefined') {
  (window as any).runAllTests = runAllTests;
  (window as any).testServerHealth = testServerHealth;
  (window as any).testAuthToken = testAuthToken;
  (window as any).testFormsEndpoint = testFormsEndpoint;
  (window as any).testSimpleSubmission = testSimpleSubmission;
}

export default {
  testServerHealth,
  testAuthToken,
  testFormsEndpoint,
  testSimpleSubmission,
  runAllTests
};
