import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import api from '@/lib/api';
import { runAllTests } from '@/utils/serverTest';

export default function TestConnection() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const tests = [
    {
      name: 'اختبار الاتصال بالخادم',
      test: async () => {
        const response = await fetch('http://localhost:8000/api/health/');
        return { status: response.status, data: await response.text() };
      }
    },
    {
      name: 'اختبار تسجيل الدخول',
      test: async () => {
        const response = await api.post('/api/auth/jwt/create/', {
          username: 'testuser',
          password: 'testpass123'
        });
        return { status: response.status, data: response.data };
      }
    },
    {
      name: 'اختبار إرسال بيانات الاستمارة',
      test: async () => {
        const testData = {
          entity_name: 'جهة تجريبية',
          entity_type: 'ministry',
          governorate: 'baghdad',
          address: 'بغداد - الكرخ',
          phone_number: '07901234567',
          email: 'test@example.com',
          manager_name: 'مدير تجريبي',
          manager_position: 'مدير عام',
          manager_phone: '07901234567',
          manager_email: 'manager@example.com',
          establishment_date: '2020-01-01',
          employee_count: 100,
          annual_budget: 1000000,
          services_provided: 'خدمات تجريبية',
          target_audience: 'جمهور تجريبي',
          has_electronic_system: true,
          system_description: 'نظام إلكتروني تجريبي',
          publishes_reports: true,
          has_complaints_system: true,
          has_quality_certificate: false,
          current_projects: 'مشاريع حالية',
          future_plans: 'خطط مستقبلية',
          performance_indicators: 'مؤشرات أداء',
          challenges: 'تحديات',
          needs: 'احتياجات',
          additional_notes: 'ملاحظات إضافية'
        };
        
        const response = await apiClient.post('/api/forms/government-entities/', testData);
        return { status: response.status, data: response.data };
      }
    },
    {
      name: 'اختبار الحصول على التوكن',
      test: async () => {
        const token = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        return { 
          status: token ? 200 : 404, 
          data: { 
            hasToken: !!token,
            hasRefreshToken: !!refreshToken,
            tokenPreview: token ? `${token.substring(0, 20)}...` : 'غير موجود'
          } 
        };
      }
    }
  ];

  const runTests = async () => {
    setLoading(true);
    const newResults = [];
    
    for (const testItem of tests) {
      try {
        console.log(`🔍 تشغيل اختبار: ${testItem.name}`);
        const result = await testItem.test();
        newResults.push({
          name: testItem.name,
          success: true,
          result: result
        });
        console.log(`✅ نجح: ${testItem.name}`, result);
      } catch (error: any) {
        newResults.push({
          name: testItem.name,
          success: false,
          error: {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          }
        });
        console.error(`❌ فشل: ${testItem.name}`, error);
      }
    }
    
    setResults(newResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          اختبار الاتصال والاستمارات
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={runTests}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4"
          >
            {loading ? 'جاري التشغيل...' : 'تشغيل الاختبارات'}
          </button>
          
          <button
            onClick={() => runAllTests()}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            اختبار الخادم مباشرة (تحقق من Console)
          </button>
        </div>
        
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.success 
                    ? 'bg-green-50 border-l-4 border-green-400' 
                    : 'bg-red-50 border-l-4 border-red-400'
                }`}
              >
                <div className="flex items-center">
                  <div className={`text-2xl mr-3 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? '✅' : '❌'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{result.name}</h3>
                    {result.success ? (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">الحالة: {result.result.status}</p>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(result.result.data, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-sm text-red-600">الخطأ: {result.error.message}</p>
                        {result.error.status && (
                          <p className="text-sm text-red-600">الحالة: {result.error.status}</p>
                        )}
                        {result.error.data && (
                          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.error.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
