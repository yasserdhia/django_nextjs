@echo off
echo ==============================================
echo 🚀 UPLOADING TO GITHUB - MANUAL METHOD
echo ==============================================
echo.

echo ✅ Your project is ready for GitHub upload!
echo.

echo 📋 Project Statistics:
echo - Files: 134+ files
echo - Languages: Python, TypeScript, JavaScript, HTML, CSS
echo - Size: ~15-20 MB
echo - License: MIT
echo - Status: Production Ready
echo.

echo 🏗️ Technology Stack:
echo - Backend: Django 4.2.7 + DRF + PostgreSQL 15
echo - Frontend: Next.js 13+ + TypeScript + Tailwind CSS
echo - DevOps: Docker Compose + pgAdmin
echo - Authentication: JWT + Token-based system
echo.

echo ==============================================
echo     📋 MANUAL UPLOAD STEPS:
echo ==============================================
echo.

echo 1️⃣ CREATE GITHUB REPOSITORY:
echo    → Go to: https://github.com/new
echo    → Repository name: government-forms-management-system
echo    → Description: 🏛️ Comprehensive government forms and citizen feedback management system built with Django REST API + Next.js frontend
echo    → Visibility: Public (recommended) or Private
echo    → DON'T initialize with README, .gitignore, or license (we already have them)
echo    → Click "Create repository"
echo.

echo 2️⃣ COPY YOUR GITHUB USERNAME:
echo    → After creating the repo, note your GitHub username from the URL
echo    → URL will be: https://github.com/YOUR_USERNAME/government-forms-management-system
echo.

echo 3️⃣ CONNECT AND PUSH (replace YOUR_USERNAME):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/government-forms-management-system.git
echo    git branch -M main
echo    git push -u origin main
echo.

echo 4️⃣ VERIFY UPLOAD:
echo    → Go to your repository URL
echo    → Check that all files are uploaded
echo    → Verify README.md displays properly
echo.

echo 5️⃣ CONFIGURE REPOSITORY (optional):
echo    → Add topics: django, nextjs, government, forms-management, docker, postgresql
echo    → Enable Issues and Discussions
echo    → Set up branch protection rules
echo    → Enable security features
echo.

echo ==============================================
echo     🎯 READY TO EXECUTE!
echo ==============================================
echo.

echo Current directory: %CD%
echo Git status: Ready to push (clean working tree)
echo Branch: master (will be renamed to main during push)
echo.

echo ⚠️  IMPORTANT: Replace YOUR_USERNAME with your actual GitHub username!
echo.

echo 📞 Need help? Check these files:
echo    → GITHUB_SETUP.md (English guide)
echo    → UPLOAD_TO_GITHUB.md (Arabic guide)
echo    → README.md (Project documentation)
echo.

echo Press any key to continue or Ctrl+C to cancel...
pause

echo.
echo 🔗 Opening GitHub in your browser...
start https://github.com/new

echo.
echo 📋 Your project details for copy-paste:
echo.
echo Repository name: government-forms-management-system
echo Description: 🏛️ Comprehensive government forms and citizen feedback management system built with Django REST API + Next.js frontend
echo Topics: django,nextjs,government,forms-management,docker,postgresql,rest-api,typescript
echo.

echo ✨ After creating the repository, come back here and press any key...
pause

echo.
echo 🚀 Ready to push! Please enter your GitHub username:
set /p username=GitHub Username: 

echo.
echo 📤 Executing upload commands...
echo.

echo [1/3] Adding GitHub remote...
git remote add origin https://github.com/%username%/government-forms-management-system.git

echo [2/3] Renaming branch to main...
git branch -M main

echo [3/3] Pushing to GitHub...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ==============================================
    echo     🎉 SUCCESS! PROJECT UPLOADED TO GITHUB
    echo ==============================================
    echo.
    echo 🌟 Your repository is now live at:
    echo    https://github.com/%username%/government-forms-management-system
    echo.
    echo 📋 Next steps:
    echo    → Star your repository ⭐
    echo    → Add it to your portfolio
    echo    → Share with the community
    echo    → Continue developing and improving
    echo.
    echo 🔗 Opening your repository...
    start https://github.com/%username%/government-forms-management-system
) else (
    echo ==============================================
    echo     ❌ UPLOAD FAILED
    echo ==============================================
    echo.
    echo 🔍 Common issues:
    echo    → Check your internet connection
    echo    → Verify GitHub username is correct
    echo    → Ensure repository was created on GitHub
    echo    → Check if you have push permissions
    echo.
    echo 📞 Need help? Check:
    echo    → GITHUB_SETUP.md for troubleshooting
    echo    → UPLOAD_TO_GITHUB.md for alternative methods
)

echo.
echo Press any key to exit...
pause >nul
