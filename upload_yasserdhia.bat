@echo off
echo ============================================== 
echo    UPLOADING TO YASSERDHIA GITHUB ACCOUNT
echo ==============================================
echo.
echo Repository: government-forms-management-system
echo Account: yasserdhia
echo URL: https://github.com/yasserdhia/government-forms-management-system
echo.
echo Authentication needed:
echo Username: yasserdhia
echo Password: Your Personal Access Token
echo.
echo Generate token at: https://github.com/settings/tokens
echo Required permissions: repo (full repository access)
echo.
pause
echo.
echo Starting upload...
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ============================================== 
    echo              SUCCESS! 
    echo ==============================================
    echo.
    echo Project uploaded successfully!
    echo Repository: https://github.com/yasserdhia/government-forms-management-system
    echo.
    echo Opening repository...
    start https://github.com/yasserdhia/government-forms-management-system
    echo.
    echo Your Government Forms Management System is now live!
) else (
    echo ============================================== 
    echo              UPLOAD FAILED
    echo ==============================================
    echo.
    echo Please check:
    echo 1. Repository created on GitHub
    echo 2. Using Personal Access Token (not password)
    echo 3. Token has 'repo' permissions
    echo.
    echo Try again with: git push -u origin main
)
pause
