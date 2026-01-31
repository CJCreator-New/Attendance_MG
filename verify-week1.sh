#!/bin/bash

echo "🧪 Week 1 Automated Verification"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

# Function to check
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $1"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $1"
        ((FAILED++))
    fi
}

echo "📦 Step 1: Checking Dependencies..."
npm list appwrite > /dev/null 2>&1
check "Appwrite SDK installed"

npm list react > /dev/null 2>&1
check "React installed"

npm list vite > /dev/null 2>&1
check "Vite installed"

echo ""
echo "📁 Step 2: Checking Files..."

# Check services
[ -f "src/services/employeeService.js" ]
check "EmployeeService exists"

[ -f "src/services/salaryConfigService.js" ]
check "SalaryConfigService exists"

[ -f "src/services/leaveService.js" ]
check "LeaveService exists"

[ -f "src/services/attendanceService.js" ]
check "AttendanceService exists"

[ -f "src/services/authService.js" ]
check "AuthService exists"

# Check components
[ -f "src/features/employees/EmployeeManagementEnhanced.jsx" ]
check "EmployeeManagement component exists"

[ -f "src/features/salary/SalaryManagement.jsx" ]
check "SalaryManagement component exists"

[ -f "src/AttendanceSheet.jsx" ]
check "AttendanceSheet component exists"

echo ""
echo "🔧 Step 3: Checking Configuration..."

[ -f "src/lib/appwrite.js" ]
check "Appwrite config exists"

grep -q "697dac94002f85b009ab" src/lib/appwrite.js
check "Project ID configured"

grep -q "sgp.cloud.appwrite.io" src/lib/appwrite.js
check "Endpoint configured"

echo ""
echo "📝 Step 4: Checking Scripts..."

[ -f "add-leaves-collection.sh" ]
check "Leaves collection script exists"

[ -f "setup-appwrite.sh" ]
check "Setup script exists"

echo ""
echo "🔍 Step 5: Code Quality Checks..."

# Check for localStorage usage in migrated files
if grep -q "localStorage" src/features/employees/EmployeeManagementEnhanced.jsx 2>/dev/null; then
    echo -e "${YELLOW}⚠️  WARNING${NC}: localStorage still used in EmployeeManagement"
    ((FAILED++))
else
    echo -e "${GREEN}✅ PASS${NC}: No localStorage in EmployeeManagement"
    ((PASSED++))
fi

if grep -q "localStorage" src/features/salary/SalaryManagement.jsx 2>/dev/null; then
    echo -e "${YELLOW}⚠️  WARNING${NC}: localStorage still used in SalaryManagement"
    ((FAILED++))
else
    echo -e "${GREEN}✅ PASS${NC}: No localStorage in SalaryManagement"
    ((PASSED++))
fi

# Check for async/await
grep -q "async" src/features/employees/EmployeeManagementEnhanced.jsx
check "Async operations in EmployeeManagement"

grep -q "async" src/features/salary/SalaryManagement.jsx
check "Async operations in SalaryManagement"

echo ""
echo "=================================="
echo "📊 Test Summary"
echo "=================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed!${NC}"
    echo ""
    echo "✅ Week 1 implementation verified"
    echo "✅ Ready for manual testing"
    echo ""
    echo "Next steps:"
    echo "1. Run: bash add-leaves-collection.sh"
    echo "2. Run: npm run dev"
    echo "3. Follow WEEK1_TESTING_GUIDE.md"
    exit 0
else
    echo -e "${RED}❌ Some checks failed${NC}"
    echo ""
    echo "Please fix the issues above before proceeding."
    exit 1
fi
