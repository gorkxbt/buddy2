@echo off
cls
echo.
echo ==========================================
echo    TRENCHES BUDDY - CLEAN START
echo ==========================================
echo.
echo [1/4] Stopping existing processes...
taskkill /f /im node.exe >nul 2>&1
echo     ✓ Processes stopped
echo.
echo [2/4] Cleaning build cache...
rmdir /s /q .next >nul 2>&1
echo     ✓ Cache cleaned
echo.
echo [3/4] Starting development server...
echo     ⏳ Please wait...
echo.
echo [4/4] Server will be available at:
echo     → http://localhost:3000
echo.
echo ==========================================
echo.
npm run dev 