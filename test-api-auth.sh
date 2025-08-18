#!/bin/bash

# Test authentication and product creation

API_URL="https://18sz01wxsi.execute-api.eu-central-1.amazonaws.com/dev/v1"

echo "Testing OMNIX AI API Authentication and Product Creation"
echo "========================================================="

# Step 1: Login
echo -e "\n1. Attempting login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@omnix.ai",
    "password": "manager123"
  }')

echo "Login response: $LOGIN_RESPONSE"

# Extract access token using jq if available, otherwise use grep/sed
if command -v jq &> /dev/null; then
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')
else
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
fi

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" == "null" ]; then
    echo "❌ Failed to get access token"
    exit 1
fi

echo "✅ Got access token: ${ACCESS_TOKEN:0:20}..."

# Step 2: Get current products
echo -e "\n2. Fetching current products..."
PRODUCTS_RESPONSE=$(curl -s -X GET "$API_URL/products" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json")

echo "Products response (first 200 chars): ${PRODUCTS_RESPONSE:0:200}..."

# Step 3: Create a new product
echo -e "\n3. Creating new product..."
TIMESTAMP=$(date +%s)
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/products" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product '"$TIMESTAMP"'",
    "sku": "TEST-SKU-'"$TIMESTAMP"'",
    "category": "Electronics",
    "quantity": 50,
    "minThreshold": 10,
    "price": 99.99,
    "cost": 70.00,
    "supplier": "Test Supplier",
    "description": "Test product created via API",
    "unit": "pieces"
  }')

echo "Create response: $CREATE_RESPONSE"

# Step 4: Verify product was created
echo -e "\n4. Verifying product creation..."
VERIFY_RESPONSE=$(curl -s -X GET "$API_URL/products" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json")

if echo "$VERIFY_RESPONSE" | grep -q "TEST-SKU-$TIMESTAMP"; then
    echo "✅ Product successfully created and found in database!"
else
    echo "❌ Product not found in database after creation"
fi