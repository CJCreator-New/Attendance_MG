#!/bin/bash

echo "🚀 Adding Leaves Collection to Appwrite..."

PROJECT_ID="697dac94002f85b009ab"
DATABASE_ID="attendance-db"

echo "Creating leaves collection..."
appwrite databases create-collection \
  --database-id $DATABASE_ID \
  --collection-id leaves \
  --name "Leaves" \
  --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"

echo "Creating attributes for Leaves..."
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key employeeId --size 50 --required true
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key employeeName --size 255 --required true
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key leaveType --size 50 --required true
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key startDate --size 50 --required true
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key endDate --size 50 --required true
appwrite databases create-integer-attribute --database-id $DATABASE_ID --collection-id leaves --key days --required true
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key reason --size 1000 --required false
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key status --size 20 --required false --xdefault "pending"
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key appliedDate --size 50 --required false
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key approvedBy --size 255 --required false
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key approvedDate --size 50 --required false
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id leaves --key remarks --size 1000 --required false

echo "Waiting for attributes to be ready..."
ping 127.0.0.1 -n 6 > nul

echo "Creating indexes..."
appwrite databases create-index --database-id $DATABASE_ID --collection-id leaves --key employee_idx --type key --attributes employeeId
appwrite databases create-index --database-id $DATABASE_ID --collection-id leaves --key status_idx --type key --attributes status

echo "✅ Leaves collection created successfully!"
