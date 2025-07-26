import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'phone';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormData {
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  fields: FormField[];
}

const FormBuilderPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'general',
    isPublic: true,
    fields: []
  });
  const [currentField, setCurrentField] = useState<FormField>({
    id: '',
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
    options: []
  });
  const [isAddingField, setIsAddingField] = useState(false);
  const [saving, setSaving] = useState(false);
  const draggedIndex = useRef<number | null>(null);

  const fieldTypes = [
    { value: 'text', label: 'نص قصير', icon: '📝' },
    { value: 'textarea', label: 'نص طويل', icon: '📄' },
    { value: 'email', label: 'بريد إلكتروني', icon: '✉️' },
    { value: 'phone', label: 'رقم هاتف', icon: '📞' },
    { value: 'number', label: 'رقم', icon: '🔢' },
    { value: 'date', label: 'تاريخ', icon: '📅' },
    { value: 'select', label: 'قائمة منسدلة', icon: '📋' },
    { value: 'radio', label: 'اختيار واحد', icon: '🔘' },
    { value: 'checkbox', label: 'اختيار متعدد', icon: '☑️' }
  ];

  const categories = [
    { value: 'general', label: 'عام' },
    { value: 'feedback', label: 'ملاحظات واقتراحات' },
    { value: 'complaints', label: 'شكاوى' },
    { value: 'services', label: 'طلب خدمات' },
    { value: 'employment', label: 'توظيف' },
    { value: 'surveys', label: 'استطلاعات رأي' }
  ];

  const addField = () => {
    if (!currentField.label.trim()) {
      toast.error('يرجى إدخال عنوان الحقل');
      return;
    }

    // تنظيف الخيارات عند إضافة الحقل
    const cleanedOptions = currentField.options
      ? currentField.options.map(opt => opt.trim()).filter(opt => opt !== '')
      : [];

    const newField: FormField = {
      ...currentField,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      options: cleanedOptions.length > 0 ? cleanedOptions : undefined
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));

    setCurrentField({
      id: '',
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: []
    });
    setIsAddingField(false);
    toast.success('تم إضافة الحقل بنجاح');
  };

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    toast.success('تم حذف الحقل');
  };

  const duplicateField = (field: FormField) => {
    const newField: FormField = {
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      label: `${field.label} (نسخة)`
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    toast.success('تم نسخ الحقل');
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...formData.fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    
    setFormData(prev => ({
      ...prev,
      fields: newFields
    }));
  };

  const handleDragStart = (index: number) => {
    draggedIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex.current !== null) {
      moveField(draggedIndex.current, dropIndex);
      draggedIndex.current = null;
    }
  };

  const saveForm = async () => {
    if (!formData.title.trim()) {
      toast.error('يرجى إدخال عنوان الاستمارة');
      return;
    }

    if (formData.fields.length === 0) {
      toast.error('يرجى إضافة حقل واحد على الأقل');
      return;
    }

    setSaving(true);
    try {
      const response = await apiClient.post('/api/forms/create/', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        is_public: formData.isPublic,
        fields: formData.fields
      });

      toast.success('تم حفظ الاستمارة بنجاح!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error saving form:', error);
      toast.error('حدث خطأ في حفظ الاستمارة');
    } finally {
      setSaving(false);
    }
  };

  const previewForm = () => {
    if (formData.fields.length === 0) {
      toast.error('لا توجد حقول للمعاينة');
      return;
    }
    // يمكن إضافة modal للمعاينة لاحقاً
    toast('سيتم إضافة المعاينة قريباً', {
      icon: 'ℹ️',
      duration: 3000,
    });
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
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🔧</span>
                </div>
                <div className="ml-4">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">منشئ الاستمارات</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">إنشاء استمارات تفاعلية</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button
                onClick={previewForm}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md"
              >
                معاينة
              </button>
              <button
                onClick={saveForm}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-all duration-200 shadow-md flex items-center space-x-2 rtl:space-x-reverse"
              >
                {saving && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>}
                <span>{saving ? 'جاري الحفظ...' : 'حفظ الاستمارة'}</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Settings Panel */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">إعدادات الاستمارة</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عنوان الاستمارة *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="مثال: استمارة تقييم الخدمات"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وصف الاستمارة
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="وصف مختصر عن الغرض من الاستمارة..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    فئة الاستمارة
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    استمارة عامة (متاحة للجميع)
                  </label>
                </div>
              </div>
            </div>

            {/* Field Types Panel */}
            <div className="glass rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">أنواع الحقول</h3>
              <div className="grid grid-cols-1 gap-2">
                {fieldTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setCurrentField(prev => ({ ...prev, type: type.value as any }));
                      setIsAddingField(true);
                    }}
                    className="flex items-center space-x-3 rtl:space-x-reverse p-3 text-left rtl:text-right bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200"
                  >
                    <span className="text-xl">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Builder Area */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">بناء الاستمارة</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.fields.length} حقل
                </div>
              </div>

              {/* Form Preview Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {formData.title || 'عنوان الاستمارة'}
                </h3>
                <p className="text-blue-100">
                  {formData.description || 'وصف الاستمارة سيظهر هنا...'}
                </p>
              </div>

              {/* Fields List */}
              <div className="space-y-4">
                {formData.fields.map((field, index) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-move"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-lg">
                          {fieldTypes.find(t => t.value === field.type)?.icon}
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {field.label}
                        </span>
                        {field.required && (
                          <span className="text-red-500 text-sm">*</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => duplicateField(field)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="نسخ"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeField(field.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Field Preview */}
                    <div className="pl-6">
                      {field.type === 'text' && (
                        <input
                          type="text"
                          placeholder={field.placeholder || 'أدخل النص هنا...'}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                          disabled
                        />
                      )}
                      {field.type === 'textarea' && (
                        <textarea
                          placeholder={field.placeholder || 'أدخل النص هنا...'}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                          rows={3}
                          disabled
                        />
                      )}
                      {field.type === 'select' && (
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" disabled>
                          <option>اختر خياراً...</option>
                          {field.options?.map((option, idx) => (
                            <option key={idx}>{option}</option>
                          ))}
                        </select>
                      )}
                      {field.type === 'radio' && (
                        <div className="space-y-2">
                          {field.options?.map((option, idx) => (
                            <div key={idx} className="flex items-center">
                              <input type="radio" name={field.id} className="ml-2" disabled />
                              <span className="text-gray-700 dark:text-gray-300">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {field.type === 'checkbox' && (
                        <div className="space-y-2">
                          {field.options?.map((option, idx) => (
                            <div key={idx} className="flex items-center">
                              <input type="checkbox" className="ml-2" disabled />
                              <span className="text-gray-700 dark:text-gray-300">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {formData.fields.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ابدأ بإضافة حقول
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      اختر نوع الحقل من الجانب لإضافته للاستمارة
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Field Modal */}
      {isAddingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  إضافة حقل جديد
                </h3>
                <button
                  onClick={() => setIsAddingField(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نوع الحقل
                  </label>
                  <select
                    value={currentField.type}
                    onChange={(e) => setCurrentField(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {fieldTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عنوان الحقل *
                  </label>
                  <input
                    type="text"
                    value={currentField.label}
                    onChange={(e) => setCurrentField(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="مثال: الاسم الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    النص التوضيحي
                  </label>
                  <input
                    type="text"
                    value={currentField.placeholder}
                    onChange={(e) => setCurrentField(prev => ({ ...prev, placeholder: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="أدخل اسمك الكامل..."
                  />
                </div>

                {(currentField.type === 'select' || currentField.type === 'radio' || currentField.type === 'checkbox') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الخيارات (كل خيار في سطر منفصل)
                    </label>
                    <textarea
                      value={currentField.options?.join('\n') || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // لا نقوم بفلترة الخيارات الفارغة في الوقت الفعلي
                        // بل نحتفظ بالنص كما هو لنسمح بإدخال أسطر جديدة
                        setCurrentField(prev => ({ 
                          ...prev, 
                          options: value.split('\n')
                        }));
                      }}
                      onKeyDown={(e) => {
                        // منع إرسال النموذج عند الضغط على Enter
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          addField();
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={4}
                      placeholder="الخيار الأول&#10;الخيار الثاني&#10;الخيار الثالث"
                      style={{ resize: 'vertical', minHeight: '100px' }}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      اضغط Enter لإنشاء سطر جديد وإضافة خيار آخر • اضغط Ctrl+Enter لحفظ الحقل
                    </p>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={currentField.required}
                    onChange={(e) => setCurrentField(prev => ({ ...prev, required: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="required" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    حقل مطلوب
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 rtl:space-x-reverse mt-6">
                <button
                  onClick={addField}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  إضافة الحقل
                </button>
                <button
                  onClick={() => setIsAddingField(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilderPage;
