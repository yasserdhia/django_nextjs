@echo off
setlocal enabledelayedexpansion

echo ==============================================
echo     AUTOMATIC GITHUB REPOSITORY UPLOAD
echo ==============================================
echo.

REM Project configuration
set "REPO_NAME=government-forms-management-system"
set "REPO_DESC=Comprehensive government forms and citizen feedback management system built with Django REST API + Next.js frontend"

echo Project: %REPO_NAME%
echo Directory: %CD%
echo.

REM Check if git repo
if not exist ".git" (
    echo Error: Not a Git repository!
    pause
    exit /b 1
)

echo Git repository detected
echo Checking project status...

REM Get file count
for /f %%i in ('git ls-files ^| find /c /v ""') do set FILE_COUNT=%%i
echo Files ready: %FILE_COUNT%

REM Get commit count  
for /f %%i in ('git rev-list --count HEAD') do set COMMIT_COUNT=%%i
echo Commits: %COMMIT_COUNT%

echo.
echo ==============================================
echo     GITHUB REPOSITORY CREATION
echo ==============================================
echo.

REM Ask for GitHub username
set /p GITHUB_USER=Enter your GitHub username: 

if "%GITHUB_USER%"=="" (
    echo Username required!
    pause
    exit /b 1
)

echo.
echo Repository will be created at:
echo    https://github.com/%GITHUB_USER%/%REPO_NAME%
echo.

REM Open GitHub new repository page
start https://github.com/new

echo.
echo Repository Details (copy-paste ready):
echo ----------------------------------------
echo Repository name: %REPO_NAME%
echo Description: %REPO_DESC%
echo Visibility: Public
echo Initialize: NO FILES (uncheck all boxes)
echo.
echo Create the repository on GitHub, then press any key to continue...
pause

echo.
echo ==============================================
echo     UPLOADING TO GITHUB
echo ==============================================
echo.

REM Remove existing remote if any
git remote remove origin 2>nul

REM Add new remote
echo [1/3] Adding GitHub remote...
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git

REM Set main branch
echo [2/3] Setting main branch...
git branch -M main

REM Push to GitHub
echo [3/3] Pushing to GitHub...
echo.
echo Authentication required:
echo    Username: %GITHUB_USER%
echo    Password: Personal Access Token (generate at github.com/settings/tokens)
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==============================================
    echo        SUCCESS!
    echo ==============================================
    echo.
    echo Project uploaded successfully!
    echo Repository: https://github.com/%GITHUB_USER%/%REPO_NAME%
    echo Files uploaded: %FILE_COUNT%
    echo Commits pushed: %COMMIT_COUNT%
    echo.
    echo Opening repository...
    start https://github.com/%GITHUB_USER%/%REPO_NAME%
    echo.
    echo Next steps:
    echo    Star your repository
    echo    Add topics: django, nextjs, government
    echo    Enable Issues and Discussions
    echo    Share with the community
    echo.
    echo Congratulations! Your Government Forms Management System is now live!
) else (
    echo.
    echo ==============================================
    echo        UPLOAD FAILED
    echo ==============================================
    echo.
    echo Common solutions:
    echo    1. Use Personal Access Token (not password)
    echo    2. Check repository name and username
    echo    3. Ensure repository was created on GitHub
    echo    4. Try: git push -u origin main
    echo.
    echo Generate token at: https://github.com/settings/tokens
    echo Full guide: check FINAL_UPLOAD_GUIDE.md
)

echo.
echo Upload process completed.
pause
