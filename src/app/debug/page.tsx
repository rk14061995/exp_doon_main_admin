'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const testDatabase = async () => {
    setLoading(true);
    setMessage('');

    try {
      // First test database connection
      const testResponse = await fetch('/api/test');
      const testData = await testResponse.json();
      
      if (testResponse.status !== 200) {
        setMessage(`Database connection failed: ${testData.message}`);
        setMessageType('error');
        return;
      }

      setMessage(`Database OK. Found ${testData.adminCount} admin users.`);
      setMessageType('success');

      // If no admin users, create one
      if (testData.adminCount === 0) {
        const response = await fetch('/api/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@example.com',
            password: 'admin123',
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('Database OK. Admin user created successfully! You can now login.');
          setMessageType('success');
        } else {
          setMessage(`Database OK but failed to create admin: ${data.error}`);
          setMessageType('error');
        }
      } else {
        setMessage(`Database OK. Admin user already exists: ${testData.adminUsers[0]?.email}`);
        setMessageType('success');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/test');
      const data = await response.json();

      if (response.ok) {
        setMessage(`Database connection successful! Found ${data.adminCount} admin users.`);
        setMessageType('success');
      } else {
        setMessage(`Database connection failed: ${data.message}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Database test error occurred.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin123',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login test successful! Token created. You can now login normally.');
        setMessageType('success');
      } else {
        setMessage(`Login failed: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Login test error occurred.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Admin Panel</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Database & Authentication Test</h2>
          
          {message && (
            <div className={`p-4 rounded-md mb-4 ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Step 1: Test Database Connection</h3>
              <p className="text-sm text-gray-600 mb-3">
                Check if the database connection is working and see existing admin users
              </p>
              <button
                onClick={testConnection}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Connection'}
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Step 2: Create Admin User</h3>
              <p className="text-sm text-gray-600 mb-3">
                This will create an admin user with email: admin@example.com, password: admin123
              </p>
              <button
                onClick={testDatabase}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Admin User'}
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Step 3: Test Login</h3>
              <p className="text-sm text-gray-600 mb-3">
                Test the login functionality with the created admin user
              </p>
              <button
                onClick={testLogin}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Login'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <p><strong>MONGODB_URI:</strong> {process.env.NEXT_PUBLIC_MONGODB_URI ? 'Set' : 'Not set (hidden for security)'}</p>
            <p><strong>JWT_SECRET:</strong> {process.env.NEXT_PUBLIC_JWT_SECRET ? 'Set' : 'Not set (hidden for security)'}</p>
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'development'}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/login" 
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  );
}
