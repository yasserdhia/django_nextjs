// اختبار مباشر للخادم Django
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Helper function to safely get error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return String(error);
};

// Helper function to get axios error details
const getAxiosErrorDetails = (error: any): string => {
  if (error.response?.data) {
    return JSON.stringify(error.response.data);
  }
  return getErrorMessage(error);
};

// اختبار حالة الخادم
export async function testServerHealth(): Promise<void> {
  try {
    console.log('🏥 اختبار حالة الخادم...');
    const response = await axios.get(`${API_URL}/api/health/`);
    console.log('✅ الخادم يعمل:', response.data);
  } catch (error: unknown) {
    console.error('❌ الخادم لا يعمل:', getErrorMessage(error));
    
    // اختبار اتصال أساسي
    try {
      await axios.get(`${API_URL}/`);
      console.log('✅ الاتصال الأساسي يعمل');
    } catch (basicError: unknown) {
      console.error('❌ لا يمكن الاتصال بالخادم:', getErrorMessage(basicError));
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
    
    console.log('✅ endpoint الاستمارة يعمل، عدد الجهات:', response.data.length);
  } catch (error: any) {
    console.error('❌ مشكلة في endpoint الاستمارة:', getAxiosErrorDetails(error));
  }
}

// إرسال استمارة جديدة
export async function testSubmitForm(): Promise<void> {
  try {
    console.log('📝 اختبار إرسال استمارة جديدة...');
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('لا يوجد توكن');
    }

    // بيانات اختبار مبسطة
    const simpleData = {
      entity_name: `جهة اختبار ${Date.now()}`,
      entity_type: 'وزارة',
      governorate: 'بغداد',
      phone_number: '07700000000',
      email: `test${Date.now()}@test.com`,
      manager_name: 'مدير اختبار',
      status: 'pending'
    };

    console.log('📤 إرسال البيانات:', simpleData);

    const response = await axios.post(`${API_URL}/api/forms/government-entities/`, simpleData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ تم إرسال الاستمارة بنجاح:', response.data);
  } catch (error: any) {
    console.error('❌ فشل الإرسال:', getAxiosErrorDetails(error));
  }
}

// اختبار التوكن
export async function testTokenValidation(): Promise<void> {
  try {
    console.log('🔐 اختبار صحة التوكن...');
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('لا يوجد توكن');
    }

    // اختبار endpoint محمي
    const response = await axios.get(`${API_URL}/api/auth/users/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ التوكن صالح، معلومات المستخدم:', response.data);
  } catch (error: any) {
    console.error('❌ التوكن غير صالح:', getAxiosErrorDetails(error));
    
    // محاولة تحديث التوكن
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        console.log('🔄 محاولة تحديث التوكن...');
        
        const refreshResponse = await axios.post(`${API_URL}/api/auth/jwt/refresh/`, {
          refresh: refreshToken
        });

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem('access_token', newAccessToken);
        console.log('✅ تم تحديث التوكن بنجاح');
      }
    } catch (refreshError: any) {
      console.error('❌ فشل تحديث التوكن:', getAxiosErrorDetails(refreshError));
    }
  }
}

// تشغيل جميع الاختبارات
export async function runAllTests(): Promise<void> {
  console.log('🚀 بدء تشغيل جميع الاختبارات...');
  console.log('=====================================');

  await testServerHealth();
  console.log('-------------------------------------');
  
  await testFormsEndpoint();
  console.log('-------------------------------------');
  
  await testSubmitForm();
  console.log('-------------------------------------');
  
  await testTokenValidation();
  console.log('-------------------------------------');

  console.log('✅ انتهت جميع الاختبارات');
  console.log('=====================================');
}
