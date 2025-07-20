@echo off
setlocal enabledelayedexpansion

echo ==============================================
echo   GOVERNMENT FORMS MANAGEMENT SYSTEM
echo        AUTOMATED GITHUB UPLOADER
echo ==============================================
echo.

:: Change to project directory
cd /d "c:\Users\YASSER\Desktop\django_project"

:: Check if we're in a git repository
if not exist ".git" (
    echo ERROR: Not a Git repository!
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Git repository detected
echo Project directory: %CD%
echo.

:: Check Git status
echo Checking Git status...
for /f %%i in ('git ls-files ^| find /c /v ""') do set filecount=%%i
echo Total files ready: !filecount!

:: Check if remote already exists
git remote get-url origin > nul 2>&1
if !ERRORLEVEL! equ 0 (
    echo WARNING: Remote 'origin' already exists
    git remote -v
    echo.
    echo Do you want to push to existing remote? (y/n):
    set /p confirm=
    if /i "!confirm!" neq "y" (
        echo Upload cancelled.
        pause
        exit /b 0
    )
    goto :push_to_existing
)

echo.
echo ==============================================
echo     REPOSITORY SETUP
echo ==============================================
echo.

:: Get GitHub username
echo Please enter your GitHub username:
set /p username=Username: 

if "!username!" equ "" (
    echo ERROR: Username cannot be empty!
    pause
    exit /b 1
)

set repo_name=government-forms-management-system

echo.
echo Repository details:
echo    Name: !repo_name!
echo    Owner: !username!
echo    Visibility: Public
echo    URL: https://github.com/!username!/!repo_name!
echo.

echo Please create this repository on GitHub:
echo    1. Go to: https://github.com/new
echo    2. Repository name: !repo_name!
echo    3. Description: Comprehensive government forms management system
echo    4. Make it Public
echo    5. Do NOT initialize with README, .gitignore, or license
echo    6. Click "Create repository"
echo.

echo Opening GitHub in your browser...
start "GitHub" "https://github.com/new"

echo.
echo After creating the repository, press any key to continue...
pause >nul

echo.
echo ==============================================
echo     UPLOADING TO GITHUB
echo ==============================================
echo.

:: Add remote
echo [1/3] Adding GitHub remote...
git remote add origin "https://github.com/!username!/!repo_name!.git"
if !ERRORLEVEL! neq 0 (
    echo Failed to add remote. Trying to update existing remote...
    git remote set-url origin "https://github.com/!username!/!repo_name!.git"
)

:: Rename branch to main
echo [2/3] Setting main branch...
git branch -M main
if !ERRORLEVEL! neq 0 (
    echo Branch rename failed or already named main
)

:push_to_existing
:: Push to GitHub
echo [3/3] Pushing to GitHub...
echo.
echo You may be prompted for GitHub credentials:
echo    - Username: Your GitHub username
echo    - Password: Use Personal Access Token (not your password)
echo    - Generate token at: https://github.com/settings/tokens
echo.

git push -u origin main
set push_result=!ERRORLEVEL!

echo.
if !push_result! equ 0 (
    echo ==============================================
    echo       UPLOAD SUCCESSFUL!
    echo ==============================================
    echo.
    echo Project successfully uploaded to GitHub!
    echo.
    echo Upload Summary:
    echo    Repository: !repo_name!
    echo    Owner: !username!
    echo    Files: !filecount!
    echo    Branch: main
    echo    Status: Live and accessible
    echo.
    echo Your repository is now available at:
    echo    https://github.com/!username!/!repo_name!
    echo.
    echo Next Steps:
    echo    - Star your repository
    echo    - Add topics: django, nextjs, government, forms-management
    echo    - Enable Issues and Discussions
    echo    - Set up branch protection rules
    echo    - Share with the development community
    echo.
    
    echo Opening your repository...
    start "Repository" "https://github.com/!username!/!repo_name!"
    
    echo.
    echo Congratulations! Your Government Forms Management System is now live!
    
) else (
    echo ==============================================
    echo       UPLOAD FAILED
    echo ==============================================
    echo.
    echo Common Issues and Solutions:
    echo.
    echo 1. Authentication Error:
    echo    - Use Personal Access Token instead of password
    echo    - Generate at: https://github.com/settings/tokens
    echo    - Give 'repo' permissions
    echo.
    echo 2. Repository Not Found:
    echo    - Verify repository was created on GitHub
    echo    - Check repository name spelling
    echo    - Ensure username is correct
    echo.
    echo 3. Permission Denied:
    echo    - Check if you have push access
    echo    - Verify you're the repository owner
    echo.
    echo Want to try again? Run this script again or push manually:
    echo    git push -u origin main
)

echo.
echo Upload session completed.
echo Press any key to exit...
pause >nul

endlocal
