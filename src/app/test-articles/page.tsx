'use client';

import { useState } from 'react';

export default function TestArticlesPage() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const testCreateCategory = async () => {
    try {
      const response = await fetch('/api/article-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Technology',
          slug: 'technology',
          description: 'Technology related articles',
          isActive: true,
          sortOrder: 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Category created successfully!');
        setMessageType('success');
      } else {
        setMessage(`Failed to create category: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error creating category');
      setMessageType('error');
    }
  };

  const testCreateArticle = async () => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Sample Article',
          slug: 'sample-article',
          content: 'This is a sample article content for testing purposes.',
          excerpt: 'A sample article for testing',
          featuredImage: 'https://example.com/image.jpg',
          category: '66dcce14799b8c9772b6c9db', // This might need to be updated
          tags: ['test', 'sample'],
          status: 'draft',
          author: 'Test Author',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Article created successfully! ID: ${data._id}`);
        setMessageType('success');
      } else {
        setMessage(`Failed to create article: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error creating article');
      setMessageType('error');
    }
  };

  const testGetArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();

      if (response.ok) {
        setMessage(`Found ${data.articles?.length || 0} articles`);
        setMessageType('success');
        console.log('Articles:', data.articles);
      } else {
        setMessage(`Failed to get articles: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error getting articles');
      setMessageType('error');
    }
  };

  const testGetCategories = async () => {
    try {
      const response = await fetch('/api/article-categories');
      const data = await response.json();

      if (response.ok) {
        setMessage(`Found ${data.categories?.length || 0} categories`);
        setMessageType('success');
        console.log('Categories:', data.categories);
      } else {
        setMessage(`Failed to get categories: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error getting categories');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Articles System</h1>
        
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
          <h2 className="text-xl font-semibold mb-4">Test Functions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={testGetCategories}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Get Categories
            </button>
            <button
              onClick={testCreateCategory}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Test Create Category
            </button>
            <button
              onClick={testGetArticles}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Get Articles
            </button>
            <button
              onClick={testCreateArticle}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Test Create Article
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
          </div>
        </div>
      </div>
    </div>
  );
}
