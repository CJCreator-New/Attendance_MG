#!/bin/bash

# Update Appwrite Collection Permissions
# Run this script to secure all collections

PROJECT_ID="697dac94002f85b009ab"
DATABASE_ID="attendance-db"

echo "🔒 Updating Appwrite Collection Permissions..."

# Update Employees Collection
appwrite databases updateCollection \
  --databaseId "$DATABASE_ID" \
  --collectionId "employees" \
  --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users")'

# Update Attendance Collection
appwrite databases updateCollection \
  --databaseId "$DATABASE_ID" \
  --collectionId "attendance" \
  --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users")'

# Update Salary Config Collection
appwrite databases updateCollection \
  --databaseId "$DATABASE_ID" \
  --collectionId "salary-config" \
  --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users")'

# Update Months Collection
appwrite databases updateCollection \
  --databaseId "$DATABASE_ID" \
  --collectionId "months" \
  --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users")'

# Update Companies Collection
appwrite databases updateCollection \
  --databaseId "$DATABASE_ID" \
  --collectionId "companies" \
  --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users")'

echo "✅ Permissions updated successfully!"
echo "⚠️  Note: Only authenticated users can now access data"
