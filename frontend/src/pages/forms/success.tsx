import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const FormSuccess: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-300 dark:bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          <div className="glass rounded-3xl p-8 text-center shadow-2xl">
            {/* Success Animation */}
            <div className="mb-8">
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce-in">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                {/* Animated rings */}
                <div className="absolute inset-0 border-4 border-green-400 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-2 border-4 border-green-500 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>

            {/* Success Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                تم الإرسال بنجاح! 🎉
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                تم استلام استمارتك بنجاح
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                الأمانة العامة لمجلس الوزراء - جمهورية العراق
              </p>
            </div>

            {/* Success Details */}
            <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-700">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-green-700 dark:text-green-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">تم الحفظ في قاعدة البيانات</span>
                </div>
                
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-green-700 dark:text-green-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm font-medium">تم إرسال إشعار للمراجعة</span>
                </div>
                
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-green-700 dark:text-green-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">سيتم المراجعة خلال 3-5 أيام عمل</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
                الخطوات التالية
              </h3>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>سيتم مراجعة الاستمارة من قبل الفريق المختص</span>
                </div>
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>سيتم التواصل معك في حال الحاجة لمعلومات إضافية</span>
                </div>
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>سيتم إعلامك بنتيجة المراجعة عبر البريد الإلكتروني</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link href="/dashboard" className="w-full">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                  العودة للوحة التحكم
                </button>
              </Link>

              <Link href="/forms/government-entity" className="w-full">
                <button className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all duration-300">
                  إرسال استمارة جديدة
                </button>
              </Link>
            </div>

            {/* Support */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                في حال وجود استفسار أو مشكلة
              </p>
              <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse text-xs text-gray-600 dark:text-gray-400">
                <span>📧 support@cabinet.gov.iq</span>
                <span>📞 +964-1-123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSuccess;
