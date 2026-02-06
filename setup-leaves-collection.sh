#!/bin/bash

echo "========================================"
echo "Appwrite Leaves Collection Setup"
echo "========================================"
echo ""

DATABASE_ID="attendance-db"
PROJECT_ID="697dac94002f85b009ab"

echo "Creating 'leaves' collection..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create leaves collection with proper permissions
appwrite databases createCollection \
  --database-id $DATABASE_ID \
  --collection-id leaves \
  --name "Leaves" \
  --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"

# Create attributes for leaves collection
echo -e "${BLUE}[1/12] Creating employeeId attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key employeeId --size 50 --required true

echo -e "${BLUE}[2/12] Creating employeeName attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key employeeName --size 255 --required true

echo -e "${BLUE}[3/12] Creating leaveType attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key leaveType --size 50 --required true

echo -e "${BLUE}[4/12] Creating startDate attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key startDate --size 50 --required true

echo -e "${BLUE}[5/12] Creating endDate attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key endDate --size 50 --required true

echo -e "${BLUE}[6/12] Creating days attribute...${NC}"
appwrite databases createIntegerAttribute --databaseId $DATABASE_ID --collectionId leaves --key days --required true --default 1

echo -e "${BLUE}[7/12] Creating reason attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key reason --size 1000 --required false

echo -e "${BLUE}[8/12] Creating status attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key status --size 50 --required true --default pending

echo -e "${BLUE}[9/12] Creating appliedDate attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key appliedDate --size 50 --required true

echo -e "${BLUE}[10/12] Creating approvedBy attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key approvedBy --size 255 --required false

echo -e "${BLUE}[11/12] Creating approvedDate attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key approvedDate --size 50 --required false

echo -e "${BLUE}[12/12] Creating remarks attribute...${NC}"
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId leaves --key remarks --size 1000 --required false

echo ""
echo "Creating indexes..."
sleep 2

# Create indexes
appwrite databases createIndex --databaseId $DATABASE_ID --collectionId leaves --key employeeId_idx --type key --attributes employeeId
appwrite databases createIndex --databaseId $DATABASE_ID --collectionId leaves --key status_idx --type key --attributes status
appwrite databases createIndex --databaseId $DATABASE_ID --collectionId leaves --key appliedDate_idx --type key --attributes appliedDate

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Collection 'leaves' created with attributes:"
echo "  - employeeId (string, required)"
echo "  - employeeName (string, required)"
echo "  - leaveType (string, required)"
echo "  - startDate (string, required)"
echo "  - endDate (string, required)"
echo "  - days (integer, required, default: 1)"
echo "  - reason (string, optional)"
echo "  - status (string, required, default: pending)"
echo "  - appliedDate (string, required)"
echo "  - approvedBy (string, optional)"
echo "  - approvedDate (string, optional)"
echo "  - remarks (string, optional)"
echo ""
echo "Indexes created:"
echo "  - employeeId_idx"
echo "  - status_idx"
echo "  - appliedDate_idx"
echo ""
