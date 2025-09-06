#!/usr/bin/env python3
"""
Script to setup GitHub repository for Auto Media Editor
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, cwd=None):
    """Run a shell command"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True, cwd=cwd)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running command: {command}")
        print(f"Error: {e.stderr}")
        return None

def setup_github_repo():
    """Setup GitHub repository"""
    print("🚀 Setting up GitHub repository for Auto Media Editor")
    print("=" * 60)
    
    # Check if git is installed
    if not run_command("git --version"):
        print("❌ Git is not installed. Please install Git first.")
        return False
    
    # Check if we're in a git repository
    if not os.path.exists(".git"):
        print("📁 Initializing git repository...")
        if not run_command("git init"):
            print("❌ Failed to initialize git repository")
            return False
    
    # Add all files
    print("📝 Adding files to git...")
    if not run_command("git add ."):
        print("❌ Failed to add files to git")
        return False
    
    # Initial commit
    print("💾 Creating initial commit...")
    if not run_command('git commit -m "Initial commit: Auto Media Editor project"'):
        print("❌ Failed to create initial commit")
        return False
    
    print("✅ Local git repository setup completed!")
    
    # Ask user if they want to create GitHub repository
    print("\n" + "=" * 60)
    print("🌐 GitHub Repository Setup")
    print("=" * 60)
    
    create_remote = input("Do you want to create a GitHub repository? (y/n): ").lower().strip()
    
    if create_remote == 'y':
        repo_name = input("Enter repository name (default: auto-media-editor): ").strip()
        if not repo_name:
            repo_name = "auto-media-editor"
        
        print(f"📦 Creating GitHub repository: {repo_name}")
        
        # Check if gh CLI is installed
        if run_command("gh --version"):
            # Create repository using GitHub CLI
            if run_command(f'gh repo create {repo_name} --public --description "Automatic Image, Video, and Audio Processing Tool" --source=. --remote=origin --push'):
                print(f"✅ GitHub repository created: https://github.com/your-username/{repo_name}")
            else:
                print("❌ Failed to create GitHub repository using gh CLI")
                print("Please create the repository manually on GitHub and run:")
                print(f"git remote add origin https://github.com/your-username/{repo_name}.git")
                print("git push -u origin main")
        else:
            print("⚠️  GitHub CLI not found. Please create the repository manually:")
            print("1. Go to https://github.com/new")
            print(f"2. Create repository: {repo_name}")
            print("3. Run the following commands:")
            print(f"   git remote add origin https://github.com/your-username/{repo_name}.git")
            print("   git push -u origin main")
    
    print("\n" + "=" * 60)
    print("🎉 Setup completed!")
    print("=" * 60)
    print("Next steps:")
    print("1. Install dependencies: pip install -r requirements.txt")
    print("2. Run examples: python examples/basic_usage.py")
    print("3. Use CLI: python -m src.main --help")
    print("4. Start web interface: python -m src.main web")
    
    return True

def main():
    """Main function"""
    try:
        setup_github_repo()
    except KeyboardInterrupt:
        print("\n❌ Setup cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()