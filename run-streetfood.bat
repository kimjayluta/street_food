@echo off
cd /d "%~dp0"

echo Starting Streetfood App...

REM START THE APP (Vite/React)
call npm run dev

REM OR: If you're using Express/Node backend
:: call node index.js

pause
