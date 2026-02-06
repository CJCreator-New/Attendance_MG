@echo off
echo ========================================
echo Appwrite Leaves Collection Setup
echo ========================================
echo.

set DATABASE_ID=attendance-db
set PROJECT_ID=697dac94002f85b009ab

echo Creating 'leaves' collection...
echo.

REM Create leaves collection with proper permissions
appwrite databases createCollection --databaseId %DATABASE_ID% --collectionId leaves --name "Leaves" --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"

REM Create attributes for leaves collection
echo [1/12] Creating employeeId attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key employeeId --size 50 --required true

echo [2/12] Creating employeeName attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key employeeName --size 255 --required true

echo [3/12] Creating leaveType attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key leaveType --size 50 --required true

echo [4/12] Creating startDate attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key startDate --size 50 --required true

echo [5/12] Creating endDate attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key endDate --size 50 --required true

echo [6/12] Creating days attribute...
appwrite databases createIntegerAttribute --databaseId %DATABASE_ID% --collectionId leaves --key days --required true --default 1

echo [7/12] Creating reason attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key reason --size 1000 --required false

echo [8/12] Creating status attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key status --size 50 --required true --default pending

echo [9/12] Creating appliedDate attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key appliedDate --size 50 --required true

echo [10/12] Creating approvedBy attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key approvedBy --size 255 --required false

echo [11/12] Creating approvedDate attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key approvedDate --size 50 --required false

echo [12/12] Creating remarks attribute...
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId leaves --key remarks --size 1000 --required false

echo.
echo Creating indexes...
timeout /t 2 /nobreak >nul

REM Create indexes
appwrite databases createIndex --databaseId %DATABASE_ID% --collectionId leaves --key employeeId_idx --type key --attributes employeeId
appwrite databases createIndex --databaseId %DATABASE_ID% --collectionId leaves --key status_idx --type key --attributes status
appwrite databases createIndex --databaseId %DATABASE_ID% --collectionId leaves --key appliedDate_idx --type key --attributes appliedDate

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Collection 'leaves' created with attributes:
echo   - employeeId (string, required)
echo   - employeeName (string, required)
echo   - leaveType (string, required)
echo   - startDate (string, required)
echo   - endDate (string, required)
echo   - days (integer, required)
echo   - reason (string, optional)
echo   - status (string, required, default: pending)
echo   - appliedDate (string, required)
echo   - approvedBy (string, optional)
echo   - approvedDate (string, optional)
echo   - remarks (string, optional)
echo.
echo Indexes created:
echo   - employeeId_idx
echo   - status_idx
echo   - appliedDate_idx
echo.
pause
