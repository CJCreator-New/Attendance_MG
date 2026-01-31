#!/bin/bash

# Phase 7: Advanced Features - Appwrite Collections Setup
# Run: bash setup-phase7-collections.sh

DATABASE_ID="attendance-db"
PROJECT_ID="697dac94002f85b009ab"

echo "🚀 Setting up Phase 7 collections..."

# 1. Tenants Collection
echo "Creating tenants collection..."
appwrite databases createCollection \
  --databaseId $DATABASE_ID \
  --collectionId tenants \
  --name "Tenants" \
  --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users")'

appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId tenants --key name --size 255 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId tenants --key domain --size 255 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId tenants --key status --size 50 --required true --default active
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId tenants --key settings --size 10000 --required false
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId tenants --key createdAt --size 50 --required true

# 2. Branches Collection
echo "Creating branches collection..."
appwrite databases createCollection \
  --databaseId $DATABASE_ID \
  --collectionId branches \
  --name "Branches" \
  --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users")'

appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId branches --key name --size 255 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId branches --key code --size 50 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId branches --key location --size 500 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId branches --key tenantId --size 50 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId branches --key status --size 50 --required true --default active
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId branches --key createdAt --size 50 --required true

# 3. Shifts Collection
echo "Creating shifts collection..."
appwrite databases createCollection \
  --databaseId $DATABASE_ID \
  --collectionId shifts \
  --name "Shifts" \
  --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users")'

appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId shifts --key name --size 255 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId shifts --key startTime --size 10 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId shifts --key endTime --size 10 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId shifts --key branchId --size 50 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId shifts --key overtimeRules --size 5000 --required false
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId shifts --key status --size 50 --required true --default active
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId shifts --key createdAt --size 50 --required true

# 4. Workflows Collection
echo "Creating workflows collection..."
appwrite databases createCollection \
  --databaseId $DATABASE_ID \
  --collectionId workflows \
  --name "Workflows" \
  --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users")'

appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId workflows --key name --size 255 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId workflows --key type --size 50 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId workflows --key steps --size 10000 --required true
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId workflows --key status --size 50 --required true --default active
appwrite databases createStringAttribute --databaseId $DATABASE_ID --collectionId workflows --key createdAt --size 50 --required true

echo "✅ Phase 7 collections created successfully!"
echo ""
echo "Collections created:"
echo "  - tenants (multi-tenancy)"
echo "  - branches (branch management)"
echo "  - shifts (shift management)"
echo "  - workflows (approval workflows)"
