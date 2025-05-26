@echo off
echo Starting Trenches Buddy Debug Mode...
echo.
echo Current directory: %CD%
echo.
echo Checking Node.js version:
node --version
echo.
echo Checking npm version:
npm --version
echo.
echo Starting development server...
npm run dev
echo.
echo Server stopped. Press any key to exit.
pause 