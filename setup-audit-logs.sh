#!/bin/bash

# Setup Audit Logs Collection
PROJECT_ID="697dac94002f85b009ab"
DATABASE_ID="attendance-db"
COLLECTION_ID="audit-logs"

echo "🔍 Creating Audit Logs Collection..."

# Create collection
appwrite databases createCollection \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --name "Audit Logs" \
  --permissions 'read("users")' 'create("users")' \
  --documentSecurity true

# Add attributes
appwrite databases createStringAttribute \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --key "userId" \
  --size 255 \
  --required true

appwrite databases createStringAttribute \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --key "action" \
  --size 50 \
  --required true

appwrite databases createStringAttribute \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --key "resource" \
  --size 100 \
  --required true

appwrite databases createStringAttribute \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --key "details" \
  --size 10000 \
  --required false

appwrite databases createStringAttribute \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --key "timestamp" \
  --size 50 \
  --required true

appwrite databases createStringAttribute \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --key "ipAddress" \
  --size 50 \
  --required false

appwrite databases createStringAttribute \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --key "userAgent" \
  --size 500 \
  --required false

# Create indexes
appwrite databases createIndex \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --key "userId_index" \
  --type "key" \
  --attributes "userId"

appwrite databases createIndex \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --key "action_index" \
  --type "key" \
  --attributes "action"

appwrite databases createIndex \
  --databaseId "$DATABASE_ID" \
  --collectionId "$COLLECTION_ID" \
  --key "timestamp_index" \
  --type "key" \
  --attributes "timestamp" \
  --orders "DESC"

echo "✅ Audit Logs Collection created successfully!"
