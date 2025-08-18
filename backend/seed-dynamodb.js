const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Configure AWS DynamoDB client
const client = new DynamoDBClient({
  region: 'eu-central-1',
});

const docClient = DynamoDBDocumentClient.from(client);

// Sample product data
const sampleProducts = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Premium Coffee Beans',
    sku: 'PCB-001',
    barcode: '1234567890123',
    category: 'Beverages',
    quantity: 150,
    minThreshold: 20,
    price: 24.99,
    cost: 18.50,
    supplier: 'Global Coffee Co.',
    description: 'High-quality arabica coffee beans sourced from Colombia',
    unit: 'kg',
    expirationDate: '2024-12-31',
    location: 'Warehouse A, Shelf 3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    name: 'Organic Green Tea',
    sku: 'OGT-002',
    barcode: '2345678901234',
    category: 'Beverages',
    quantity: 8,
    minThreshold: 15,
    price: 12.99,
    cost: 9.50,
    supplier: 'Organic Tea Ltd.',
    description: 'Premium organic green tea leaves',
    unit: 'box',
    expirationDate: '2025-06-30',
    location: 'Warehouse A, Shelf 2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '323e4567-e89b-12d3-a456-426614174002',
    name: 'Whole Wheat Flour',
    sku: 'WWF-003',
    barcode: '3456789012345',
    category: 'Baking',
    quantity: 45,
    minThreshold: 10,
    price: 8.99,
    cost: 6.50,
    supplier: 'Mills & Grains Co.',
    description: '100% whole wheat flour for baking',
    unit: 'kg',
    expirationDate: '2024-11-15',
    location: 'Warehouse B, Shelf 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Laptop Pro X1',
    sku: 'LPX-001',
    barcode: '4567890123456',
    category: 'Electronics',
    quantity: 25,
    minThreshold: 5,
    price: 1299.99,
    cost: 950.00,
    supplier: 'Tech Solutions Inc.',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    unit: 'unit',
    location: 'Warehouse C, Section E',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Wireless Mouse',
    sku: 'WM-002',
    barcode: '5678901234567',
    category: 'Electronics',
    quantity: 87,
    minThreshold: 20,
    price: 29.99,
    cost: 15.00,
    supplier: 'Tech Solutions Inc.',
    description: 'Ergonomic wireless mouse with 3-year battery life',
    unit: 'unit',
    location: 'Warehouse C, Section A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Organic Honey',
    sku: 'OH-001',
    barcode: '6789012345678',
    category: 'Food & Snacks',
    quantity: 60,
    minThreshold: 15,
    price: 15.99,
    cost: 10.00,
    supplier: 'Natural Foods Co.',
    description: 'Pure organic honey from local beekeepers',
    unit: 'jar',
    expirationDate: '2025-12-31',
    location: 'Warehouse A, Shelf 5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Office Chair Pro',
    sku: 'OCP-001',
    barcode: '7890123456789',
    category: 'Office Supplies',
    quantity: 12,
    minThreshold: 3,
    price: 249.99,
    cost: 150.00,
    supplier: 'Office Depot',
    description: 'Ergonomic office chair with lumbar support',
    unit: 'unit',
    location: 'Warehouse D, Section B',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'A4 Paper (500 sheets)',
    sku: 'A4P-001',
    barcode: '8901234567890',
    category: 'Office Supplies',
    quantity: 200,
    minThreshold: 50,
    price: 4.99,
    cost: 2.50,
    supplier: 'Office Depot',
    description: 'Premium quality A4 paper for printing',
    unit: 'ream',
    location: 'Warehouse D, Section C',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'USB-C Cable 2m',
    sku: 'USB-001',
    barcode: '9012345678901',
    category: 'Electronics',
    quantity: 150,
    minThreshold: 30,
    price: 12.99,
    cost: 5.00,
    supplier: 'Tech Solutions Inc.',
    description: 'Fast charging USB-C cable, 2 meters',
    unit: 'unit',
    location: 'Warehouse C, Section B',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Energy Drink Pack (24)',
    sku: 'ED-001',
    barcode: '0123456789012',
    category: 'Beverages',
    quantity: 35,
    minThreshold: 10,
    price: 35.99,
    cost: 24.00,
    supplier: 'Beverage Distributors',
    description: 'Pack of 24 energy drinks',
    unit: 'pack',
    expirationDate: '2024-08-31',
    location: 'Warehouse A, Shelf 6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
];

// Sample user data
const sampleUsers = [
  {
    id: '1',
    email: 'admin@omnix.ai',
    passwordHash: '$2b$10$9djHvmN6iQW6ch1CFYPT1Ogt7XVctTee.SBAsRyD7PnnC91hAQQra', // password: admin123
    name: 'Admin User',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'manager@omnix.ai',
    passwordHash: '$2b$10$F/27b68iP4U2Gjd6zCfIqONMg46dRy/Ip/ChdrF1riY7QBhrUHxwi', // password: manager123
    name: 'Store Manager',
    role: 'manager',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'analyst@omnix.ai',
    passwordHash: '$2b$10$XYZ123...',  // password: analyst123 (you'd need to generate this)
    name: 'Data Analyst',
    role: 'analyst',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seedTable(tableName, items) {
  console.log(`\n📋 Seeding ${tableName}...`);
  
  // Check if table already has data
  try {
    const scanCommand = new ScanCommand({
      TableName: tableName,
      Limit: 1,
    });
    
    const existingData = await docClient.send(scanCommand);
    
    if (existingData.Items && existingData.Items.length > 0) {
      console.log(`   ⚠️  Table ${tableName} already contains data. Skipping...`);
      return;
    }
  } catch (error) {
    console.error(`   ❌ Error checking table ${tableName}:`, error.message);
    return;
  }
  
  // Seed the data
  for (const item of items) {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: item,
      });
      
      await docClient.send(command);
      console.log(`   ✅ Added: ${item.name || item.email || item.id}`);
    } catch (error) {
      console.error(`   ❌ Error adding item:`, error.message);
    }
  }
  
  console.log(`   ✅ ${tableName} seeding complete!`);
}

async function main() {
  console.log('🌱 OMNIX AI - DynamoDB Data Seeding');
  console.log('=====================================');
  
  try {
    // Seed products
    await seedTable('omnix-ai-products-dev', sampleProducts);
    
    // Seed users
    await seedTable('omnix-ai-dev-users', sampleUsers);
    
    console.log('\n🎉 Data seeding complete!');
    console.log('\n📊 Summary:');
    console.log(`   • Products: ${sampleProducts.length} items`);
    console.log(`   • Users: ${sampleUsers.length} items`);
    console.log('\n✅ Your DynamoDB tables now contain sample data!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

// Run the seeding
main();