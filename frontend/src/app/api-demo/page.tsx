'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://18sz01wxsi.execute-api.eu-central-1.amazonaws.com/dev/v1';

interface ApiResponse {
  endpoint: string;
  status: number;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export default function ApiDemoPage() {
  const [responses, setResponses] = useState<ApiResponse[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const addResponse = (response: ApiResponse) => {
    setResponses(prev => [response, ...prev.slice(0, 9)]); // Keep last 10 responses
  };

  const testEndpoint = async (endpoint: string, options: RequestInit = {}) => {
    setLoading(endpoint);
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      addResponse({
        endpoint,
        status: response.status,
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data.message || 'Unknown error' : undefined,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      addResponse({
        endpoint,
        status: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(null);
    }
  };

  const endpoints = [
    {
      name: 'Health Check',
      endpoint: '/system/health',
      description: 'Check backend health status',
      method: 'GET',
      requiresAuth: false,
    },
    {
      name: 'System Status',
      endpoint: '/system/status',
      description: 'Get detailed system status',
      method: 'GET',
      requiresAuth: false,
    },
    {
      name: 'Products List',
      endpoint: '/products',
      description: 'Get all products (requires auth)',
      method: 'GET',
      requiresAuth: true,
    },
    {
      name: 'Dashboard Summary',
      endpoint: '/dashboard/summary',
      description: 'Get dashboard metrics (requires auth)',
      method: 'GET',
      requiresAuth: true,
    },
    {
      name: 'Alerts',
      endpoint: '/alerts',
      description: 'Get active alerts (requires auth)',
      method: 'GET',
      requiresAuth: true,
    },
    {
      name: 'Forecasts',
      endpoint: '/forecasts',
      description: 'Get demand forecasts (requires auth)',
      method: 'GET',
      requiresAuth: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OMNIX AI - Frontend ↔ Backend API Demo
          </h1>
          <p className="text-gray-600 mb-4">
            Test communication between frontend and backend services
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">API URL:</span> {API_URL}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              🔒 Endpoints marked with auth will return 401 (expected behavior)
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {endpoints.map((ep) => (
            <Card key={ep.endpoint} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{ep.name}</h3>
                {ep.requiresAuth && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Auth Required
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{ep.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {ep.method} {ep.endpoint}
                </span>
                <Button
                  onClick={() => testEndpoint(ep.endpoint)}
                  disabled={loading === ep.endpoint}
                  size="sm"
                >
                  {loading === ep.endpoint ? 'Testing...' : 'Test'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Response History */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            API Response History
          </h2>
          
          {responses.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">
                Click "Test" on any endpoint above to see responses here
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {responses.map((response, index) => (
                <Card key={index} className={`p-4 border-l-4 ${
                  response.success 
                    ? 'border-l-green-400 bg-green-50' 
                    : response.status === 401
                    ? 'border-l-orange-400 bg-orange-50'
                    : 'border-l-red-400 bg-red-50'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        response.success 
                          ? 'bg-green-100 text-green-800'
                          : response.status === 401
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {response.status === 401 ? '🔒 Auth Required' : 
                         response.success ? '✅ Success' : '❌ Error'}
                      </span>
                      <span className="font-mono text-sm">{response.status}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(response.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {response.endpoint}
                    </span>
                  </div>

                  {response.error && (
                    <div className="mb-2">
                      <span className="text-sm text-red-700 font-medium">Error: </span>
                      <span className="text-sm text-red-600">{response.error}</span>
                    </div>
                  )}

                  {response.data && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                        View Response Data
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}