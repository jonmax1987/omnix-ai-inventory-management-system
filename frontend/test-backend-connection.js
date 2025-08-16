/**
 * OMNIX AI - Backend Connection Test Script
 * 
 * This script tests the connection to your deployed backend.
 * Run this in your frontend project to verify everything works.
 * 
 * Usage:
 * 1. Save this file in your frontend project
 * 2. Run: node test-backend-connection.js
 */

const API_BASE_URL = 'https://8r85mpuvt3.execute-api.eu-central-1.amazonaws.com/dev';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

console.log(`${colors.blue}${colors.bold}
╔═══════════════════════════════════════════════════╗
║     OMNIX AI - Backend Connection Test           ║
╚═══════════════════════════════════════════════════╝
${colors.reset}`);

console.log(`API URL: ${colors.yellow}${API_BASE_URL}${colors.reset}\n`);

// Test endpoints
const endpoints = [
  { path: '/v1/products', method: 'GET', name: 'Products API' },
  { path: '/v1/dashboard/summary', method: 'GET', name: 'Dashboard Summary' },
  { path: '/v1/alerts', method: 'GET', name: 'Alerts API' },
  { path: '/v1/forecasts/demand', method: 'GET', name: 'Forecasts API' },
  { path: '/v1/recommendations', method: 'GET', name: 'Recommendations API' },
];

async function testEndpoint(endpoint) {
  const url = `${API_BASE_URL}${endpoint.path}`;
  
  try {
    const response = await fetch(url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✅ ${endpoint.name}${colors.reset}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
      return true;
    } else {
      console.log(`${colors.red}❌ ${endpoint.name}${colors.reset}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ ${endpoint.name}${colors.reset}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log(`${colors.bold}Testing API Endpoints:${colors.reset}\n`);
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) successCount++;
    console.log('');
  }
  
  // Summary
  console.log(`${colors.bold}═══════════════════════════════════════════════════${colors.reset}`);
  
  if (successCount === endpoints.length) {
    console.log(`${colors.green}${colors.bold}🎉 ALL TESTS PASSED! (${successCount}/${endpoints.length})${colors.reset}`);
    console.log(`${colors.green}Your backend is fully operational!${colors.reset}`);
    
    console.log(`\n${colors.blue}Next Steps:${colors.reset}`);
    console.log('1. Add to your .env.local:');
    console.log(`   ${colors.yellow}NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}${colors.reset}`);
    console.log('2. Update your /src/services/api.ts with the new URL');
    console.log('3. Start building your frontend features!');
  } else {
    console.log(`${colors.yellow}⚠️  Some tests failed (${successCount}/${endpoints.length})${colors.reset}`);
    console.log('Please check the errors above and verify your backend deployment.');
  }
  
  console.log(`\n${colors.blue}Environment Variable for Frontend:${colors.reset}`);
  console.log(`${colors.yellow}NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}${colors.reset}`);
}

// Check if fetch is available (Node.js 18+ or browser)
if (typeof fetch === 'undefined') {
  console.log(`${colors.yellow}Note: This script requires Node.js 18+ or run it in the browser console.${colors.reset}`);
  console.log('For older Node.js versions, install node-fetch:');
  console.log('  npm install node-fetch');
  console.log('Then add at the top of this file:');
  console.log("  const fetch = require('node-fetch');");
} else {
  runTests().catch(console.error);
}