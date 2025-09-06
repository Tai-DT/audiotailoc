"""
Video editing module for Auto Media Editor
"""

from .editor import VideoEditor
from .stabilization import VideoStabilizer
from .scene_detection import SceneDetector
from .effects import VideoEffects

__all__ = [
    "VideoEditor",
    "VideoStabilizer",
    "SceneDetector", 
    "VideoEffects"
]