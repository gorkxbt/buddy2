@echo off
echo.
echo ========================================
echo   TRENCHES BUDDY - STARTING SERVER
echo ========================================
echo.
echo Killing any existing processes...
taskkill /f /im node.exe >nul 2>&1
echo.
echo Cleaning cache...
rmdir /s /q .next >nul 2>&1
echo.
echo Starting server on port 3000...
echo.
echo Open your browser and go to:
echo http://localhost:3000
echo.
echo ========================================
echo.
npm run dev 