/**
 * Script to initialize Appwrite database with required data
 * Run this after setting up collections to create initial records
 */

import { Client, Databases, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("697dac94002f85b009ab");

const databases = new Databases(client);
const DATABASE_ID = 'attendance-db';

async function initializeData() {
    console.log('🚀 Initializing Appwrite data...\n');

    try {
        // 1. Create an active month if none exists
        console.log('📅 Checking for active month...');
        const monthsResponse = await databases.listDocuments(DATABASE_ID, 'months', [
            Query.equal('isActive', true)
        ]);

        if (monthsResponse.documents.length === 0) {
            console.log('   No active month found. Creating January 2026...');
            
            const currentDate = new Date();
            const year = 2026;
            const month = 'January';
            const monthIndex = 0; // January
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            
            const dates = [];
            const days = [];
            for (let i = 1; i <= daysInMonth; i++) {
                const date = new Date(year, monthIndex, i);
                dates.push(date.toISOString());
                days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            }

            await databases.createDocument(
                DATABASE_ID,
                'months',
                ID.unique(),
                {
                    month: `${month} ${year}`,
                    year: year,
                    dates: JSON.stringify(dates),
                    days: JSON.stringify(days),
                    isActive: true
                }
            );
            console.log('   ✅ Active month created: January 2026');
        } else {
            console.log('   ✅ Active month already exists');
        }

        // 2. Check employees collection
        console.log('\n👥 Checking employees collection...');
        const employeesResponse = await databases.listDocuments(DATABASE_ID, 'employees', []);
        console.log(`   Found ${employeesResponse.documents.length} employees`);

        // 3. Check salary-config collection
        console.log('\n💰 Checking salary-config collection...');
        const salaryConfigResponse = await databases.listDocuments(DATABASE_ID, 'salary-config', []);
        console.log(`   Found ${salaryConfigResponse.documents.length} salary configs`);

        // 4. Check leaves collection
        console.log('\n🏖️  Checking leaves collection...');
        try {
            const leavesResponse = await databases.listDocuments(DATABASE_ID, 'leaves', []);
            console.log(`   Found ${leavesResponse.documents.length} leave records`);
        } catch (error) {
            console.log('   ⚠️  Leaves collection may not exist yet');
        }

        // 5. Check attendance collection
        console.log('\n📊 Checking attendance collection...');
        const attendanceResponse = await databases.listDocuments(DATABASE_ID, 'attendance', []);
        console.log(`   Found ${attendanceResponse.documents.length} attendance records`);

        console.log('\n✅ Data initialization complete!');
        console.log('\nNext steps:');
        console.log('1. Verify collections in Appwrite Console');
        console.log('2. Check collection permissions');
        console.log('3. Test adding an employee through the UI');

    } catch (error) {
        console.error('\n❌ Error initializing data:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Ensure all collections are created first');
        console.error('2. Check that DATABASE_ID is correct');
        console.error('3. Verify Appwrite endpoint and project ID');
        process.exit(1);
    }
}

// Run initialization
initializeData();
