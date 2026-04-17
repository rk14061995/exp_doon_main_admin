'use client';

import { useState } from 'react';

export default function TestDBPage() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const testDirectDB = async () => {
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();

      if (response.ok) {
        setMessage(`Database test successful! Found ${data.totalCategories} categories and ${data.totalArticles} articles`);
        setMessageType('success');
        console.log('Database data:', data);
      } else {
        setMessage(`Database test failed: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error testing database');
      setMessageType('error');
    }
  };

  const testCategoriesAPI = async () => {
    try {
      const response = await fetch('/api/article-categories');
      const data = await response.json();

      if (response.ok) {
        setMessage(`Categories API returned ${data.categories?.length || 0} categories`);
        setMessageType('success');
        console.log('Categories API data:', data);
      } else {
        setMessage(`Categories API failed: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error calling categories API');
      setMessageType('error');
    }
  };

  const testCategoriesSimple = async () => {
    try {
      const response = await fetch('/api/test-categories-simple');
      const data = await response.json();

      if (response.ok) {
        setMessage(`Simple test: Found ${data.count} categories in ${data.collection}`);
        setMessageType('success');
        console.log('Simple test data:', data);
      } else {
        setMessage(`Simple test failed: ${data.error}`);
        setMessageType('error');
        console.log('Simple test error:', data);
      }
    } catch (error) {
      setMessage('Error calling simple test');
      setMessageType('error');
    }
  };

  const testArticlesAPI = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();

      if (response.ok) {
        setMessage(`Articles API returned ${data.articles?.length || 0} articles`);
        setMessageType('success');
        console.log('Articles API data:', data);
      } else {
        setMessage(`Articles API failed: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error calling articles API');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Test</h1>
        
        {message && (
          <div className={`p-4 rounded-md mb-6 ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Database Tests</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={testDirectDB}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Direct Database Connection
            </button>
            <button
              onClick={testCategoriesSimple}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Test Categories (Simple)
            </button>
            <button
              onClick={testCategoriesAPI}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Test Categories API
            </button>
            <button
              onClick={testArticlesAPI}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Articles API
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="space-y-2">
            <a href="/admin/articles" className="block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Go to Articles Management
            </a>
            <a href="/admin/categories" className="block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Go to Categories Management
            </a>
            <a href="/test-articles" className="block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Go to Articles Test
            </a>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Debug Instructions</h3>
          <p className="text-yellow-700 text-sm">
            1. Open browser developer tools (F12)<br/>
            2. Go to Console tab<br/>
            3. Click the test buttons above<br/>
            4. Check the console for detailed logs<br/>
            5. Look for API responses and database counts
          </p>
        </div>
      </div>
    </div>
  );
}
