import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';

interface CustomForm {
  id: number;
  title: string;
  description: string;
  category: string;
  is_public: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  responses_count: number;
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface FormResponse {
  id: number;
  form: number;
  response_data: any;
  submitted_at: string;
  submitter_name: string;
  submitter_email: string;
}

const FormsManagementPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<CustomForm | null>(null);
  const [formResponses, setFormResponses] = useState<FormResponse[]>([]);
  const [showResponsesModal, setShowResponsesModal] = useState(false);
  const [loadingResponses, setLoadingResponses] = useState(false);

  const categories = {
    'general': 'عام',
    'feedback': 'ملاحظات واقتراحات',
    'complaints': 'شكاوى',
    'services': 'طلب خدمات',
    'employment': 'توظيف',
    'surveys': 'استطلاعات رأي'
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchForms();
  }, [user, router]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/forms/manage/');
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('حدث خطأ في جلب الاستمارات');
    } finally {
      setLoading(false);
    }
  };

  const toggleFormStatus = async (formId: number, newStatus: boolean) => {
    try {
      await apiClient.patch(`/api/forms/manage/${formId}/`, {
        is_active: newStatus
      });
      
      setForms(prev => prev.map(form => 
        form.id === formId ? { ...form, is_active: newStatus } : form
      ));
      
      toast.success(`تم ${newStatus ? 'تفعيل' : 'إيقاف'} الاستمارة بنجاح`);
    } catch (error) {
      console.error('Error updating form status:', error);
      toast.error('حدث خطأ في تحديث حالة الاستمارة');
    }
  };

  const deleteForm = async (formId: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الاستمارة؟ لن يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      await apiClient.delete(`/api/forms/manage/${formId}/`);
      setForms(prev => prev.filter(form => form.id !== formId));
      toast.success('تم حذف الاستمارة بنجاح');
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('حدث خطأ في حذف الاستمارة');
    }
  };

  const fetchFormResponses = async (form: CustomForm) => {
    try {
      setLoadingResponses(true);
      setSelectedForm(form);
      setShowResponsesModal(true);
      
      const response = await apiClient.get(`/api/forms/responses/${form.id}/`);
      setFormResponses(response.data);
    } catch (error) {
      console.error('Error fetching form responses:', error);
      toast.error('حدث خطأ في جلب الردود');
      setShowResponsesModal(false);
    } finally {
      setLoadingResponses(false);
    }
  };

  const duplicateForm = async (form: CustomForm) => {
    try {
      const response = await apiClient.post(`/api/forms/duplicate/${form.id}/`);
      toast.success('تم نسخ الاستمارة بنجاح');
      fetchForms(); // Refresh the list
    } catch (error) {
      console.error('Error duplicating form:', error);
      toast.error('حدث خطأ في نسخ الاستمارة');
    }
  };

  const exportResponses = async (formId: number, format: 'excel' | 'pdf') => {
    try {
      const response = await apiClient.get(`/api/forms/export/${formId}/${format}/`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `form_responses_${formId}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`تم تصدير الردود بصيغة ${format === 'excel' ? 'Excel' : 'PDF'} بنجاح`);
    } catch (error) {
      console.error('Error exporting responses:', error);
      toast.error('حدث خطأ في تصدير الردود');
    }
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
      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">📊</span>
                </div>
                <div className="ml-4">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">إدارة الاستمارات</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">إدارة ومراقبة الاستمارات المخصصة</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button
                onClick={() => router.push('/admin/form-builder')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md flex items-center space-x-2 rtl:space-x-reverse"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>إنشاء استمارة جديدة</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الاستمارات</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{forms.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📋</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الاستمارات النشطة</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {forms.filter(f => f.is_active).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الردود</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {forms.reduce((total, form) => total + form.responses_count, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">💬</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الاستمارات العامة</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {forms.filter(f => f.is_public).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🌍</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Forms Grid */}
            <div className="glass rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">الاستمارات المتاحة</h2>
              </div>

              {forms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    لا توجد استمارات
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    ابدأ بإنشاء أول استمارة مخصصة
                  </p>
                  <button
                    onClick={() => router.push('/admin/form-builder')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    إنشاء استمارة جديدة
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {forms.map((form) => (
                    <div key={form.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {form.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {form.description || 'لا يوجد وصف'}
                          </p>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                              {categories[form.category as keyof typeof categories] || form.category}
                            </span>
                            {form.is_public && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded-full">
                                عامة
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              form.is_active 
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                            }`}>
                              {form.is_active ? 'نشطة' : 'متوقفة'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>{form.responses_count} رد</span>
                        <span>{new Date(form.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => fetchFormResponses(form)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                        >
                          عرض الردود
                        </button>
                        
                        <button
                          onClick={() => duplicateForm(form)}
                          className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-lg transition-colors"
                          title="نسخ"
                        >
                          📋
                        </button>
                        
                        <button
                          onClick={() => toggleFormStatus(form.id, !form.is_active)}
                          className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                            form.is_active
                              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                          title={form.is_active ? 'إيقاف' : 'تفعيل'}
                        >
                          {form.is_active ? '⏸️' : '▶️'}
                        </button>
                        
                        <button
                          onClick={() => deleteForm(form.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </div>

                      {form.responses_count > 0 && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => exportResponses(form.id, 'excel')}
                            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                          >
                            تصدير Excel
                          </button>
                          <button
                            onClick={() => exportResponses(form.id, 'pdf')}
                            className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                          >
                            تصدير PDF
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Responses Modal */}
      {showResponsesModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                ردود استمارة: {selectedForm.title}
              </h3>
              <button
                onClick={() => setShowResponsesModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              {loadingResponses ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : formResponses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-gray-500 dark:text-gray-400">لا توجد ردود على هذه الاستمارة بعد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formResponses.map((response) => (
                    <div key={response.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {response.submitter_name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {response.submitter_email}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(response.submitted_at).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(response.response_data).map(([field, value]) => (
                          <div key={field} className="grid grid-cols-3 gap-4">
                            <div className="font-medium text-gray-700 dark:text-gray-300">
                              {field}:
                            </div>
                            <div className="col-span-2 text-gray-900 dark:text-white">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsManagementPage;
