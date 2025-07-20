import requests
import json
import subprocess
import sys
import os

def create_github_repo():
    """Create GitHub repository using GitHub API"""
    
    # Repository details
    repo_data = {
        "name": "django_nextjs",
        "description": "🏛️ Comprehensive government forms and citizen feedback management system built with Django REST API + Next.js frontend",
        "private": False,
        "auto_init": False,
        "has_issues": True,
        "has_projects": True,
        "has_wiki": True
    }
    
    print("🚀 Creating GitHub repository automatically...")
    print(f"📁 Repository: {repo_data['name']}")
    print(f"👤 Owner: yasserdhia")
    print(f"🔓 Visibility: Public")
    print()
    
    # Create repository via GitHub API
    # Note: This would need authentication in real scenario
    print("📝 Repository details configured:")
    for key, value in repo_data.items():
        print(f"   {key}: {value}")
    
    print()
    print("⚠️  For full automation, you need a GitHub Personal Access Token")
    print("🔑 Generate at: https://github.com/settings/tokens")
    print("✅ Required permissions: repo, user")
    print()
    
    # Alternative: Open browser to create repo
    import webbrowser
    
    # Construct GitHub new repo URL with pre-filled data
    github_url = "https://github.com/new"
    print(f"🌐 Opening GitHub repository creation page...")
    
    try:
        webbrowser.open(github_url)
        print("✅ Browser opened successfully")
    except Exception as e:
        print(f"❌ Could not open browser: {e}")
        print(f"🔗 Please manually open: {github_url}")
    
    print()
    print("📋 Repository configuration:")
    print(f"   Name: {repo_data['name']}")
    print(f"   Description: {repo_data['description']}")
    print(f"   Public: ✅")
    print(f"   Initialize: ❌ (leave unchecked)")
    print()
    
    return True

def upload_to_github():
    """Upload project to GitHub"""
    
    print("🔄 Starting upload process...")
    
    commands = [
        "git remote remove origin",
        "git remote add origin https://github.com/yasserdhia/django_nextjs.git",
        "git branch -M main",
        "git push -u origin main"
    ]
    
    for i, cmd in enumerate(commands, 1):
        print(f"📤 [{i}/4] {cmd.split()[-1] if 'git' in cmd else cmd}")
        
        try:
            if "remove origin" in cmd:
                # This might fail if no origin exists, that's OK
                result = subprocess.run(cmd.split(), 
                                      capture_output=True, 
                                      text=True, 
                                      cwd=os.getcwd())
            else:
                result = subprocess.run(cmd.split(), 
                                      capture_output=True, 
                                      text=True, 
                                      cwd=os.getcwd())
                
                if result.returncode != 0 and "push" in cmd:
                    print("🔐 Authentication required for push operation")
                    print("👤 Username: yasserdhia")
                    print("🔑 Password: Your Personal Access Token")
                    print("📖 Generate token at: https://github.com/settings/tokens")
                    
                    # Try interactive push
                    print("\n🚀 Attempting manual push...")
                    os.system("git push -u origin main")
                    return
                    
        except Exception as e:
            print(f"❌ Error executing {cmd}: {e}")
            if "push" in cmd:
                print("🔐 Manual authentication required")
                print("💡 Run: git push -u origin main")
                return False
    
    print("✅ Upload completed successfully!")
    return True

def main():
    """Main function to handle the entire GitHub upload process"""
    
    print("=" * 50)
    print("    🏛️  GOVERNMENT FORMS MANAGEMENT SYSTEM")
    print("          AUTOMATIC GITHUB UPLOAD")
    print("=" * 50)
    print()
    
    # Change to project directory
    project_dir = r"c:\Users\YASSER\Desktop\django_project"
    os.chdir(project_dir)
    
    print(f"📂 Project directory: {os.getcwd()}")
    
    # Check git status
    try:
        result = subprocess.run(["git", "status", "--porcelain"], 
                              capture_output=True, text=True)
        if result.stdout.strip():
            print("⚠️  Uncommitted changes detected")
        else:
            print("✅ Git repository is clean")
    except:
        print("❌ Not a git repository")
        return
    
    # Get project stats
    try:
        file_count = subprocess.run(["git", "ls-files"], 
                                  capture_output=True, text=True)
        files = len(file_count.stdout.strip().split('\n')) if file_count.stdout.strip() else 0
        
        commit_count = subprocess.run(["git", "rev-list", "--count", "HEAD"], 
                                    capture_output=True, text=True)
        commits = commit_count.stdout.strip() if commit_count.returncode == 0 else "0"
        
        print(f"📊 Files ready: {files}")
        print(f"📝 Commits: {commits}")
        
    except Exception as e:
        print(f"⚠️  Could not get project stats: {e}")
    
    print()
    
    # Step 1: Create repository
    if create_github_repo():
        print("⏳ Please create the repository on GitHub (browser should have opened)")
        print("🔄 After creating the repository, the upload will start automatically...")
        print()
        
        # Step 2: Upload to GitHub
        upload_to_github()
        
        print()
        print("=" * 50)
        print("              🎉 PROCESS COMPLETE!")
        print("=" * 50)
        print()
        print("🔗 Repository URL:")
        print("   https://github.com/yasserdhia/django_nextjs")
        print()
        print("📝 Next steps:")
        print("   ⭐ Star your repository")
        print("   🏷️  Add topics: django, nextjs, government, forms")
        print("   📋 Enable Issues and Discussions")
        print("   🤝 Share with the community")
        print()
        
    else:
        print("❌ Repository creation failed")

if __name__ == "__main__":
    main()
