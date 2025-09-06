"""
File utilities for Auto Media Editor
"""

import os
import shutil
import tempfile
from pathlib import Path
from typing import List, Optional, Tuple
from .config import config
from .logger import get_logger

logger = get_logger(__name__)


class FileUtils:
    """File utility functions"""
    
    # Supported file extensions
    IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
    VIDEO_EXTENSIONS = {'.mp4', '.avi', '.mov', '.mkv', '.webm'}
    AUDIO_EXTENSIONS = {'.mp3', '.wav', '.aac', '.flac', '.ogg'}
    
    @classmethod
    def get_file_type(cls, file_path: str) -> str:
        """
        Get file type based on extension
        
        Args:
            file_path: Path to file
            
        Returns:
            File type: 'image', 'video', 'audio', or 'unknown'
        """
        ext = Path(file_path).suffix.lower()
        
        if ext in cls.IMAGE_EXTENSIONS:
            return 'image'
        elif ext in cls.VIDEO_EXTENSIONS:
            return 'video'
        elif ext in cls.AUDIO_EXTENSIONS:
            return 'audio'
        else:
            return 'unknown'
    
    @classmethod
    def is_supported_file(cls, file_path: str) -> bool:
        """
        Check if file is supported
        
        Args:
            file_path: Path to file
            
        Returns:
            True if file is supported
        """
        return cls.get_file_type(file_path) != 'unknown'
    
    @classmethod
    def get_file_info(cls, file_path: str) -> dict:
        """
        Get file information
        
        Args:
            file_path: Path to file
            
        Returns:
            Dictionary with file information
        """
        path = Path(file_path)
        
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        stat = path.stat()
        
        return {
            'name': path.name,
            'stem': path.stem,
            'suffix': path.suffix,
            'type': cls.get_file_type(file_path),
            'size': stat.st_size,
            'size_mb': stat.st_size / (1024 * 1024),
            'created': stat.st_ctime,
            'modified': stat.st_mtime,
            'path': str(path.absolute())
        }
    
    @classmethod
    def create_temp_file(cls, suffix: str = '', prefix: str = 'auto_media_') -> str:
        """
        Create temporary file
        
        Args:
            suffix: File suffix
            prefix: File prefix
            
        Returns:
            Path to temporary file
        """
        temp_dir = config.temp_dir
        os.makedirs(temp_dir, exist_ok=True)
        
        fd, temp_path = tempfile.mkstemp(
            suffix=suffix,
            prefix=prefix,
            dir=temp_dir
        )
        os.close(fd)
        
        return temp_path
    
    @classmethod
    def create_temp_directory(cls, prefix: str = 'auto_media_') -> str:
        """
        Create temporary directory
        
        Args:
            prefix: Directory prefix
            
        Returns:
            Path to temporary directory
        """
        temp_dir = config.temp_dir
        os.makedirs(temp_dir, exist_ok=True)
        
        return tempfile.mkdtemp(prefix=prefix, dir=temp_dir)
    
    @classmethod
    def safe_copy(cls, src: str, dst: str, overwrite: bool = False) -> str:
        """
        Safely copy file
        
        Args:
            src: Source file path
            dst: Destination file path
            overwrite: Whether to overwrite existing file
            
        Returns:
            Destination file path
        """
        src_path = Path(src)
        dst_path = Path(dst)
        
        if not src_path.exists():
            raise FileNotFoundError(f"Source file not found: {src}")
        
        # Create destination directory if it doesn't exist
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Check if destination exists
        if dst_path.exists() and not overwrite:
            raise FileExistsError(f"Destination file exists: {dst}")
        
        # Copy file
        shutil.copy2(src_path, dst_path)
        logger.info(f"Copied {src} to {dst}")
        
        return str(dst_path)
    
    @classmethod
    def safe_move(cls, src: str, dst: str, overwrite: bool = False) -> str:
        """
        Safely move file
        
        Args:
            src: Source file path
            dst: Destination file path
            overwrite: Whether to overwrite existing file
            
        Returns:
            Destination file path
        """
        src_path = Path(src)
        dst_path = Path(dst)
        
        if not src_path.exists():
            raise FileNotFoundError(f"Source file not found: {src}")
        
        # Create destination directory if it doesn't exist
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Check if destination exists
        if dst_path.exists() and not overwrite:
            raise FileExistsError(f"Destination file exists: {dst}")
        
        # Move file
        shutil.move(str(src_path), str(dst_path))
        logger.info(f"Moved {src} to {dst}")
        
        return str(dst_path)
    
    @classmethod
    def cleanup_temp_files(cls, pattern: str = 'auto_media_*') -> int:
        """
        Clean up temporary files
        
        Args:
            pattern: File pattern to match
            
        Returns:
            Number of files cleaned up
        """
        temp_dir = Path(config.temp_dir)
        if not temp_dir.exists():
            return 0
        
        cleaned_count = 0
        
        for file_path in temp_dir.glob(pattern):
            try:
                if file_path.is_file():
                    file_path.unlink()
                elif file_path.is_dir():
                    shutil.rmtree(file_path)
                cleaned_count += 1
                logger.debug(f"Cleaned up: {file_path}")
            except Exception as e:
                logger.warning(f"Failed to clean up {file_path}: {e}")
        
        return cleaned_count
    
    @classmethod
    def get_output_path(cls, input_path: str, output_dir: str, 
                       new_suffix: Optional[str] = None) -> str:
        """
        Generate output file path
        
        Args:
            input_path: Input file path
            output_dir: Output directory
            new_suffix: New file suffix (optional)
            
        Returns:
            Output file path
        """
        input_path = Path(input_path)
        output_dir = Path(output_dir)
        
        # Create output directory
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate output filename
        if new_suffix:
            output_name = f"{input_path.stem}{new_suffix}"
        else:
            output_name = input_path.name
        
        return str(output_dir / output_name)
    
    @classmethod
    def batch_process_files(cls, input_dir: str, file_type: str = 'all') -> List[str]:
        """
        Get list of files for batch processing
        
        Args:
            input_dir: Input directory
            file_type: File type filter ('image', 'video', 'audio', 'all')
            
        Returns:
            List of file paths
        """
        input_path = Path(input_dir)
        if not input_path.exists():
            raise FileNotFoundError(f"Input directory not found: {input_dir}")
        
        files = []
        
        if file_type == 'image':
            extensions = cls.IMAGE_EXTENSIONS
        elif file_type == 'video':
            extensions = cls.VIDEO_EXTENSIONS
        elif file_type == 'audio':
            extensions = cls.AUDIO_EXTENSIONS
        else:
            extensions = cls.IMAGE_EXTENSIONS | cls.VIDEO_EXTENSIONS | cls.AUDIO_EXTENSIONS
        
        for ext in extensions:
            files.extend(input_path.glob(f"*{ext}"))
            files.extend(input_path.glob(f"*{ext.upper()}"))
        
        return [str(f) for f in sorted(files)]
    
    @classmethod
    def validate_file_size(cls, file_path: str, max_size_mb: float = 100) -> bool:
        """
        Validate file size
        
        Args:
            file_path: Path to file
            max_size_mb: Maximum file size in MB
            
        Returns:
            True if file size is valid
        """
        file_info = cls.get_file_info(file_path)
        return file_info['size_mb'] <= max_size_mb