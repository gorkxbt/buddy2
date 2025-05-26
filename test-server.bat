@echo off
echo Testing Trenches Buddy Server...
echo.
echo Checking if server is running on port 3010...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3010' -TimeoutSec 5; Write-Host 'Server is running! Status:' $response.StatusCode } catch { Write-Host 'Server not responding or not running' }"
echo.
echo You can access the application at: http://localhost:3010
pause 