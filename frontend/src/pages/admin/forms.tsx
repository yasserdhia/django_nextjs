import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// TypeScript declaration for jsPDF autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface GovernmentEntity {
  id: number;
  entity_name: string;
  entity_type: string;
  governorate: string;
  phone_number: string;
  email: string;
  manager_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CitizenFeedback {
  id: number;
  feedback_type: string;
  full_name: string;
  phone_number: string;
  email: string;
  subject: string;
  priority: string;
  related_entity: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const FormsAdminPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'government' | 'citizen'>('government');
  const [governmentEntities, setGovernmentEntities] = useState<GovernmentEntity[]>([]);
  const [citizenFeedback, setCitizenFeedback] = useState<CitizenFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGovernmentEntities: 0,
    totalCitizenFeedback: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [entitiesResponse, feedbackResponse, dashboardResponse] = await Promise.all([
        apiClient.get('/api/forms/government-entities/'),
        apiClient.get('/api/forms/citizen-feedback/'),
        apiClient.get('/api/forms/dashboard/stats/')
      ]);

      setGovernmentEntities(entitiesResponse.data);
      setCitizenFeedback(feedbackResponse.data);
      
      // تحويل البيانات من API إلى الشكل المتوقع
      const statsData = dashboardResponse.data;
      setStats({
        totalGovernmentEntities: statsData.government_entities.total_entities,
        totalCitizenFeedback: statsData.citizen_feedback.total_feedback,
        pendingApproval: statsData.government_entities.pending_entities,
        approved: statsData.government_entities.approved_entities,
        rejected: 0 // لا يوجد حالة مرفوضة في API
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (type: 'government' | 'citizen', id: number, status: string) => {
    try {
      const endpoint = type === 'government' 
        ? `/api/forms/government-entities/${id}/`
        : `/api/forms/citizen-feedback/${id}/`;

      await apiClient.patch(endpoint, { status });

      toast.success('تم تحديث الحالة بنجاح');
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('حدث خطأ في تحديث الحالة');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'approved': return 'موافق عليه';
      case 'rejected': return 'مرفوض';
      default: return 'غير محدد';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'غير محدد';
    }
  };

  // Export functions
  const exportToExcel = (data: any[], filename: string, headers: string[]) => {
    try {
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      
      // Prepare data with headers - use Arabic keys for better formatting
      const worksheetData = [
        headers,
        ...data.map(item => Object.values(item))
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Calculate column widths based on content
      const colWidths = headers.map((header, index) => {
        const headerLength = header.length;
        const maxDataLength = Math.max(...data.map(row => {
          const value = Object.values(row)[index];
          return value ? String(value).length : 0;
        }));
        return { wch: Math.max(headerLength + 2, maxDataLength + 2, 12) };
      });
      worksheet['!cols'] = colWidths;
      
      // Get range for styling
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      
      // Style the header row with beautiful formatting
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) continue;
        
        worksheet[cellAddress].s = {
          font: { 
            bold: true, 
            color: { rgb: "FFFFFF" },
            size: 12
          },
          fill: { 
            fgColor: { rgb: "4F46E5" } 
          },
          alignment: { 
            horizontal: "center", 
            vertical: "center",
            wrapText: true
          },
          border: {
            top: { style: "medium", color: { rgb: "000000" } },
            bottom: { style: "medium", color: { rgb: "000000" } },
            left: { style: "medium", color: { rgb: "000000" } },
            right: { style: "medium", color: { rgb: "000000" } }
          }
        };
      }
      
      // Style data rows with alternating colors
      for (let row = 1; row <= data.length; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!worksheet[cellAddress]) continue;
          
          const isEvenRow = row % 2 === 0;
          worksheet[cellAddress].s = {
            alignment: { 
              horizontal: "center", 
              vertical: "center",
              wrapText: true
            },
            border: {
              top: { style: "thin", color: { rgb: "D1D5DB" } },
              bottom: { style: "thin", color: { rgb: "D1D5DB" } },
              left: { style: "thin", color: { rgb: "D1D5DB" } },
              right: { style: "thin", color: { rgb: "D1D5DB" } }
            },
            fill: { 
              fgColor: { 
                rgb: isEvenRow ? "F3F4F6" : "FFFFFF" 
              } 
            },
            font: {
              size: 11,
              color: { rgb: "374151" }
            }
          };
        }
      }
      
      // Set row heights
      const rowHeights = [];
      for (let i = 0; i <= data.length; i++) {
        rowHeights[i] = { hpx: i === 0 ? 25 : 20 }; // Header row taller
      }
      worksheet['!rows'] = rowHeights;
      
      // Add the worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'البيانات');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}_${timestamp}.xlsx`;
      
      // Save the file
      XLSX.writeFile(workbook, fullFilename);
      toast.success('تم تصدير البيانات إلى Excel بنجاح');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('حدث خطأ في تصدير البيانات إلى Excel');
    }
  };

  const exportToPDF = (data: any[], filename: string, headers: string[], title: string) => {
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      
      // Add current date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('ar-EG');
      doc.text(`تاريخ التقرير: ${currentDate}`, doc.internal.pageSize.getWidth() - 20, 30, { align: 'right' });
      
      // Prepare data for the table
      const tableData = data.map(item => {
        if (activeTab === 'government') {
          return [
            item.entity_name || '',
            item.entity_type || '',
            item.governorate || '',
            item.manager_name || '',
            item.email || '',
            item.phone_number || '',
            getStatusText(item.status) || '',
            new Date(item.created_at).toLocaleDateString('ar-EG') || ''
          ];
        } else {
          return [
            item.subject || '',
            item.feedback_type || '',
            item.full_name || '',
            item.email || '',
            item.related_entity || '',
            getPriorityText(item.priority) || '',
            getStatusText(item.status) || '',
            new Date(item.created_at).toLocaleDateString('ar-EG') || ''
          ];
        }
      });

      // Create table with autoTable using the imported function
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 40,
        theme: 'striped',
        styles: { 
          fontSize: 8,
          halign: 'center',
          cellPadding: 3,
          lineColor: [128, 128, 128],
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [79, 70, 229],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: { 
          fillColor: [249, 250, 251] 
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
          6: { cellWidth: 15 },
          7: { cellWidth: 20 }
        },
        margin: { top: 40, left: 10, right: 10 },
        tableLineColor: [128, 128, 128],
        tableLineWidth: 0.1,
        showHead: 'everyPage'
      });

      // Add footer with page numbers
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `الصفحة ${i} من ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}_${timestamp}.pdf`;
      
      // Save the file
      doc.save(fullFilename);
      toast.success('تم تصدير البيانات إلى PDF بنجاح');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('حدث خطأ في تصدير البيانات إلى PDF');
    }
  };

  const handleExportGovernmentEntities = (format: 'excel' | 'pdf') => {
    const headers = [
      'اسم الجهة',
      'نوع الجهة', 
      'المحافظة',
      'اسم المسؤول',
      'البريد الإلكتروني',
      'رقم الهاتف',
      'الحالة',
      'تاريخ التسجيل'
    ];

    const data = governmentEntities.map(entity => ({
      'اسم الجهة': entity.entity_name || 'غير محدد',
      'نوع الجهة': entity.entity_type || 'غير محدد',
      'المحافظة': entity.governorate || 'غير محدد',
      'اسم المسؤول': entity.manager_name || 'غير محدد',
      'البريد الإلكتروني': entity.email || 'غير محدد',
      'رقم الهاتف': entity.phone_number || 'غير محدد',
      'الحالة': getStatusText(entity.status),
      'تاريخ التسجيل': new Date(entity.created_at).toLocaleDateString('ar-EG')
    }));

    if (format === 'excel') {
      exportToExcel(data, 'الجهات_الحكومية', headers);
    } else {
      exportToPDF(governmentEntities, 'الجهات_الحكومية', headers, 'تقرير الجهات الحكومية');
    }
  };

  const handleExportCitizenFeedback = (format: 'excel' | 'pdf') => {
    const headers = [
      'الموضوع',
      'نوع الطلب',
      'اسم المواطن',
      'البريد الإلكتروني',
      'الجهة المعنية',
      'الأولوية',
      'الحالة',
      'تاريخ الإرسال'
    ];

    const data = citizenFeedback.map(feedback => ({
      'الموضوع': feedback.subject || 'غير محدد',
      'نوع الطلب': feedback.feedback_type || 'غير محدد',
      'اسم المواطن': feedback.full_name || 'غير محدد',
      'البريد الإلكتروني': feedback.email || 'غير محدد',
      'الجهة المعنية': feedback.related_entity || 'غير محدد',
      'الأولوية': getPriorityText(feedback.priority),
      'الحالة': getStatusText(feedback.status),
      'تاريخ الإرسال': new Date(feedback.created_at).toLocaleDateString('ar-EG')
    }));

    if (format === 'excel') {
      exportToExcel(data, 'اقتراحات_المواطنين', headers);
    } else {
      exportToPDF(citizenFeedback, 'اقتراحات_المواطنين', headers, 'تقرير اقتراحات وشكاوى المواطنين');
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
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 dark:bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">إ</span>
                </div>
                <div className="ml-4">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">إدارة الاستمارات</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">الأمانة العامة لمجلس الوزراء</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <ThemeToggle />
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الجهات الحكومية</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGovernmentEntities}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🏛️</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">اقتراحات المواطنين</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCitizenFeedback}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💬</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">قيد المراجعة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingApproval}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">موافق عليها</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">مرفوضة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">❌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex space-x-1 rtl:space-x-reverse bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('government')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'government'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                الجهات الحكومية ({governmentEntities.length})
              </button>
              <button
                onClick={() => setActiveTab('citizen')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'citizen'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                اقتراحات المواطنين ({citizenFeedback.length})
              </button>
            </div>
            
            {/* Export Buttons */}
            <div className="flex space-x-2 rtl:space-x-reverse">
              <div className="flex items-center space-x-1 rtl:space-x-reverse bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => activeTab === 'government' ? handleExportGovernmentEntities('excel') : handleExportCitizenFeedback('excel')}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>تصدير Excel</span>
                </button>
                
                <button
                  onClick={() => activeTab === 'government' ? handleExportGovernmentEntities('pdf') : handleExportCitizenFeedback('pdf')}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>تصدير PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-6 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'government' ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">استمارات الجهات الحكومية</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            اسم الجهة
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            النوع
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            المحافظة
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            المسؤول
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            الحالة
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {governmentEntities.map((entity) => (
                          <tr key={entity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {entity.entity_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {entity.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {entity.entity_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {entity.governorate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {entity.manager_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {entity.phone_number}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entity.status)}`}>
                                {getStatusText(entity.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2 rtl:space-x-reverse">
                                <button
                                  onClick={() => handleStatusChange('government', entity.id, 'approved')}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                >
                                  موافقة
                                </button>
                                <button
                                  onClick={() => handleStatusChange('government', entity.id, 'rejected')}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  رفض
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">اقتراحات وشكاوى المواطنين</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            الموضوع
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            النوع
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            المواطن
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            الجهة المعنية
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            الأولوية
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            الحالة
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {citizenFeedback.map((feedback) => (
                          <tr key={feedback.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {feedback.subject}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(feedback.created_at).toLocaleDateString('ar-EG')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {feedback.feedback_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {feedback.full_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {feedback.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {feedback.related_entity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(feedback.priority)}`}>
                                {getPriorityText(feedback.priority)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                                {getStatusText(feedback.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2 rtl:space-x-reverse">
                                <button
                                  onClick={() => handleStatusChange('citizen', feedback.id, 'approved')}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                >
                                  موافقة
                                </button>
                                <button
                                  onClick={() => handleStatusChange('citizen', feedback.id, 'rejected')}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  رفض
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FormsAdminPage;
