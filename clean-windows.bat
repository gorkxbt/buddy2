@echo off
echo Cleaning up Next.js development environment...

REM Kill any running Node.js processes
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Remove .next folder
if exist ".next" (
    echo Removing .next folder...
    rmdir /s /q ".next" 2>nul
    timeout /t 1 /nobreak >nul
)

REM Remove .next folder again if it still exists (Windows sometimes needs this)
if exist ".next" (
    echo Force removing .next folder...
    rd /s /q ".next" 2>nul
)

echo Cleanup complete!
echo Starting Next.js development server...
npm run dev 