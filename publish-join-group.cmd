@echo off
REM Adds the "Join our free Facebook group" box to thejobseek.com and pushes it live.
REM Works in a fresh copy, so your own C:\projects\thejobseek folder is not touched.
set PATCH=%~dp0join-group.patch
cd /d %TEMP%
if exist tjs-join rmdir /s /q tjs-join
git -c core.autocrlf=false clone --depth 1 https://github.com/mrjaved121/thejobseek.git tjs-join || goto :fail
cd tjs-join
git apply "%PATCH%" || goto :fail
git add -A
git commit -m "Add Join our free Facebook group box (articles, sidebar, header)" || goto :fail
git push origin main || goto :fail
echo.
echo DONE - DigitalOcean will deploy the site in a few minutes.
pause
exit /b 0
:fail
echo.
echo Something went wrong - copy the message above and send it to Claude.
pause
exit /b 1
