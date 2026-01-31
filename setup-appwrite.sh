#!/bin/bash

echo "🚀 Setting up Appwrite Backend..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_ID="697dac94002f85b009ab"
DATABASE_ID="attendance-db"

echo -e "${BLUE}Step 1: Installing Appwrite CLI...${NC}"
npm install -g appwrite-cli

echo -e "${BLUE}Step 2: Login to Appwrite...${NC}"
appwrite login

echo -e "${BLUE}Step 3: Initializing project...${NC}"
appwrite init project --project-id $PROJECT_ID

echo -e "${BLUE}Step 4: Creating database...${NC}"
appwrite databases create \
  --database-id $DATABASE_ID \
  --name "Attendance Database"

echo -e "${BLUE}Step 5: Creating collections...${NC}"

# Employees Collection
appwrite databases createCollection \
  --database-id $DATABASE_ID \
  --collection-id employees \
  --name "Employees" \
  --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"

# Attendance Collection
appwrite databases createCollection \
  --database-id $DATABASE_ID \
  --collection-id attendance \
  --name "Attendance" \
  --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"

# Salary Config Collection
appwrite databases createCollection \
  --database-id $DATABASE_ID \
  --collection-id salary-config \
  --name "Salary Config" \
  --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"

# Months Collection
appwrite databases createCollection \
  --database-id $DATABASE_ID \
  --collection-id months \
  --name "Months" \
  --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"

# Companies Collection
appwrite databases createCollection \
  --database-id $DATABASE_ID \
  --collection-id companies \
  --name "Companies" \
  --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"

echo -e "${BLUE}Step 6: Creating attributes for Employees...${NC}"
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id employees --key empId --size 50 --required true
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id employees --key name --size 255 --required true
appwrite databases createFloatAttribute --database-id $DATABASE_ID --collection-id employees --key gross --required true
appwrite databases createIntegerAttribute --database-id $DATABASE_ID --collection-id employees --key openingCL --required true --default 8
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id employees --key department --size 100 --required false
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id employees --key status --size 20 --required true --default "active"
appwrite databases createIntegerAttribute --database-id $DATABASE_ID --collection-id employees --key sno --required true

echo -e "${BLUE}Step 7: Creating attributes for Attendance...${NC}"
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id attendance --key employeeId --size 50 --required true
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id attendance --key monthId --size 50 --required true
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id attendance --key attendance --size 10000 --required true
appwrite databases createIntegerAttribute --database-id $DATABASE_ID --collection-id attendance --key presentDays --required true --default 0
appwrite databases createIntegerAttribute --database-id $DATABASE_ID --collection-id attendance --key paidHoliday --required true --default 0
appwrite databases createIntegerAttribute --database-id $DATABASE_ID --collection-id attendance --key weekOff --required true --default 0
appwrite databases createIntegerAttribute --database-id $DATABASE_ID --collection-id attendance --key onDuty --required true --default 0
appwrite databases createIntegerAttribute --database-id $DATABASE_ID --collection-id attendance --key casualLeave --required true --default 0
appwrite databases createFloatAttribute --database-id $DATABASE_ID --collection-id attendance --key lossOfPay --required true --default 0
appwrite databases createFloatAttribute --database-id $DATABASE_ID --collection-id attendance --key payableDays --required true --default 0

echo -e "${BLUE}Step 8: Creating attributes for Salary Config...${NC}"
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id salary-config --key employeeId --size 50 --required true
appwrite databases createFloatAttribute --database-id $DATABASE_ID --collection-id salary-config --key bonus --required true --default 0
appwrite databases createFloatAttribute --database-id $DATABASE_ID --collection-id salary-config --key otherAllowance --required true --default 0
appwrite databases createFloatAttribute --database-id $DATABASE_ID --collection-id salary-config --key ot --required true --default 0
appwrite databases createFloatAttribute --database-id $DATABASE_ID --collection-id salary-config --key otherDeduction --required true --default 0

echo -e "${BLUE}Step 9: Creating attributes for Months...${NC}"
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id months --key month --size 50 --required true
appwrite databases createIntegerAttribute --database-id $DATABASE_ID --collection-id months --key year --required true
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id months --key dates --size 5000 --required true
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id months --key days --size 1000 --required true
appwrite databases createBooleanAttribute --database-id $DATABASE_ID --collection-id months --key isActive --required true --default true

echo -e "${BLUE}Step 10: Creating attributes for Companies...${NC}"
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id companies --key name --size 255 --required true
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id companies --key address --size 500 --required false
appwrite databases createStringAttribute --database-id $DATABASE_ID --collection-id companies --key settings --size 5000 --required false

echo -e "${BLUE}Step 11: Creating indexes...${NC}"
sleep 5
appwrite databases createIndex --database-id $DATABASE_ID --collection-id employees --key empId_idx --type unique --attributes empId
appwrite databases createIndex --database-id $DATABASE_ID --collection-id attendance --key employee_month_idx --type unique --attributes employeeId monthId
appwrite databases createIndex --database-id $DATABASE_ID --collection-id salary-config --key employeeId_idx --type unique --attributes employeeId

echo -e "${GREEN}✅ Appwrite setup complete!${NC}"
echo -e "${GREEN}Database ID: $DATABASE_ID${NC}"
echo -e "${GREEN}Collections: employees, attendance, salary-config, months, companies${NC}"
