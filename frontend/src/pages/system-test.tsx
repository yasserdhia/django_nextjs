import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import { useRouter } from 'next/router';

const SystemTestPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [tests, setTests] = useState({
    backend: { status: 'pending', message: '' },
    auth: { status: 'pending', message: '' },
    database: { status: 'pending', message: '' },
    forms: { status: 'pending', message: '' }
  });

  useEffect(() => {
    const runInitialTests = async () => {
      // Test 1: Backend connection
      try {
        const response = await apiClient.get('/api/auth/users/me/');
        setTests(prev => ({
          ...prev,
          backend: { status: 'success', message: 'Backend connection successful' }
        }));
      } catch (error) {
        setTests(prev => ({
          ...prev,
          backend: { status: 'error', message: `Backend connection failed: ${error}` }
        }));
      }

      // Test 2: Authentication
      if (user) {
        setTests(prev => ({
          ...prev,
          auth: { status: 'success', message: `Authenticated as: ${user.email}` }
        }));
      } else {
        setTests(prev => ({
          ...prev,
          auth: { status: 'error', message: 'Not authenticated' }
        }));
      }

      // Test 3: Database connection (try to fetch forms)
      try {
        const response = await apiClient.get('/api/forms/public/');
        setTests(prev => ({
          ...prev,
          database: { status: 'success', message: `Database accessible, found ${response.data.length} public forms` }
        }));
      } catch (error) {
        setTests(prev => ({
          ...prev,
          database: { status: 'error', message: `Database connection failed: ${error}` }
        }));
      }

      // Test 4: Forms API
      try {
        const response = await apiClient.get('/api/forms/manage/');
        setTests(prev => ({
          ...prev,
          forms: { status: 'success', message: `Forms API working, found ${response.data.length} user forms` }
        }));
      } catch (error) {
        setTests(prev => ({
          ...prev,
          forms: { status: 'error', message: `Forms API failed: ${error}` }
        }));
      }
    };

    runInitialTests();
  }, [user]);

  const runTests = async () => {
    // Test 1: Backend connection
    try {
      const response = await apiClient.get('/api/auth/users/me/');
      setTests(prev => ({
        ...prev,
        backend: { status: 'success', message: 'Backend connection successful' }
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        backend: { status: 'error', message: `Backend connection failed: ${error}` }
      }));
    }

    // Test 2: Authentication
    if (user) {
      setTests(prev => ({
        ...prev,
        auth: { status: 'success', message: `Authenticated as: ${user.email}` }
      }));
    } else {
      setTests(prev => ({
        ...prev,
        auth: { status: 'error', message: 'Not authenticated' }
      }));
    }

    // Test 3: Database connection (try to fetch forms)
    try {
      const response = await apiClient.get('/api/forms/public/');
      setTests(prev => ({
        ...prev,
        database: { status: 'success', message: `Database accessible, found ${response.data.length} public forms` }
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        database: { status: 'error', message: `Database connection failed: ${error}` }
      }));
    }

    // Test 4: Forms API
    try {
      const response = await apiClient.get('/api/forms/manage/');
      setTests(prev => ({
        ...prev,
        forms: { status: 'success', message: `Forms API working, found ${response.data.length} user forms` }
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        forms: { status: 'error', message: `Forms API failed: ${error}` }
      }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              System Test & Diagnostics
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(tests).map(([testName, result]) => (
              <div key={testName} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(result.status)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                      {testName} Test
                    </h3>
                    <p className={`text-sm ${getStatusColor(result.status)}`}>
                      {result.message || 'Running test...'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Next Steps:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• If backend connection fails: Start Django server with `python manage.py runserver`</li>
              <li>• If authentication fails: Try logging in again</li>
              <li>• If database fails: Check Django migrations with `python manage.py migrate`</li>
              <li>• If forms API fails: Check custom_forms app configuration</li>
            </ul>
          </div>

          <div className="mt-4 flex space-x-4">
            <button
              onClick={runTests}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Run Tests Again
            </button>
            <button
              onClick={() => router.push('/admin/form-builder')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Go to Form Builder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemTestPage;
