"""
Main audio mixer for Auto Media Editor
"""

import librosa
import numpy as np
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip
from pathlib import Path
from typing import Optional, Dict, Any, List
from ..utils.config import config
from ..utils.logger import get_logger
from ..utils.file_utils import FileUtils
from .effects import AudioEffects
from .normalization import AudioNormalizer

logger = get_logger(__name__)


class AudioMixer:
    """Main audio mixer class"""
    
    def __init__(self):
        """Initialize audio mixer"""
        self.config = config.get_audio_config()
        self.effects = AudioEffects()
        self.normalizer = AudioNormalizer()
        
        logger.info("Audio mixer initialized")
    
    def add_background_music(self, video_path: str, music_path: str, output_path: str,
                           volume_ratio: float = 0.3, fade_in: float = 2.0, 
                           fade_out: float = 3.0) -> str:
        """
        Add background music to video
        
        Args:
            video_path: Input video path
            music_path: Background music path
            output_path: Output video path
            volume_ratio: Background music volume ratio (0.0-1.0)
            fade_in: Fade in duration (seconds)
            fade_out: Fade out duration (seconds)
            
        Returns:
            Output video path
        """
        logger.info(f"Adding background music to video: {video_path}")
        
        # Load video and audio
        video_clip = VideoFileClip(video_path)
        music_clip = AudioFileClip(music_path)
        
        # Process audio
        mixed_audio = self._mix_audio(video_clip, music_clip, volume_ratio, fade_in, fade_out)
        
        # Combine video with mixed audio
        final_video = video_clip.set_audio(mixed_audio)
        
        # Save result
        final_video.write_videofile(
            output_path,
            codec='libx264',
            audio_codec='aac'
        )
        
        # Clean up
        video_clip.close()
        music_clip.close()
        final_video.close()
        
        logger.info(f"Background music added successfully: {output_path}")
        return output_path
    
    def normalize_audio(self, audio_path: str, output_path: Optional[str] = None) -> str:
        """
        Normalize audio levels
        
        Args:
            audio_path: Input audio path
            output_path: Output audio path (optional)
            
        Returns:
            Output audio path
        """
        if output_path is None:
            output_path = FileUtils.get_output_path(
                audio_path, 
                Path(audio_path).parent, 
                "_normalized.mp3"
            )
        
        logger.info(f"Normalizing audio: {audio_path}")
        
        # Load audio
        audio_clip = AudioFileClip(audio_path)
        
        # Normalize
        normalized_audio = self.normalizer.normalize(audio_clip)
        
        # Save result
        normalized_audio.write_audiofile(output_path)
        
        # Clean up
        audio_clip.close()
        normalized_audio.close()
        
        logger.info(f"Audio normalized successfully: {output_path}")
        return output_path
    
    def apply_audio_effects(self, audio_path: str, effects: List[str], 
                          output_path: Optional[str] = None) -> str:
        """
        Apply audio effects
        
        Args:
            audio_path: Input audio path
            effects: List of effects to apply
            output_path: Output audio path (optional)
            
        Returns:
            Output audio path
        """
        if output_path is None:
            output_path = FileUtils.get_output_path(
                audio_path, 
                Path(audio_path).parent, 
                "_effects.mp3"
            )
        
        logger.info(f"Applying audio effects: {effects}")
        
        # Load audio
        audio_clip = AudioFileClip(audio_path)
        
        # Apply effects
        processed_audio = self.effects.apply_effects(audio_clip, effects)
        
        # Save result
        processed_audio.write_audiofile(output_path)
        
        # Clean up
        audio_clip.close()
        processed_audio.close()
        
        logger.info(f"Audio effects applied successfully: {output_path}")
        return output_path
    
    def batch_process(self, input_dir: str, output_dir: str,
                     options: Optional[Dict[str, Any]] = None) -> List[str]:
        """
        Process multiple audio files in batch
        
        Args:
            input_dir: Input directory
            output_dir: Output directory
            options: Processing options
            
        Returns:
            List of output file paths
        """
        input_files = FileUtils.batch_process_files(input_dir, 'audio')
        
        if not input_files:
            logger.warning(f"No audio files found in {input_dir}")
            return []
        
        logger.info(f"Processing {len(input_files)} audio files in batch")
        
        output_paths = []
        for input_file in input_files:
            try:
                output_file = FileUtils.get_output_path(
                    input_file, output_dir
                )
                
                if options and options.get('normalize', False):
                    output_path = self.normalize_audio(input_file, output_file)
                else:
                    # Just copy the file
                    output_path = FileUtils.safe_copy(input_file, output_file)
                
                output_paths.append(output_path)
            except Exception as e:
                logger.error(f"Failed to process {input_file}: {e}")
        
        logger.info(f"Batch processing completed: {len(output_paths)} files processed")
        return output_paths
    
    def _mix_audio(self, video_clip: VideoFileClip, music_clip: AudioFileClip,
                  volume_ratio: float, fade_in: float, fade_out: float) -> CompositeAudioClip:
        """
        Mix video audio with background music
        
        Args:
            video_clip: Video clip
            music_clip: Music clip
            volume_ratio: Music volume ratio
            fade_in: Fade in duration
            fade_out: Fade out duration
            
        Returns:
            Mixed audio clip
        """
        # Get video audio
        video_audio = video_clip.audio
        
        # Adjust music to match video duration
        if music_clip.duration > video_clip.duration:
            music_clip = music_clip.subclip(0, video_clip.duration)
        else:
            # Loop music if it's shorter than video
            loops_needed = int(np.ceil(video_clip.duration / music_clip.duration))
            music_clip = CompositeAudioClip([music_clip] * loops_needed).subclip(0, video_clip.duration)
        
        # Apply volume adjustment and fades
        music_clip = (music_clip
                     .volumex(volume_ratio)
                     .audio_fadein(fade_in)
                     .audio_fadeout(fade_out))
        
        # Mix audio
        if video_audio is not None:
            mixed_audio = CompositeAudioClip([video_audio, music_clip])
        else:
            mixed_audio = music_clip
        
        return mixed_audio
    
    def get_audio_info(self, audio_path: str) -> Dict[str, Any]:
        """
        Get audio information
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Audio information dictionary
        """
        file_info = FileUtils.get_file_info(audio_path)
        
        # Load audio to get additional info
        y, sr = librosa.load(audio_path, sr=None)
        
        info = {
            **file_info,
            'duration': len(y) / sr,
            'sample_rate': sr,
            'channels': 1 if len(y.shape) == 1 else y.shape[1],
            'file_type': FileUtils.get_file_type(audio_path)
        }
        
        return info