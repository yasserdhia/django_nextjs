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
  fields: FormField[];
  created_by: {
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'phone';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

const PublicFormsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<CustomForm | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = {
    'all': 'جميع الفئات',
    'general': 'عام',
    'feedback': 'ملاحظات واقتراحات',
    'complaints': 'شكاوى',
    'services': 'طلب خدمات',
    'employment': 'توظيف',
    'surveys': 'استطلاعات رأي'
  };

  useEffect(() => {
    fetchPublicForms();
  }, []);

  const fetchPublicForms = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/forms/public/');
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching public forms:', error);
      toast.error('حدث خطأ في جلب الاستمارات');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (form: CustomForm) => {
    setSelectedForm(form);
    const initialData: { [key: string]: any } = {};
    
    form.fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialData[field.id] = [];
      } else {
        initialData[field.id] = '';
      }
    });
    
    setFormData(initialData);
  };

  const closeForm = () => {
    setSelectedForm(null);
    setFormData({});
  };

  const handleInputChange = (fieldId: string, value: any, fieldType: string) => {
    setFormData(prev => {
      if (fieldType === 'checkbox') {
        const currentValues = prev[fieldId] || [];
        if (currentValues.includes(value)) {
          return { ...prev, [fieldId]: currentValues.filter((v: any) => v !== value) };
        } else {
          return { ...prev, [fieldId]: [...currentValues, value] };
        }
      } else {
        return { ...prev, [fieldId]: value };
      }
    });
  };

  const validateForm = () => {
    if (!selectedForm) return false;

    for (const field of selectedForm.fields) {
      if (field.required) {
        const value = formData[field.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          toast.error(`حقل "${field.label}" مطلوب`);
          return false;
        }
      }
    }
    return true;
  };

  const submitForm = async () => {
    if (!selectedForm || !validateForm()) return;

    setSubmitting(true);
    try {
      // Prepare submission data
      const submissionData = {
        form_id: selectedForm.id,
        response_data: formData,
        submitter_name: user ? `${user.first_name} ${user.last_name}` : 'مجهول',
        submitter_email: user?.email || ''
      };

      await apiClient.post('/api/forms/submit/', submissionData);
      toast.success('تم إرسال الاستمارة بنجاح!');
      closeForm();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error('حدث خطأ في إرسال الاستمارة');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredForms = filterCategory === 'all' 
    ? forms 
    : forms.filter(form => form.category === filterCategory);

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value, field.type)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value, field.type)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={field.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value, field.type)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value, field.type)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value, field.type)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={field.required}
          >
            <option value="">اختر...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value, field.type)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  required={field.required}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={value.includes(option)}
                  onChange={(e) => handleInputChange(field.id, option, field.type)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

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
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">📋</span>
                </div>
                <div className="ml-4">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">الاستمارات العامة</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">استمارات متاحة للجميع</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <ThemeToggle />
              {user && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="glass rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterCategory(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterCategory === key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 shadow-lg">
            {filteredForms.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  لا توجد استمارات متاحة
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  لم يتم العثور على استمارات في هذه الفئة
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredForms.map((form) => (
                  <div key={form.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {form.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {form.description || 'لا يوجد وصف'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                          {categories[form.category as keyof typeof categories] || form.category}
                        </span>
                        <span>{new Date(form.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      بواسطة: {form.created_by.first_name} {form.created_by.last_name}
                    </div>

                    <button
                      onClick={() => openForm(form)}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
                    >
                      ملء الاستمارة
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Form Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedForm.title}
              </h3>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={submitting}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              {selectedForm.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedForm.description}
                </p>
              )}

              <form onSubmit={(e) => { e.preventDefault(); submitForm(); }} className="space-y-6">
                {selectedForm.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 mr-1">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}

                <div className="flex space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    {submitting && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>}
                    <span>{submitting ? 'جاري الإرسال...' : 'إرسال الاستمارة'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={submitting}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicFormsPage;
