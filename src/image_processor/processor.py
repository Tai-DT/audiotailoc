"""
Main image processor for Auto Media Editor
"""

import cv2
import numpy as np
from PIL import Image
from pathlib import Path
from typing import Optional, Dict, Any, List
from ..utils.config import config
from ..utils.logger import get_logger
from ..utils.file_utils import FileUtils
from .enhancement import ImageEnhancer
from .face_detection import FaceDetector
from .background_removal import BackgroundRemover
from .style_transfer import StyleTransfer

logger = get_logger(__name__)


class ImageProcessor:
    """Main image processor class"""
    
    def __init__(self):
        """Initialize image processor"""
        self.config = config.get_image_config()
        self.enhancer = ImageEnhancer()
        self.face_detector = FaceDetector()
        self.bg_remover = BackgroundRemover()
        self.style_transfer = StyleTransfer()
        
        logger.info("Image processor initialized")
    
    def process_image(self, input_path: str, output_path: str, 
                     options: Optional[Dict[str, Any]] = None) -> str:
        """
        Process image with specified options
        
        Args:
            input_path: Input image path
            output_path: Output image path
            options: Processing options
            
        Returns:
            Output image path
        """
        options = options or {}
        
        # Validate input file
        if not FileUtils.is_supported_file(input_path):
            raise ValueError(f"Unsupported file type: {input_path}")
        
        logger.info(f"Processing image: {input_path}")
        
        # Load image
        image = self._load_image(input_path)
        
        # Apply processing options
        processed_image = self._apply_processing(image, options)
        
        # Save processed image
        self._save_image(processed_image, output_path)
        
        logger.info(f"Image processed successfully: {output_path}")
        return output_path
    
    def enhance(self, input_path: str, output_path: Optional[str] = None,
                level: str = "auto") -> str:
        """
        Enhance image quality
        
        Args:
            input_path: Input image path
            output_path: Output image path (optional)
            level: Enhancement level (auto, low, medium, high)
            
        Returns:
            Output image path
        """
        if output_path is None:
            output_path = FileUtils.get_output_path(
                input_path, 
                Path(input_path).parent, 
                "_enhanced.jpg"
            )
        
        options = {
            'enhancement': True,
            'enhancement_level': level
        }
        
        return self.process_image(input_path, output_path, options)
    
    def remove_background(self, input_path: str, output_path: Optional[str] = None) -> str:
        """
        Remove background from image
        
        Args:
            input_path: Input image path
            output_path: Output image path (optional)
            
        Returns:
            Output image path
        """
        if output_path is None:
            output_path = FileUtils.get_output_path(
                input_path, 
                Path(input_path).parent, 
                "_nobg.png"
            )
        
        options = {
            'background_removal': True
        }
        
        return self.process_image(input_path, output_path, options)
    
    def enhance_faces(self, input_path: str, output_path: Optional[str] = None) -> str:
        """
        Enhance faces in image
        
        Args:
            input_path: Input image path
            output_path: Output image path (optional)
            
        Returns:
            Output image path
        """
        if output_path is None:
            output_path = FileUtils.get_output_path(
                input_path, 
                Path(input_path).parent, 
                "_face_enhanced.jpg"
            )
        
        options = {
            'face_enhancement': True
        }
        
        return self.process_image(input_path, output_path, options)
    
    def apply_style(self, input_path: str, style_path: str, 
                   output_path: Optional[str] = None) -> str:
        """
        Apply style transfer to image
        
        Args:
            input_path: Input image path
            style_path: Style image path
            output_path: Output image path (optional)
            
        Returns:
            Output image path
        """
        if output_path is None:
            output_path = FileUtils.get_output_path(
                input_path, 
                Path(input_path).parent, 
                "_styled.jpg"
            )
        
        options = {
            'style_transfer': True,
            'style_image': style_path
        }
        
        return self.process_image(input_path, output_path, options)
    
    def batch_process(self, input_dir: str, output_dir: str,
                     options: Optional[Dict[str, Any]] = None) -> List[str]:
        """
        Process multiple images in batch
        
        Args:
            input_dir: Input directory
            output_dir: Output directory
            options: Processing options
            
        Returns:
            List of output file paths
        """
        input_files = FileUtils.batch_process_files(input_dir, 'image')
        
        if not input_files:
            logger.warning(f"No image files found in {input_dir}")
            return []
        
        logger.info(f"Processing {len(input_files)} images in batch")
        
        output_paths = []
        for input_file in input_files:
            try:
                output_file = FileUtils.get_output_path(
                    input_file, output_dir
                )
                output_path = self.process_image(input_file, output_file, options)
                output_paths.append(output_path)
            except Exception as e:
                logger.error(f"Failed to process {input_file}: {e}")
        
        logger.info(f"Batch processing completed: {len(output_paths)} files processed")
        return output_paths
    
    def _load_image(self, image_path: str) -> np.ndarray:
        """
        Load image from file
        
        Args:
            image_path: Path to image file
            
        Returns:
            Image as numpy array
        """
        try:
            # Load with OpenCV
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Failed to load image: {image_path}")
            
            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            return image
        except Exception as e:
            logger.error(f"Error loading image {image_path}: {e}")
            raise
    
    def _save_image(self, image: np.ndarray, output_path: str) -> None:
        """
        Save image to file
        
        Args:
            image: Image as numpy array
            output_path: Output file path
        """
        try:
            # Ensure output directory exists
            Path(output_path).parent.mkdir(parents=True, exist_ok=True)
            
            # Convert RGB to BGR for OpenCV
            image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            
            # Save image
            cv2.imwrite(output_path, image_bgr)
            
        except Exception as e:
            logger.error(f"Error saving image to {output_path}: {e}")
            raise
    
    def _apply_processing(self, image: np.ndarray, options: Dict[str, Any]) -> np.ndarray:
        """
        Apply processing options to image
        
        Args:
            image: Input image
            options: Processing options
            
        Returns:
            Processed image
        """
        processed_image = image.copy()
        
        # Background removal
        if options.get('background_removal', False):
            logger.debug("Applying background removal")
            processed_image = self.bg_remover.remove_background(processed_image)
        
        # Face enhancement
        if options.get('face_enhancement', False):
            logger.debug("Applying face enhancement")
            processed_image = self.face_detector.enhance_faces(processed_image)
        
        # Style transfer
        if options.get('style_transfer', False):
            style_image_path = options.get('style_image')
            if style_image_path:
                logger.debug("Applying style transfer")
                style_image = self._load_image(style_image_path)
                processed_image = self.style_transfer.apply_style(
                    processed_image, style_image
                )
        
        # General enhancement
        if options.get('enhancement', False):
            level = options.get('enhancement_level', 'auto')
            logger.debug(f"Applying image enhancement (level: {level})")
            processed_image = self.enhancer.enhance(processed_image, level)
        
        return processed_image
    
    def get_image_info(self, image_path: str) -> Dict[str, Any]:
        """
        Get image information
        
        Args:
            image_path: Path to image file
            
        Returns:
            Image information dictionary
        """
        file_info = FileUtils.get_file_info(image_path)
        
        # Load image to get additional info
        image = self._load_image(image_path)
        
        info = {
            **file_info,
            'width': image.shape[1],
            'height': image.shape[0],
            'channels': image.shape[2] if len(image.shape) > 2 else 1,
            'aspect_ratio': image.shape[1] / image.shape[0],
            'file_type': FileUtils.get_file_type(image_path)
        }
        
        return info