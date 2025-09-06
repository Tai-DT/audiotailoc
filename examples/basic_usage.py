"""
Basic usage examples for Auto Media Editor
"""

import os
from pathlib import Path
from src.image_processor import ImageProcessor
from src.video_editor import VideoEditor
from src.audio_mixer import AudioMixer

def main():
    """Basic usage examples"""
    
    # Create output directory
    output_dir = Path("examples/output")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("🚀 Auto Media Editor - Basic Usage Examples")
    print("=" * 50)
    
    # Example 1: Image Enhancement
    print("\n1. Image Enhancement Example")
    print("-" * 30)
    
    # Create a sample image (you would replace this with actual image path)
    sample_image = "examples/sample_image.jpg"
    
    if os.path.exists(sample_image):
        processor = ImageProcessor()
        
        # Enhance image
        enhanced_path = output_dir / "enhanced_image.jpg"
        try:
            result = processor.enhance(sample_image, str(enhanced_path), "medium")
            print(f"✅ Enhanced image saved to: {result}")
        except Exception as e:
            print(f"❌ Error enhancing image: {e}")
    else:
        print("⚠️  Sample image not found. Please add a sample image to examples/sample_image.jpg")
    
    # Example 2: Video Processing
    print("\n2. Video Processing Example")
    print("-" * 30)
    
    # Create a sample video (you would replace this with actual video path)
    sample_video = "examples/sample_video.mp4"
    
    if os.path.exists(sample_video):
        editor = VideoEditor()
        
        # Get video info
        try:
            info = editor.get_video_info(sample_video)
            print(f"📹 Video info: {info['width']}x{info['height']}, {info['duration']:.2f}s")
        except Exception as e:
            print(f"❌ Error getting video info: {e}")
    else:
        print("⚠️  Sample video not found. Please add a sample video to examples/sample_video.mp4")
    
    # Example 3: Audio Mixing
    print("\n3. Audio Mixing Example")
    print("-" * 30)
    
    # Create sample files (you would replace these with actual file paths)
    sample_video = "examples/sample_video.mp4"
    sample_music = "examples/sample_music.mp3"
    
    if os.path.exists(sample_video) and os.path.exists(sample_music):
        mixer = AudioMixer()
        
        # Mix audio
        mixed_path = output_dir / "mixed_video.mp4"
        try:
            result = mixer.add_background_music(
                sample_video, 
                sample_music, 
                str(mixed_path),
                volume_ratio=0.3
            )
            print(f"✅ Mixed video saved to: {result}")
        except Exception as e:
            print(f"❌ Error mixing audio: {e}")
    else:
        print("⚠️  Sample files not found. Please add sample video and music files")
    
    print("\n" + "=" * 50)
    print("🎉 Examples completed!")
    print(f"📁 Check output files in: {output_dir}")

if __name__ == "__main__":
    main()