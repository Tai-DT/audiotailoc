"""
Style transfer module for Auto Media Editor
"""

import cv2
import numpy as np
from typing import Tuple, Optional
from ..utils.logger import get_logger

logger = get_logger(__name__)


class StyleTransfer:
    """Style transfer utilities"""
    
    def __init__(self):
        """Initialize style transfer"""
        pass
    
    def apply_style(self, content_image: np.ndarray, style_image: np.ndarray,
                   alpha: float = 0.8) -> np.ndarray:
        """
        Apply style transfer to content image
        
        Args:
            content_image: Content image
            style_image: Style image
            alpha: Style strength (0.0 to 1.0)
            
        Returns:
            Stylized image
        """
        # Resize style image to match content image
        style_resized = cv2.resize(style_image, (content_image.shape[1], content_image.shape[0]))
        
        # Apply simple color transfer
        result = self._color_transfer(content_image, style_resized, alpha)
        
        return result
    
    def _color_transfer(self, content: np.ndarray, style: np.ndarray, alpha: float) -> np.ndarray:
        """
        Transfer color statistics from style to content
        
        Args:
            content: Content image
            style: Style image
            alpha: Transfer strength
            
        Returns:
            Color transferred image
        """
        # Convert to LAB color space
        content_lab = cv2.cvtColor(content, cv2.COLOR_RGB2LAB)
        style_lab = cv2.cvtColor(style, cv2.COLOR_RGB2LAB)
        
        # Calculate mean and std for each channel
        content_mean, content_std = [], []
        style_mean, style_std = [], []
        
        for i in range(3):
            content_mean.append(np.mean(content_lab[:, :, i]))
            content_std.append(np.std(content_lab[:, :, i]))
            style_mean.append(np.mean(style_lab[:, :, i]))
            style_std.append(np.std(style_lab[:, :, i]))
        
        # Apply color transfer
        result_lab = content_lab.copy()
        for i in range(3):
            result_lab[:, :, i] = (
                (content_lab[:, :, i] - content_mean[i]) * 
                (style_std[i] / content_std[i]) + style_mean[i]
            )
        
        # Blend with original
        result_lab = (
            content_lab * (1 - alpha) + 
            result_lab * alpha
        ).astype(np.uint8)
        
        # Convert back to RGB
        result = cv2.cvtColor(result_lab, cv2.COLOR_LAB2RGB)
        
        return result
    
    def apply_filter(self, image: np.ndarray, filter_type: str) -> np.ndarray:
        """
        Apply artistic filter to image
        
        Args:
            image: Input image
            filter_type: Filter type ('vintage', 'warm', 'cool', 'dramatic')
            
        Returns:
            Filtered image
        """
        if filter_type == "vintage":
            return self._vintage_filter(image)
        elif filter_type == "warm":
            return self._warm_filter(image)
        elif filter_type == "cool":
            return self._cool_filter(image)
        elif filter_type == "dramatic":
            return self._dramatic_filter(image)
        else:
            logger.warning(f"Unknown filter type: {filter_type}")
            return image
    
    def _vintage_filter(self, image: np.ndarray) -> np.ndarray:
        """Apply vintage filter"""
        result = image.copy()
        
        # Sepia tone
        result = cv2.transform(result, np.array([
            [0.393, 0.769, 0.189],
            [0.349, 0.686, 0.168],
            [0.272, 0.534, 0.131]
        ]))
        
        # Reduce saturation
        hsv = cv2.cvtColor(result, cv2.COLOR_RGB2HSV)
        hsv[:, :, 1] = hsv[:, :, 1] * 0.7
        result = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        
        # Add vignette effect
        result = self._add_vignette(result)
        
        return np.clip(result, 0, 255).astype(np.uint8)
    
    def _warm_filter(self, image: np.ndarray) -> np.ndarray:
        """Apply warm filter"""
        result = image.copy()
        
        # Increase red and yellow channels
        result[:, :, 0] = np.clip(result[:, :, 0] * 1.1, 0, 255)  # Red
        result[:, :, 1] = np.clip(result[:, :, 1] * 1.05, 0, 255)  # Green
        
        # Adjust white balance
        hsv = cv2.cvtColor(result, cv2.COLOR_RGB2HSV)
        hsv[:, :, 0] = np.clip(hsv[:, :, 0] * 1.1, 0, 179)  # Hue shift to warm
        result = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        
        return result.astype(np.uint8)
    
    def _cool_filter(self, image: np.ndarray) -> np.ndarray:
        """Apply cool filter"""
        result = image.copy()
        
        # Increase blue channel
        result[:, :, 2] = np.clip(result[:, :, 2] * 1.1, 0, 255)  # Blue
        
        # Adjust white balance
        hsv = cv2.cvtColor(result, cv2.COLOR_RGB2HSV)
        hsv[:, :, 0] = np.clip(hsv[:, :, 0] * 0.9, 0, 179)  # Hue shift to cool
        result = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        
        return result.astype(np.uint8)
    
    def _dramatic_filter(self, image: np.ndarray) -> np.ndarray:
        """Apply dramatic filter"""
        result = image.copy()
        
        # Increase contrast
        result = cv2.convertScaleAbs(result, alpha=1.3, beta=0)
        
        # Reduce brightness slightly
        hsv = cv2.cvtColor(result, cv2.COLOR_RGB2HSV)
        hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 0.9, 0, 255)
        result = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        
        # Add vignette effect
        result = self._add_vignette(result, strength=0.3)
        
        return result.astype(np.uint8)
    
    def _add_vignette(self, image: np.ndarray, strength: float = 0.5) -> np.ndarray:
        """
        Add vignette effect to image
        
        Args:
            image: Input image
            strength: Vignette strength
            
        Returns:
            Image with vignette effect
        """
        height, width = image.shape[:2]
        
        # Create radial gradient
        center_x, center_y = width // 2, height // 2
        max_distance = np.sqrt(center_x**2 + center_y**2)
        
        vignette = np.zeros((height, width), dtype=np.float32)
        for y in range(height):
            for x in range(width):
                distance = np.sqrt((x - center_x)**2 + (y - center_y)**2)
                vignette[y, x] = 1 - (distance / max_distance) * strength
        
        # Apply vignette
        result = image.astype(np.float32) * vignette[:, :, np.newaxis]
        
        return np.clip(result, 0, 255).astype(np.uint8)