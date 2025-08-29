#!/usr/bin/env python3
"""
Script to create a complete Auto Media Editor project
"""

import os
import shutil
from pathlib import Path

def create_project():
    """Create the complete project structure"""
    print("🚀 Creating Auto Media Editor Project")
    print("=" * 50)
    
    # Create project structure
    directories = [
        "src",
        "src/image_processor", 
        "src/video_editor",
        "src/audio_mixer",
        "src/utils",
        "config",
        "models",
        "tests",
        "examples",
        "docs",
        "web_interface",
        "scripts"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {directory}")
    
    # Create __init__.py files
    init_files = [
        "src/__init__.py",
        "src/image_processor/__init__.py",
        "src/video_editor/__init__.py", 
        "src/audio_mixer/__init__.py",
        "src/utils/__init__.py",
        "examples/__init__.py"
    ]
    
    for init_file in init_files:
        Path(init_file).touch()
        print(f"✅ Created file: {init_file}")
    
    print("\n🎉 Project structure created successfully!")
    print("\nNext steps:")
    print("1. Install dependencies: pip install -r requirements.txt")
    print("2. Run examples: python examples/basic_usage.py")
    print("3. Use CLI: python -m src.main --help")
    print("4. Start web interface: python -m src.main web")

if __name__ == "__main__":
    create_project()