@echo off
echo ========================================
echo Week 1 Automated Verification
echo ========================================
echo.

set PASSED=0
set FAILED=0

echo Step 1: Checking Dependencies...
call npm list appwrite >nul 2>&1
if %errorlevel%==0 (
    echo [PASS] Appwrite SDK installed
    set /a PASSED+=1
) else (
    echo [FAIL] Appwrite SDK not installed
    set /a FAILED+=1
)

call npm list react >nul 2>&1
if %errorlevel%==0 (
    echo [PASS] React installed
    set /a PASSED+=1
) else (
    echo [FAIL] React not installed
    set /a FAILED+=1
)

echo.
echo Step 2: Checking Files...

if exist "src\services\employeeService.js" (
    echo [PASS] EmployeeService exists
    set /a PASSED+=1
) else (
    echo [FAIL] EmployeeService missing
    set /a FAILED+=1
)

if exist "src\services\salaryConfigService.js" (
    echo [PASS] SalaryConfigService exists
    set /a PASSED+=1
) else (
    echo [FAIL] SalaryConfigService missing
    set /a FAILED+=1
)

if exist "src\services\leaveService.js" (
    echo [PASS] LeaveService exists
    set /a PASSED+=1
) else (
    echo [FAIL] LeaveService missing
    set /a FAILED+=1
)

if exist "src\features\employees\EmployeeManagementEnhanced.jsx" (
    echo [PASS] EmployeeManagement component exists
    set /a PASSED+=1
) else (
    echo [FAIL] EmployeeManagement component missing
    set /a FAILED+=1
)

if exist "src\features\salary\SalaryManagement.jsx" (
    echo [PASS] SalaryManagement component exists
    set /a PASSED+=1
) else (
    echo [FAIL] SalaryManagement component missing
    set /a FAILED+=1
)

echo.
echo Step 3: Checking Configuration...

if exist "src\lib\appwrite.js" (
    echo [PASS] Appwrite config exists
    set /a PASSED+=1
) else (
    echo [FAIL] Appwrite config missing
    set /a FAILED+=1
)

findstr /C:"697dac94002f85b009ab" src\lib\appwrite.js >nul 2>&1
if %errorlevel%==0 (
    echo [PASS] Project ID configured
    set /a PASSED+=1
) else (
    echo [FAIL] Project ID not configured
    set /a FAILED+=1
)

echo.
echo Step 4: Checking Scripts...

if exist "add-leaves-collection.sh" (
    echo [PASS] Leaves collection script exists
    set /a PASSED+=1
) else (
    echo [FAIL] Leaves collection script missing
    set /a FAILED+=1
)

if exist "setup-appwrite.bat" (
    echo [PASS] Setup script exists
    set /a PASSED+=1
) else (
    echo [FAIL] Setup script missing
    set /a FAILED+=1
)

echo.
echo ========================================
echo Test Summary
echo ========================================
echo Passed: %PASSED%
echo Failed: %FAILED%
echo.

if %FAILED%==0 (
    echo [SUCCESS] All checks passed!
    echo.
    echo Week 1 implementation verified
    echo Ready for manual testing
    echo.
    echo Next steps:
    echo 1. Run: bash add-leaves-collection.sh
    echo 2. Run: npm run dev
    echo 3. Follow WEEK1_TESTING_GUIDE.md
) else (
    echo [ERROR] Some checks failed
    echo.
    echo Please fix the issues above before proceeding.
)

echo.
pause
