@echo off
echo ==============================================
echo     🚀 GitHub Repository Setup Script
echo ==============================================
echo.

echo [1/5] Installing GitHub CLI...
echo Downloading GitHub CLI installer...
echo Please visit: https://cli.github.com/
echo.
echo Alternative: Install via winget:
echo winget install --id GitHub.cli
echo.
pause

echo.
echo [2/5] After installing GitHub CLI, please run:
echo gh auth login
echo.
pause

echo.
echo [3/5] Creating GitHub repository...
cd /d c:\Users\YASSER\Desktop\django_project

echo Repository Name: government-forms-management-system
echo Description: 🏛️ Comprehensive government forms and citizen feedback management system
echo.

echo Please run this command manually after GitHub CLI is installed:
echo gh repo create government-forms-management-system --public --source=. --remote=origin --push --description "🏛️ Comprehensive government forms and citizen feedback management system built with Django REST API + Next.js frontend"
echo.

echo [4/5] Alternative manual method:
echo 1. Go to https://github.com/new
echo 2. Repository name: government-forms-management-system
echo 3. Description: 🏛️ Comprehensive government forms and citizen feedback management system
echo 4. Choose Public
echo 5. Don't initialize with any files
echo 6. Click Create Repository
echo.

echo [5/5] Then run these commands:
echo git remote add origin https://github.com/YOUR_USERNAME/government-forms-management-system.git
echo git branch -M main
echo git push -u origin main
echo.

echo ==============================================
echo     ✅ Setup Complete!
echo ==============================================
pause
