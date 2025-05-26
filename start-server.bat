@echo off
echo Killing any existing Node processes...
taskkill /f /im node.exe 2>nul
echo.
echo Cleaning build cache...
rmdir /s /q .next 2>nul
echo.
echo Starting Trenches Buddy on port 3000...
echo.
npx next dev --port 3000
pause 