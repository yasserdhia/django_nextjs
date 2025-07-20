@echo off

echo ==============================================
echo   GOVERNMENT FORMS MANAGEMENT SYSTEM
echo        GitHub Upload Script
echo ==============================================
echo.

cd /d "c:\Users\YASSER\Desktop\django_project"

if not exist ".git" (
    echo ERROR: Not a Git repository!
    pause
    exit /b 1
)

echo Git repository detected
echo Project directory: %CD%
echo.

git remote get-url origin > nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo WARNING: Remote 'origin' already exists
    git remote -v
    echo.
    echo Do you want to push to existing remote? (y/n)
    set /p confirm=
    if /i "%confirm%" neq "y" (
        echo Upload cancelled.
        pause
        exit /b 0
    )
    goto push_existing
)

echo ==============================================
echo     REPOSITORY SETUP
echo ==============================================
echo.

echo Please enter your GitHub username:
set /p username=Username: 

if "%username%" equ "" (
    echo ERROR: Username cannot be empty!
    pause
    exit /b 1
)

set repo_name=government-forms-management-system

echo.
echo Repository details:
echo    Name: %repo_name%
echo    Owner: %username%
echo    URL: https://github.com/%username%/%repo_name%
echo.

echo Please create this repository on GitHub:
echo    1. Go to: https://github.com/new
echo    2. Repository name: %repo_name%
echo    3. Description: Comprehensive government forms management system
echo    4. Make it Public
echo    5. Do NOT check any initialization boxes
echo    6. Click "Create repository"
echo.

echo Opening GitHub in your browser...
start https://github.com/new

echo.
echo After creating the repository, press any key to continue...
pause >nul

echo.
echo ==============================================
echo     UPLOADING TO GITHUB
echo ==============================================
echo.

echo [1/3] Adding GitHub remote...
git remote add origin https://github.com/%username%/%repo_name%.git

echo [2/3] Setting main branch...
git branch -M main

:push_existing
echo [3/3] Pushing to GitHub...
echo.
echo You may need to enter your GitHub credentials:
echo    Username: Your GitHub username
echo    Password: Personal Access Token (generate at github.com/settings/tokens)
echo.

git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ==============================================
    echo       SUCCESS! UPLOADED TO GITHUB
    echo ==============================================
    echo.
    echo Your repository is now live at:
    echo    https://github.com/%username%/%repo_name%
    echo.
    echo Opening your repository...
    start https://github.com/%username%/%repo_name%
    echo.
    echo Congratulations! Your project is now on GitHub!
) else (
    echo.
    echo ==============================================
    echo       UPLOAD FAILED
    echo ==============================================
    echo.
    echo Please check:
    echo    - Repository was created on GitHub
    echo    - Username is correct
    echo    - You have internet connection
    echo    - Use Personal Access Token for password
    echo.
    echo Generate token at: https://github.com/settings/tokens
)

echo.
echo Press any key to exit...
pause >nul
