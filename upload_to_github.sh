#!/bin/bash
# GitHub Upload Script for Government Forms Management System

echo "=============================================="
echo "    AUTOMATIC GITHUB REPOSITORY UPLOAD"
echo "=============================================="
echo

# Project configuration
REPO_NAME="government-forms-management-system"
REPO_DESC="🏛️ Comprehensive government forms and citizen feedback management system built with Django REST API + Next.js frontend"
PROJECT_DIR="/c/Users/YASSER/Desktop/django_project"

echo "Project: $REPO_NAME"
echo "Directory: $PROJECT_DIR"
echo

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Check if git repo
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a Git repository!"
    exit 1
fi

echo "✅ Git repository detected"
echo "📊 Checking project status..."

# Get file count
FILE_COUNT=$(git ls-files | wc -l)
echo "📁 Files ready: $FILE_COUNT"

# Get commit count
COMMIT_COUNT=$(git rev-list --count HEAD)
echo "📝 Commits: $COMMIT_COUNT"

echo
echo "=============================================="
echo "    GITHUB REPOSITORY CREATION"
echo "=============================================="
echo

# Ask for GitHub username
read -p "🔑 Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Username required!"
    exit 1
fi

echo
echo "🌐 Repository will be created at:"
echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
echo

# Open GitHub new repository page
if command -v start &> /dev/null; then
    start "https://github.com/new"
elif command -v open &> /dev/null; then
    open "https://github.com/new"
else
    echo "Please open: https://github.com/new"
fi

echo
echo "📋 Repository Details (copy-paste ready):"
echo "----------------------------------------"
echo "Repository name: $REPO_NAME"
echo "Description: $REPO_DESC"
echo "Visibility: Public ✅"
echo "Initialize: ❌ NO FILES (uncheck all boxes)"
echo
echo "⏳ Create the repository on GitHub, then press Enter to continue..."
read

echo
echo "=============================================="
echo "    UPLOADING TO GITHUB"
echo "=============================================="
echo

# Remove existing remote if any
git remote remove origin 2>/dev/null || true

# Add new remote
echo "🔗 [1/3] Adding GitHub remote..."
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

# Set main branch
echo "🌿 [2/3] Setting main branch..."
git branch -M main

# Push to GitHub
echo "🚀 [3/3] Pushing to GitHub..."
echo
echo "🔐 Authentication required:"
echo "   Username: $GITHUB_USER"
echo "   Password: Personal Access Token (generate at github.com/settings/tokens)"
echo

if git push -u origin main; then
    echo
    echo "=============================================="
    echo "       🎉 SUCCESS! 🎉"
    echo "=============================================="
    echo
    echo "✅ Project uploaded successfully!"
    echo "🌐 Repository: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo "📊 Files uploaded: $FILE_COUNT"
    echo "📝 Commits pushed: $COMMIT_COUNT"
    echo
    echo "🔗 Opening repository..."
    
    # Open repository
    if command -v start &> /dev/null; then
        start "https://github.com/$GITHUB_USER/$REPO_NAME"
    elif command -v open &> /dev/null; then
        open "https://github.com/$GITHUB_USER/$REPO_NAME"
    fi
    
    echo
    echo "🎯 Next steps:"
    echo "   ⭐ Star your repository"
    echo "   🏷️  Add topics: django, nextjs, government"
    echo "   💬 Enable Issues and Discussions"
    echo "   🤝 Share with the community"
    echo
    echo "🎊 Congratulations! Your Government Forms Management System is now live!"
    
else
    echo
    echo "=============================================="
    echo "       ❌ UPLOAD FAILED"
    echo "=============================================="
    echo
    echo "🔍 Common solutions:"
    echo "   1. Use Personal Access Token (not password)"
    echo "   2. Check repository name and username"
    echo "   3. Ensure repository was created on GitHub"
    echo "   4. Try: git push -u origin main"
    echo
    echo "💡 Generate token at: https://github.com/settings/tokens"
    echo "📖 Full guide: check FINAL_UPLOAD_GUIDE.md"
fi

echo
echo "Upload process completed."
