"""
Image enhancement module for Auto Media Editor
"""

import cv2
import numpy as np
from skimage import exposure, filters
from typing import Tuple
from ..utils.logger import get_logger

logger = get_logger(__name__)


class ImageEnhancer:
    """Image enhancement utilities"""
    
    def __init__(self):
        """Initialize image enhancer"""
        pass
    
    def enhance(self, image: np.ndarray, level: str = "auto") -> np.ndarray:
        """
        Enhance image quality
        
        Args:
            image: Input image
            level: Enhancement level (auto, low, medium, high)
            
        Returns:
            Enhanced image
        """
        enhanced = image.copy()
        
        if level == "auto":
            enhanced = self._auto_enhance(enhanced)
        elif level == "low":
            enhanced = self._low_enhancement(enhanced)
        elif level == "medium":
            enhanced = self._medium_enhancement(enhanced)
        elif level == "high":
            enhanced = self._high_enhancement(enhanced)
        else:
            logger.warning(f"Unknown enhancement level: {level}, using auto")
            enhanced = self._auto_enhance(enhanced)
        
        return enhanced
    
    def _auto_enhance(self, image: np.ndarray) -> np.ndarray:
        """
        Automatic enhancement based on image analysis
        
        Args:
            image: Input image
            
        Returns:
            Enhanced image
        """
        enhanced = image.copy()
        
        # Analyze image quality
        brightness = np.mean(enhanced)
        contrast = np.std(enhanced)
        
        # Adjust brightness if needed
        if brightness < 100:
            enhanced = self._adjust_brightness(enhanced, 1.2)
        elif brightness > 200:
            enhanced = self._adjust_brightness(enhanced, 0.8)
        
        # Adjust contrast if needed
        if contrast < 30:
            enhanced = self._adjust_contrast(enhanced, 1.3)
        
        # Apply sharpening
        enhanced = self._sharpen(enhanced)
        
        # Apply noise reduction
        enhanced = self._reduce_noise(enhanced)
        
        return enhanced
    
    def _low_enhancement(self, image: np.ndarray) -> np.ndarray:
        """Low level enhancement"""
        enhanced = image.copy()
        
        # Basic brightness and contrast adjustment
        enhanced = self._adjust_brightness(enhanced, 1.1)
        enhanced = self._adjust_contrast(enhanced, 1.1)
        
        return enhanced
    
    def _medium_enhancement(self, image: np.ndarray) -> np.ndarray:
        """Medium level enhancement"""
        enhanced = image.copy()
        
        # Brightness and contrast adjustment
        enhanced = self._adjust_brightness(enhanced, 1.15)
        enhanced = self._adjust_contrast(enhanced, 1.2)
        
        # Sharpening
        enhanced = self._sharpen(enhanced)
        
        # Noise reduction
        enhanced = self._reduce_noise(enhanced)
        
        return enhanced
    
    def _high_enhancement(self, image: np.ndarray) -> np.ndarray:
        """High level enhancement"""
        enhanced = image.copy()
        
        # Aggressive brightness and contrast adjustment
        enhanced = self._adjust_brightness(enhanced, 1.2)
        enhanced = self._adjust_contrast(enhanced, 1.4)
        
        # Sharpening
        enhanced = self._sharpen(enhanced)
        
        # Noise reduction
        enhanced = self._reduce_noise(enhanced)
        
        # Color enhancement
        enhanced = self._enhance_colors(enhanced)
        
        return enhanced
    
    def _adjust_brightness(self, image: np.ndarray, factor: float) -> np.ndarray:
        """
        Adjust image brightness
        
        Args:
            image: Input image
            factor: Brightness factor (>1 for brighter, <1 for darker)
            
        Returns:
            Brightness adjusted image
        """
        hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
        hsv[:, :, 2] = np.clip(hsv[:, :, 2] * factor, 0, 255)
        return cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
    
    def _adjust_contrast(self, image: np.ndarray, factor: float) -> np.ndarray:
        """
        Adjust image contrast
        
        Args:
            image: Input image
            factor: Contrast factor (>1 for higher contrast)
            
        Returns:
            Contrast adjusted image
        """
        return np.clip(image * factor, 0, 255).astype(np.uint8)
    
    def _sharpen(self, image: np.ndarray) -> np.ndarray:
        """
        Sharpen image
        
        Args:
            image: Input image
            
        Returns:
            Sharpened image
        """
        kernel = np.array([[-1, -1, -1],
                          [-1,  9, -1],
                          [-1, -1, -1]])
        return cv2.filter2D(image, -1, kernel)
    
    def _reduce_noise(self, image: np.ndarray) -> np.ndarray:
        """
        Reduce noise in image
        
        Args:
            image: Input image
            
        Returns:
            Denoised image
        """
        return cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)
    
    def _enhance_colors(self, image: np.ndarray) -> np.ndarray:
        """
        Enhance colors in image
        
        Args:
            image: Input image
            
        Returns:
            Color enhanced image
        """
        # Convert to LAB color space
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        
        # Enhance saturation in L channel
        lab[:, :, 1] = np.clip(lab[:, :, 1] * 1.1, 0, 255)
        lab[:, :, 2] = np.clip(lab[:, :, 2] * 1.1, 0, 255)
        
        # Convert back to RGB
        return cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    
    def histogram_equalization(self, image: np.ndarray) -> np.ndarray:
        """
        Apply histogram equalization
        
        Args:
            image: Input image
            
        Returns:
            Histogram equalized image
        """
        # Convert to LAB color space
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        
        # Apply CLAHE to L channel
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        lab[:, :, 0] = clahe.apply(lab[:, :, 0])
        
        # Convert back to RGB
        return cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    
    def adjust_gamma(self, image: np.ndarray, gamma: float) -> np.ndarray:
        """
        Adjust gamma correction
        
        Args:
            image: Input image
            gamma: Gamma value
            
        Returns:
            Gamma corrected image
        """
        inv_gamma = 1.0 / gamma
        table = np.array([((i / 255.0) ** inv_gamma) * 255
                         for i in np.arange(0, 256)]).astype("uint8")
        return cv2.LUT(image, table)
    
    def white_balance(self, image: np.ndarray) -> np.ndarray:
        """
        Apply automatic white balance
        
        Args:
            image: Input image
            
        Returns:
            White balanced image
        """
        # Simple gray world assumption
        result = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        avg_a = np.average(result[:, :, 1])
        avg_b = np.average(result[:, :, 2])
        result[:, :, 1] = result[:, :, 1] - ((avg_a - 128) * (result[:, :, 0] / 255.0) * 1.1)
        result[:, :, 2] = result[:, :, 2] - ((avg_b - 128) * (result[:, :, 0] / 255.0) * 1.1)
        return cv2.cvtColor(result, cv2.COLOR_LAB2RGB)