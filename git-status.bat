@echo off
echo Current Git Status:
git status
echo.
echo Recent commits:
git log --oneline -5
echo.
pause