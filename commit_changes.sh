#!/bin/bash

echo "Checking git status..."
git status

echo ""
echo "Adding all changes..."
git add .

echo ""
echo "Committing changes..."
git commit -m "feat: Add Featured Products functionality and update README"

echo ""
echo "Done."
