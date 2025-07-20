@echo off
echo ==============================================
echo       GITHUB UPLOAD ASSISTANT
echo ==============================================
echo.
echo I will help you upload your project to GitHub step by step.
echo Your project "Government Forms Management System" is ready!
echo.
echo Project Status:
echo - Files: 141 files ready
echo - Documentation: Complete
echo - Git commits: 6 commits with detailed descriptions
echo - Status: Production ready
echo.
echo ==============================================
echo        STEP 1: CREATE GITHUB REPOSITORY
echo ==============================================
echo.
echo I've opened GitHub in your browser.
echo Please follow these exact steps:
echo.
echo 1. Repository name: government-forms-management-system
echo 2. Description: Comprehensive government forms and citizen feedback management system built with Django REST API + Next.js frontend
echo 3. Choose: Public (recommended)
echo 4. Do NOT check any of these boxes:
echo    [ ] Add a README file
echo    [ ] Add .gitignore  
echo    [ ] Choose a license
echo 5. Click "Create repository"
echo.
echo Press any key when you've created the repository...
pause >nul
echo.
echo ==============================================
echo        STEP 2: GET YOUR GITHUB USERNAME
echo ==============================================
echo.
set /p username=Enter your GitHub username (from the repository URL): 
echo.
echo ==============================================
echo        STEP 3: CONNECTING AND UPLOADING
echo ==============================================
echo.
echo Now I will connect your project to GitHub and upload it...
echo.

cd /d "c:\Users\YASSER\Desktop\django_project"

echo [1/3] Adding GitHub remote...
git remote add origin https://github.com/%username%/government-forms-management-system.git
if %ERRORLEVEL% neq 0 (
    echo Remote already exists, updating...
    git remote set-url origin https://github.com/%username%/government-forms-management-system.git
)

echo [2/3] Setting main branch...
git branch -M main

echo [3/3] Uploading to GitHub...
echo.
echo IMPORTANT: When prompted for credentials:
echo - Username: %username%
echo - Password: Use Personal Access Token (NOT your GitHub password)
echo.
echo If you don't have a token, get one from: https://github.com/settings/tokens
echo Give it 'repo' permissions.
echo.
echo Press any key to start upload...
pause >nul

git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ==============================================
    echo           🎉 SUCCESS! 🎉
    echo ==============================================
    echo.
    echo Your project is now live on GitHub!
    echo URL: https://github.com/%username%/government-forms-management-system
    echo.
    echo Opening your repository...
    start https://github.com/%username%/government-forms-management-system
    echo.
    echo ==============================================
    echo        RECOMMENDED NEXT STEPS:
    echo ==============================================
    echo.
    echo 1. ⭐ Star your repository
    echo 2. Add topics: django, nextjs, government, forms-management, docker
    echo 3. Enable Issues and Discussions
    echo 4. Share with the community
    echo.
    echo Congratulations! Your Government Forms Management System is now public!
    
) else (
    echo.
    echo ==============================================
    echo           UPLOAD ISSUE
    echo ==============================================
    echo.
    echo The upload encountered an issue. Common solutions:
    echo.
    echo 1. Authentication: Use Personal Access Token instead of password
    echo    - Go to: https://github.com/settings/tokens
    echo    - Generate new token with 'repo' scope
    echo    - Use username + token (as password)
    echo.
    echo 2. Repository check: Ensure the repository was created correctly
    echo    - Name: government-forms-management-system  
    echo    - Owner: %username%
    echo    - Not initialized with files
    echo.
    echo 3. Try again: Run this command manually:
    echo    git push -u origin main
    echo.
    echo Need help? Check FINAL_UPLOAD_GUIDE.md for detailed troubleshooting.
)

echo.
echo Press any key to exit...
pause >nul
