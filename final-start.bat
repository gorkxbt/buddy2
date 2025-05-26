@echo off
echo ========================================
echo   TRENCHES BUDDY - FINAL STARTUP
echo ========================================
echo.
echo Killing any existing Node processes...
taskkill /f /im node.exe >nul 2>&1
echo.
echo Cleaning build cache...
rmdir /s /q .next >nul 2>&1
echo.
echo Starting development server...
echo.
echo Your Trenches Buddy will be available at:
echo http://localhost:3000
echo.
echo ========================================
echo.
npm run dev 