"""
Main video editor for Auto Media Editor
"""

import cv2
import numpy as np
from moviepy.editor import VideoFileClip, concatenate_videoclips
from pathlib import Path
from typing import Optional, Dict, Any, List
from ..utils.config import config
from ..utils.logger import get_logger
from ..utils.file_utils import FileUtils
from .stabilization import VideoStabilizer
from .scene_detection import SceneDetector
from .effects import VideoEffects

logger = get_logger(__name__)


class VideoEditor:
    """Main video editor class"""
    
    def __init__(self):
        """Initialize video editor"""
        self.config = config.get_video_config()
        self.stabilizer = VideoStabilizer()
        self.scene_detector = SceneDetector()
        self.effects = VideoEffects()
        
        logger.info("Video editor initialized")
    
    def edit_video(self, input_path: str, output_path: str,
                   options: Optional[Dict[str, Any]] = None) -> str:
        """
        Edit video with specified options
        
        Args:
            input_path: Input video path
            output_path: Output video path
            options: Editing options
            
        Returns:
            Output video path
        """
        options = options or {}
        
        # Validate input file
        if not FileUtils.is_supported_file(input_path):
            raise ValueError(f"Unsupported file type: {input_path}")
        
        logger.info(f"Editing video: {input_path}")
        
        # Load video
        video_clip = VideoFileClip(input_path)
        
        # Apply editing options
        edited_clip = self._apply_editing(video_clip, options)
        
        # Save edited video
        edited_clip.write_videofile(
            output_path,
            codec=self.config.get('formats', {}).get('codec', 'libx264'),
            audio_codec='aac'
        )
        
        # Clean up
        video_clip.close()
        edited_clip.close()
        
        logger.info(f"Video edited successfully: {output_path}")
        return output_path
    
    def stabilize_video(self, input_path: str, output_path: Optional[str] = None) -> str:
        """
        Stabilize video
        
        Args:
            input_path: Input video path
            output_path: Output video path (optional)
            
        Returns:
            Output video path
        """
        if output_path is None:
            output_path = FileUtils.get_output_path(
                input_path, 
                Path(input_path).parent, 
                "_stabilized.mp4"
            )
        
        options = {
            'stabilization': True
        }
        
        return self.edit_video(input_path, output_path, options)
    
    def auto_cut(self, input_path: str, output_path: Optional[str] = None) -> str:
        """
        Auto cut video based on scene detection
        
        Args:
            input_path: Input video path
            output_path: Output video path (optional)
            
        Returns:
            Output video path
        """
        if output_path is None:
            output_path = FileUtils.get_output_path(
                input_path, 
                Path(input_path).parent, 
                "_cut.mp4"
            )
        
        options = {
            'auto_cut': True
        }
        
        return self.edit_video(input_path, output_path, options)
    
    def adjust_speed(self, input_path: str, speed: float, 
                    output_path: Optional[str] = None) -> str:
        """
        Adjust video speed
        
        Args:
            input_path: Input video path
            speed: Speed multiplier
            output_path: Output video path (optional)
            
        Returns:
            Output video path
        """
        if output_path is None:
            output_path = FileUtils.get_output_path(
                input_path, 
                Path(input_path).parent, 
                f"_speed{speed}x.mp4"
            )
        
        options = {
            'speed': speed
        }
        
        return self.edit_video(input_path, output_path, options)
    
    def batch_process(self, input_dir: str, output_dir: str,
                     options: Optional[Dict[str, Any]] = None) -> List[str]:
        """
        Process multiple videos in batch
        
        Args:
            input_dir: Input directory
            output_dir: Output directory
            options: Processing options
            
        Returns:
            List of output file paths
        """
        input_files = FileUtils.batch_process_files(input_dir, 'video')
        
        if not input_files:
            logger.warning(f"No video files found in {input_dir}")
            return []
        
        logger.info(f"Processing {len(input_files)} videos in batch")
        
        output_paths = []
        for input_file in input_files:
            try:
                output_file = FileUtils.get_output_path(
                    input_file, output_dir
                )
                output_path = self.edit_video(input_file, output_file, options)
                output_paths.append(output_path)
            except Exception as e:
                logger.error(f"Failed to process {input_file}: {e}")
        
        logger.info(f"Batch processing completed: {len(output_paths)} files processed")
        return output_paths
    
    def get_video_info(self, video_path: str) -> Dict[str, Any]:
        """
        Get video information
        
        Args:
            video_path: Path to video file
            
        Returns:
            Video information dictionary
        """
        file_info = FileUtils.get_file_info(video_path)
        
        # Load video to get additional info
        video_clip = VideoFileClip(video_path)
        
        info = {
            **file_info,
            'duration': video_clip.duration,
            'fps': video_clip.fps,
            'width': video_clip.w,
            'height': video_clip.h,
            'aspect_ratio': video_clip.w / video_clip.h,
            'has_audio': video_clip.audio is not None,
            'file_type': FileUtils.get_file_type(video_path)
        }
        
        video_clip.close()
        return info
    
    def _apply_editing(self, video_clip: VideoFileClip, options: Dict[str, Any]) -> VideoFileClip:
        """
        Apply editing options to video clip
        
        Args:
            video_clip: Input video clip
            options: Editing options
            
        Returns:
            Edited video clip
        """
        edited_clip = video_clip
        
        # Stabilization
        if options.get('stabilization', False):
            logger.debug("Applying video stabilization")
            edited_clip = self.stabilizer.stabilize(edited_clip)
        
        # Auto cut
        if options.get('auto_cut', False):
            logger.debug("Applying auto cut")
            edited_clip = self.scene_detector.auto_cut(edited_clip)
        
        # Speed adjustment
        if 'speed' in options:
            speed = options['speed']
            logger.debug(f"Adjusting speed to {speed}x")
            edited_clip = edited_clip.speedx(speed)
        
        # Effects
        if options.get('effects', False):
            logger.debug("Applying video effects")
            edited_clip = self.effects.apply_effects(edited_clip, options.get('effect_type', 'enhance'))
        
        return edited_clip