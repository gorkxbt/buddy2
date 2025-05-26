@echo off
echo Pushing changes to GitHub...
echo.

echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "Fix server startup issues: updated start-dev.bat to use port 3010, added test-server.bat for server verification"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo Done! Changes pushed to https://github.com/gorkxbt/buddy2
pause 