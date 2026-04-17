'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestLoginPage() {
  const [message, setMessage] = useState('');
  const [authStatus, setAuthStatus] = useState('Checking...');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`Authenticated as: ${data.admin.email}`);
        setAuthStatus('Authenticated');
      } else {
        setMessage('Not authenticated');
        setAuthStatus('Not Authenticated');
      }
    } catch (error) {
      setMessage('Error checking auth');
      setAuthStatus('Error');
    }
  };

  const testLogin = async () => {
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
        setMessage(`Login successful! Admin: ${data.admin.email}`);
        setAuthStatus('Authenticated');
        // Check auth again after login
        setTimeout(checkAuth, 200);
      } else {
        setMessage(`Login failed: ${data.error}`);
        setAuthStatus('Login Failed');
      }
    } catch (error) {
      setMessage('Login error occurred');
      setAuthStatus('Error');
    }
  };

  const goToDashboard = () => {
    router.push('/admin/dashboard');
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Login Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {authStatus}</p>
            <p><strong>Message:</strong> {message}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <button
              onClick={testLogin}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Test Login
            </button>
            <button
              onClick={checkAuth}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
            >
              Check Auth Status
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="space-y-2">
            <button
              onClick={goToDashboard}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={goToLogin}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 ml-2"
            >
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
