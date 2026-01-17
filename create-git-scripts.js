// Git commit and push script for Windows environments without Bash
// This script creates the necessary Git commands and executes them

const fs = require('fs');
const path = require('path');

// Git commit message
const commitMessage = `feat: Add comprehensive Firestick blog post with regional pricing

- Created detailed blog post highlighting Sellaap as affordable Firestick provider
- Added price comparisons for Europe (€59 vs €200-350), UK (£49 vs £180-300), US ($69 vs $250-400)
- Included 5 realistic images showcasing services and savings
- Added customer testimonials with specific savings amounts
- Integrated cross-selling for digital products
- Implemented SEO metadata with schema.org structured data
- Created API endpoint for blog post database integration
- Fixed Hero section link to digital products
- Added comprehensive FAQ section targeting high-cost payers

Blog post targets customers seeking affordable Firestick setup services
across Europe, UK, and US markets with 70% savings messaging.`;

// Create a batch file for Git operations
const batchContent = `@echo off
echo Adding all changes to Git...
git add .
echo Committing changes with message...
git commit -m "${commitMessage.replace(/"/g, '""')}"
echo Pushing to remote repository...
git push origin main
echo Git operations completed successfully!
pause`;

// Write the batch file
fs.writeFileSync('git-commit-push.bat', batchContent);
console.log('Created git-commit-push.bat');
console.log('To execute Git operations:');
console.log('1. Double-click git-commit-push.bat');
console.log('2. Or run: cmd /c git-commit-push.bat');
console.log('');
console.log('Alternative: Use Git GUI or GitHub Desktop');

// Also create a simple status check
const statusContent = `@echo off
echo Current Git Status:
git status
echo.
echo Recent commits:
git log --oneline -5
echo.
pause`;

fs.writeFileSync('git-status.bat', statusContent);
console.log('Created git-status.bat for checking repository status');