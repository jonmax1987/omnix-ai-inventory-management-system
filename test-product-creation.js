#!/usr/bin/env node

const https = require('https');

// Test configuration
const API_URLS = {
  old: 'https://18sz01wxsi.execute-api.eu-central-1.amazonaws.com/dev/v1',
  new: 'https://8r85mpuvt3.execute-api.eu-central-1.amazonaws.com/dev'
};

// Test credentials
const testCredentials = {
  email: 'manager@omnix.ai',
  password: 'Manager123!'
};

// Test product data
const testProduct = {
  name: 'Test Product ' + Date.now(),
  sku: 'TEST-SKU-' + Date.now(),
  category: 'Electronics',
  quantity: 50,
  minThreshold: 10,
  price: 99.99,
  cost: 70.00,
  supplier: 'Test Supplier',
  description: 'Test product created via API',
  unit: 'pieces'
};

function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    if (data) {
      reqOptions.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = https.request(reqOptions, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPIEndpoint(apiName, baseUrl) {
  console.log(`\n========== Testing ${apiName} API ==========`);
  console.log(`Base URL: ${baseUrl}`);
  
  try {
    // Step 1: Login to get access token
    console.log('\n1. Attempting login...');
    const loginResponse = await makeRequest(`${baseUrl}/auth/login`, {
      method: 'POST'
    }, testCredentials);
    
    console.log(`   Login response status: ${loginResponse.status}`);
    
    if (loginResponse.status !== 200 && loginResponse.status !== 201) {
      console.log('   ❌ Login failed:', JSON.stringify(loginResponse.data, null, 2));
      return false;
    }
    
    const accessToken = loginResponse.data.data?.accessToken;
    if (!accessToken) {
      console.log('   ❌ No access token received');
      return false;
    }
    
    console.log('   ✅ Login successful, received access token');
    
    // Step 2: Get current products list
    console.log('\n2. Fetching current products...');
    const getProductsResponse = await makeRequest(`${baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log(`   Get products response status: ${getProductsResponse.status}`);
    
    if (getProductsResponse.status !== 200) {
      console.log('   ❌ Failed to fetch products:', JSON.stringify(getProductsResponse.data, null, 2));
      return false;
    }
    
    const initialProductCount = getProductsResponse.data.data?.length || 0;
    console.log(`   ✅ Current product count: ${initialProductCount}`);
    
    // Step 3: Create a new product
    console.log('\n3. Creating new product...');
    console.log('   Product data:', JSON.stringify(testProduct, null, 2));
    
    const createProductResponse = await makeRequest(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }, testProduct);
    
    console.log(`   Create product response status: ${createProductResponse.status}`);
    
    if (createProductResponse.status !== 200 && createProductResponse.status !== 201) {
      console.log('   ❌ Failed to create product:', JSON.stringify(createProductResponse.data, null, 2));
      return false;
    }
    
    const createdProduct = createProductResponse.data.data;
    console.log('   ✅ Product created successfully');
    console.log('   Created product ID:', createdProduct?.id);
    console.log('   Created product name:', createdProduct?.name);
    
    // Step 4: Verify product was added
    console.log('\n4. Verifying product was added to database...');
    const verifyResponse = await makeRequest(`${baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const newProductCount = verifyResponse.data.data?.length || 0;
    console.log(`   New product count: ${newProductCount}`);
    
    if (newProductCount > initialProductCount) {
      console.log('   ✅ Product successfully added to database!');
      
      // Find the newly created product
      const newProduct = verifyResponse.data.data.find(p => p.id === createdProduct?.id);
      if (newProduct) {
        console.log('   ✅ Newly created product found in database:');
        console.log(`      - Name: ${newProduct.name}`);
        console.log(`      - SKU: ${newProduct.sku}`);
        console.log(`      - Quantity: ${newProduct.quantity}`);
      }
      
      return true;
    } else {
      console.log('   ❌ Product count did not increase (expected > ${initialProductCount}, got ${newProductCount})');
      return false;
    }
    
  } catch (error) {
    console.log(`\n❌ Error testing ${apiName} API:`, error.message);
    return false;
  }
}

async function main() {
  console.log('OMNIX AI - Product Creation Test');
  console.log('=================================');
  
  // Test the old API endpoint
  const oldApiWorks = await testAPIEndpoint('Old', API_URLS.old);
  
  // Test the new API endpoint  
  const newApiWorks = await testAPIEndpoint('New', API_URLS.new);
  
  // Summary
  console.log('\n\n========== TEST SUMMARY ==========');
  console.log(`Old API (18sz01wxsi): ${oldApiWorks ? '✅ WORKING' : '❌ NOT WORKING'}`);
  console.log(`New API (8r85mpuvt3): ${newApiWorks ? '✅ WORKING' : '❌ NOT WORKING'}`);
  
  if (oldApiWorks && !newApiWorks) {
    console.log('\n⚠️  The frontend should continue using the old API URL.');
  } else if (!oldApiWorks && newApiWorks) {
    console.log('\n⚠️  The frontend needs to be updated to use the new API URL.');
    console.log('Update NEXT_PUBLIC_API_URL in .env files to:');
    console.log(`https://8r85mpuvt3.execute-api.eu-central-1.amazonaws.com/dev/v1`);
  } else if (oldApiWorks && newApiWorks) {
    console.log('\n✅ Both APIs are working. You can use either one.');
  } else {
    console.log('\n❌ Neither API is working properly. There may be a Lambda or DynamoDB issue.');
  }
}

main().catch(console.error);