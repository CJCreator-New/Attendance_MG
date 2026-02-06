@echo off
echo Deploying Attendance App to Appwrite...

echo Step 1: Building the app...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    exit /b %errorlevel%
)

echo Step 2: Deploying functions and collections...
call appwrite deploy
if %errorlevel% neq 0 (
    echo Deployment failed!
    exit /b %errorlevel%
)

echo Deployment completed successfully!
