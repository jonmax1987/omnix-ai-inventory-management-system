'use client';

import { useState } from 'react';
import { authService } from '@/services/auth';
import { productsService } from '@/services/products';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginDemoPage() {
  const [credentials, setCredentials] = useState({
    email: 'demo@omnix-ai.com',
    password: 'Demo123!',
  });
  
  const [loginStatus, setLoginStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setLoginStatus({ type: 'info', message: 'Attempting to login...' });

    try {
      const response = await authService.login(credentials);
      setLoginStatus({
        type: 'success',
        message: `Login successful! Welcome ${response.user.name}`,
      });
      
      // Clear any previous test results
      setTestResults([]);
      
    } catch (error: any) {
      setLoginStatus({
        type: 'error',
        message: error.message || 'Login failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setLoginStatus({
        type: 'info',
        message: 'Logged out successfully',
      });
      setTestResults([]);
    } catch (error: any) {
      setLoginStatus({
        type: 'error',
        message: error.message || 'Logout failed',
      });
    }
  };

  const testAuthenticatedEndpoint = async () => {
    setLoading(true);
    
    try {
      // Test products endpoint with authentication
      const products = await productsService.getProducts({ limit: 5 });
      
      setTestResults(prev => [...prev, {
        endpoint: 'GET /products',
        status: 'success',
        data: products,
        timestamp: new Date().toISOString(),
      }]);
      
    } catch (error: any) {
      setTestResults(prev => [...prev, {
        endpoint: 'GET /products',
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OMNIX AI - Authentication Demo
          </h1>
          <p className="text-gray-600">
            Demonstrate login, authentication, and protected API calls
          </p>
        </div>

        {/* Authentication Status */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          
          {isAuthenticated && currentUser ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Authenticated
                </span>
                <span className="text-sm text-gray-600">
                  Logged in as: <strong>{currentUser.email}</strong>
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                <div>Name: {currentUser.name}</div>
                <div>Role: {currentUser.role}</div>
                <div>User ID: {currentUser.id}</div>
              </div>
              
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  ❌ Not Authenticated
                </span>
                <span className="text-sm text-gray-600">
                  Please log in to access protected endpoints
                </span>
              </div>

              {/* Login Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                </div>
                
                <Button onClick={handleLogin} disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Status Messages */}
        {loginStatus.type && (
          <Card className={`mb-6 p-4 border-l-4 ${
            loginStatus.type === 'success' ? 'border-l-green-400 bg-green-50' :
            loginStatus.type === 'error' ? 'border-l-red-400 bg-red-50' :
            'border-l-blue-400 bg-blue-50'
          }`}>
            <p className={`text-sm ${
              loginStatus.type === 'success' ? 'text-green-700' :
              loginStatus.type === 'error' ? 'text-red-700' :
              'text-blue-700'
            }`}>
              {loginStatus.message}
            </p>
          </Card>
        )}

        {/* Authenticated API Tests */}
        {isAuthenticated && (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">Test Protected Endpoints</h2>
            <p className="text-gray-600 mb-4">
              These endpoints require authentication. Try them now that you're logged in!
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={testAuthenticatedEndpoint}
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test GET /products'}
              </Button>
              
              <div className="text-sm text-gray-600">
                <p>This will test:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Automatic JWT token inclusion in headers</li>
                  <li>Token refresh if needed</li>
                  <li>Proper error handling</li>
                  <li>Real backend communication</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className={`p-3 rounded border-l-4 ${
                  result.status === 'success' 
                    ? 'border-l-green-400 bg-green-50' 
                    : 'border-l-red-400 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{result.endpoint}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {result.status === 'success' ? (
                    <details>
                      <summary className="text-sm text-green-700 cursor-pointer">
                        ✅ Success - View response data
                      </summary>
                      <pre className="mt-2 text-xs bg-white p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  ) : (
                    <p className="text-sm text-red-700">
                      ❌ Error: {result.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6 p-6 bg-blue-50">
          <h3 className="font-semibold text-blue-900 mb-2">How Frontend ↔ Backend Communication Works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>1. Environment Setup:</strong> API URL configured in .env files</li>
            <li><strong>2. API Service:</strong> Central apiRequest function handles all HTTP calls</li>
            <li><strong>3. Authentication:</strong> JWT tokens stored in localStorage</li>
            <li><strong>4. Automatic Headers:</strong> Auth service adds Bearer tokens automatically</li>
            <li><strong>5. Error Handling:</strong> Automatic token refresh on 401 errors</li>
            <li><strong>6. TypeScript:</strong> Full type safety for all API responses</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}