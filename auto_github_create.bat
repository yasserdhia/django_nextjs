@echo off
setlocal enabledelayedexpansion

echo ==============================================
echo    AUTOMATIC GITHUB REPOSITORY CREATION
echo ==============================================
echo.

:: Project details
set REPO_NAME=government-forms-management-system
set REPO_DESC=Comprehensive government forms and citizen feedback management system built with Django REST API + Next.js frontend
set REPO_TOPICS=django,nextjs,government,forms-management,docker,postgresql,rest-api,typescript

echo Creating GitHub repository automatically...
echo Repository: %REPO_NAME%
echo Description: %REPO_DESC%
echo.

:: Change to project directory
cd /d "c:\Users\YASSER\Desktop\django_project"

:: Check if curl is available
curl --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: curl is not available. Please install curl or use manual method.
    echo.
    echo Manual steps:
    echo 1. Go to: https://github.com/new
    echo 2. Repository name: %REPO_NAME%
    echo 3. Description: %REPO_DESC%
    echo 4. Make it Public
    echo 5. Don't initialize with any files
    echo 6. Create repository
    echo.
    echo Then run: git push commands manually
    pause
    exit /b 1
)

:: Prompt for GitHub credentials
echo GitHub credentials required:
set /p GITHUB_USER=Enter your GitHub username: 
set /p GITHUB_TOKEN=Enter your Personal Access Token (from github.com/settings/tokens): 

echo.
echo Creating repository via GitHub API...

:: Create repository using GitHub API
curl -X POST ^
  -H "Authorization: token %GITHUB_TOKEN%" ^
  -H "Accept: application/vnd.github.v3+json" ^
  -d "{\"name\":\"%REPO_NAME%\",\"description\":\"%REPO_DESC%\",\"private\":false,\"auto_init\":false}" ^
  https://api.github.com/user/repos

echo.
echo Repository creation attempted. Now pushing code...
echo.

:: Add remote and push
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
git branch -M main
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ==============================================
    echo       SUCCESS! PROJECT UPLOADED TO GITHUB
    echo ==============================================
    echo.
    echo Repository URL: https://github.com/%GITHUB_USER%/%REPO_NAME%
    echo.
    echo Opening repository in browser...
    start https://github.com/%GITHUB_USER%/%REPO_NAME%
    
    :: Add topics via API
    echo Adding repository topics...
    curl -X PUT ^
      -H "Authorization: token %GITHUB_TOKEN%" ^
      -H "Accept: application/vnd.github.v3+json" ^
      -d "{\"names\":[\"%REPO_TOPICS:,=\",\"%\"]}" ^
      https://api.github.com/repos/%GITHUB_USER%/%REPO_NAME%/topics
      
    echo.
    echo Repository setup complete!
    
) else (
    echo.
    echo ==============================================
    echo       UPLOAD FAILED - TRYING ALTERNATIVE
    echo ==============================================
    echo.
    echo Opening GitHub manually for repository creation...
    start https://github.com/new
    echo.
    echo Manual setup required:
    echo 1. Create repository: %REPO_NAME%
    echo 2. Description: %REPO_DESC%
    echo 3. Make it Public
    echo 4. Don't initialize
    echo 5. Then run: git push -u origin main
)

echo.
pause
