@echo off
echo Starting Appwrite Backend Setup...

set PROJECT_ID=697dac94002f85b009ab
set DATABASE_ID=attendance-db

echo Step 1: Installing Appwrite CLI...
call npm install -g appwrite-cli

echo Step 2: Login to Appwrite...
call appwrite login

echo Step 3: Initializing project...
call appwrite init project --project-id %PROJECT_ID%

echo Step 4: Creating database...
call appwrite databases create --database-id %DATABASE_ID% --name "Attendance Database"

echo Step 5: Creating collections...
call appwrite databases createCollection --database-id %DATABASE_ID% --collection-id employees --name "Employees" --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"
call appwrite databases createCollection --database-id %DATABASE_ID% --collection-id attendance --name "Attendance" --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"
call appwrite databases createCollection --database-id %DATABASE_ID% --collection-id salary-config --name "Salary Config" --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"
call appwrite databases createCollection --database-id %DATABASE_ID% --collection-id months --name "Months" --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"
call appwrite databases createCollection --database-id %DATABASE_ID% --collection-id companies --name "Companies" --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"

echo Step 6: Creating attributes for Employees...
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id employees --key empId --size 50 --required true
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id employees --key name --size 255 --required true
call appwrite databases createFloatAttribute --database-id %DATABASE_ID% --collection-id employees --key gross --required true
call appwrite databases createIntegerAttribute --database-id %DATABASE_ID% --collection-id employees --key openingCL --required true --default 8
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id employees --key department --size 100 --required false
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id employees --key status --size 20 --required true --default "active"
call appwrite databases createIntegerAttribute --database-id %DATABASE_ID% --collection-id employees --key sno --required true

echo Step 7: Creating attributes for Attendance...
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id attendance --key employeeId --size 50 --required true
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id attendance --key monthId --size 50 --required true
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id attendance --key attendance --size 10000 --required true
call appwrite databases createIntegerAttribute --database-id %DATABASE_ID% --collection-id attendance --key presentDays --required true --default 0
call appwrite databases createIntegerAttribute --database-id %DATABASE_ID% --collection-id attendance --key paidHoliday --required true --default 0
call appwrite databases createIntegerAttribute --database-id %DATABASE_ID% --collection-id attendance --key weekOff --required true --default 0
call appwrite databases createIntegerAttribute --database-id %DATABASE_ID% --collection-id attendance --key onDuty --required true --default 0
call appwrite databases createIntegerAttribute --database-id %DATABASE_ID% --collection-id attendance --key casualLeave --required true --default 0
call appwrite databases createFloatAttribute --database-id %DATABASE_ID% --collection-id attendance --key lossOfPay --required true --default 0
call appwrite databases createFloatAttribute --database-id %DATABASE_ID% --collection-id attendance --key payableDays --required true --default 0

echo Step 8: Creating attributes for Salary Config...
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id salary-config --key employeeId --size 50 --required true
call appwrite databases createFloatAttribute --database-id %DATABASE_ID% --collection-id salary-config --key bonus --required true --default 0
call appwrite databases createFloatAttribute --database-id %DATABASE_ID% --collection-id salary-config --key otherAllowance --required true --default 0
call appwrite databases createFloatAttribute --database-id %DATABASE_ID% --collection-id salary-config --key ot --required true --default 0
call appwrite databases createFloatAttribute --database-id %DATABASE_ID% --collection-id salary-config --key otherDeduction --required true --default 0

echo Step 9: Creating attributes for Months...
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id months --key month --size 50 --required true
call appwrite databases createIntegerAttribute --database-id %DATABASE_ID% --collection-id months --key year --required true
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id months --key dates --size 5000 --required true
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id months --key days --size 1000 --required true
call appwrite databases createBooleanAttribute --database-id %DATABASE_ID% --collection-id months --key isActive --required true --default true

echo Step 10: Creating attributes for Companies...
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id companies --key name --size 255 --required true
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id companies --key address --size 500 --required false
call appwrite databases createStringAttribute --database-id %DATABASE_ID% --collection-id companies --key settings --size 5000 --required false

echo Step 11: Waiting for attributes to be ready...
timeout /t 5 /nobreak

echo Step 12: Creating indexes...
call appwrite databases createIndex --database-id %DATABASE_ID% --collection-id employees --key empId_idx --type unique --attributes empId
call appwrite databases createIndex --database-id %DATABASE_ID% --collection-id attendance --key employee_month_idx --type unique --attributes employeeId monthId
call appwrite databases createIndex --database-id %DATABASE_ID% --collection-id salary-config --key employeeId_idx --type unique --attributes employeeId

echo.
echo ========================================
echo Appwrite setup complete!
echo Database ID: %DATABASE_ID%
echo Collections: employees, attendance, salary-config, months, companies
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run migrate
echo 2. Run: npm run dev
echo.
pause
