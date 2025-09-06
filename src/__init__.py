"""
Auto Media Editor - Automatic Image, Video, and Audio Processing
"""

__version__ = "1.0.0"
__author__ = "Auto Media Editor Team"
__email__ = "contact@automediaeditor.com"

from .image_processor import ImageProcessor
from .video_editor import VideoEditor
from .audio_mixer import AudioMixer

__all__ = [
    "ImageProcessor",
    "VideoEditor", 
    "AudioMixer"
]