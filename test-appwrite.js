import { client, account, databases } from './src/lib/appwrite.js';
import { DATABASE_ID } from './src/services/appwriteService.js';

console.log('🧪 Testing Appwrite Connection...\n');

async function testConnection() {
  try {
    // Test 1: Ping
    console.log('1️⃣  Testing connection...');
    await client.ping();
    console.log('   ✅ Connection successful\n');

    // Test 2: Check Auth
    console.log('2️⃣  Checking authentication...');
    try {
      const user = await account.get();
      console.log(`   ✅ Logged in as: ${user.email}\n`);
    } catch {
      console.log('   ℹ️  Not logged in (this is OK)\n');
    }

    // Test 3: Check Database
    console.log('3️⃣  Checking database...');
    const collections = await databases.listCollections(DATABASE_ID);
    console.log(`   ✅ Found ${collections.total} collections:`);
    collections.collections.forEach(col => {
      console.log(`      - ${col.name} (${col.$id})`);
    });
    console.log('');

    // Test 4: Check Employees
    console.log('4️⃣  Checking employees collection...');
    try {
      const employees = await databases.listDocuments(DATABASE_ID, 'employees');
      console.log(`   ✅ Found ${employees.total} employees\n`);
    } catch (error) {
      console.log(`   ℹ️  No employees yet (${error.message})\n`);
    }

    console.log('✅ All tests passed!');
    console.log('\n🚀 Your app is ready to use!');
    console.log('   Run: npm run dev');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check internet connection');
    console.log('   2. Verify project ID in src/lib/appwrite.js');
    console.log('   3. Check Appwrite console: https://cloud.appwrite.io');
  }
}

testConnection();
