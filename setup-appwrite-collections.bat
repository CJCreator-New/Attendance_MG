@echo off
echo ========================================
echo Appwrite Collections Setup
echo ========================================
echo.

set DATABASE_ID=attendance-db
set PROJECT_ID=697dac94002f85b009ab

echo Creating Phase 7 Collections...
echo.

REM Tenants Collection
echo [1/4] Creating tenants collection...
appwrite databases createCollection --databaseId %DATABASE_ID% --collectionId tenants --name "Tenants" --permissions "read(\"users\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId tenants --key name --size 255 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId tenants --key domain --size 255 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId tenants --key status --size 50 --required true --default active
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId tenants --key settings --size 10000 --required false
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId tenants --key createdAt --size 50 --required true
echo Tenants collection created!
echo.

REM Branches Collection
echo [2/4] Creating branches collection...
appwrite databases createCollection --databaseId %DATABASE_ID% --collectionId branches --name "Branches" --permissions "read(\"users\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId branches --key name --size 255 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId branches --key code --size 50 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId branches --key location --size 500 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId branches --key tenantId --size 50 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId branches --key status --size 50 --required true --default active
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId branches --key createdAt --size 50 --required true
echo Branches collection created!
echo.

REM Shifts Collection
echo [3/4] Creating shifts collection...
appwrite databases createCollection --databaseId %DATABASE_ID% --collectionId shifts --name "Shifts" --permissions "read(\"users\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId shifts --key name --size 255 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId shifts --key startTime --size 10 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId shifts --key endTime --size 10 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId shifts --key branchId --size 50 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId shifts --key overtimeRules --size 5000 --required false
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId shifts --key status --size 50 --required true --default active
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId shifts --key createdAt --size 50 --required true
echo Shifts collection created!
echo.

REM Workflows Collection
echo [4/4] Creating workflows collection...
appwrite databases createCollection --databaseId %DATABASE_ID% --collectionId workflows --name "Workflows" --permissions "read(\"users\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId workflows --key name --size 255 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId workflows --key type --size 50 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId workflows --key steps --size 10000 --required true
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId workflows --key status --size 50 --required true --default active
appwrite databases createStringAttribute --databaseId %DATABASE_ID% --collectionId workflows --key createdAt --size 50 --required true
echo Workflows collection created!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Collections created:
echo   - tenants (multi-tenancy)
echo   - branches (branch management)
echo   - shifts (shift management)
echo   - workflows (approval workflows)
echo.
echo Next steps:
echo 1. Verify collections in Appwrite Console
echo 2. Test CRUD operations
echo 3. Deploy application
echo.
pause
