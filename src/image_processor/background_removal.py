"""
Background removal module for Auto Media Editor
"""

import cv2
import numpy as np
from typing import Tuple, Optional
from ..utils.logger import get_logger

logger = get_logger(__name__)


class BackgroundRemover:
    """Background removal utilities"""
    
    def __init__(self):
        """Initialize background remover"""
        pass
    
    def remove_background(self, image: np.ndarray, method: str = "grabcut") -> np.ndarray:
        """
        Remove background from image
        
        Args:
            image: Input image
            method: Removal method ('grabcut', 'threshold', 'kmeans')
            
        Returns:
            Image with background removed (RGBA)
        """
        if method == "grabcut":
            return self._grabcut_removal(image)
        elif method == "threshold":
            return self._threshold_removal(image)
        elif method == "kmeans":
            return self._kmeans_removal(image)
        else:
            logger.warning(f"Unknown method: {method}, using grabcut")
            return self._grabcut_removal(image)
    
    def _grabcut_removal(self, image: np.ndarray) -> np.ndarray:
        """
        Remove background using GrabCut algorithm
        
        Args:
            image: Input image
            
        Returns:
            Image with background removed
        """
        # Create mask
        mask = np.zeros(image.shape[:2], np.uint8)
        
        # Create background and foreground models
        bgd_model = np.zeros((1, 65), np.float64)
        fgd_model = np.zeros((1, 65), np.float64)
        
        # Define rectangle for foreground
        rect = (10, 10, image.shape[1] - 20, image.shape[0] - 20)
        
        # Apply GrabCut
        cv2.grabCut(image, mask, rect, bgd_model, fgd_model, 5, cv2.GC_INIT_WITH_RECT)
        
        # Create mask for probable and definite foreground
        mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
        
        # Apply mask to image
        result = image * mask2[:, :, np.newaxis]
        
        # Add alpha channel
        alpha = mask2 * 255
        result = np.dstack((result, alpha))
        
        return result
    
    def _threshold_removal(self, image: np.ndarray) -> np.ndarray:
        """
        Remove background using thresholding
        
        Args:
            image: Input image
            
        Returns:
            Image with background removed
        """
        # Convert to HSV
        hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
        
        # Create mask for green screen (common background)
        lower_green = np.array([35, 50, 50])
        upper_green = np.array([85, 255, 255])
        mask = cv2.inRange(hsv, lower_green, upper_green)
        
        # Invert mask
        mask = cv2.bitwise_not(mask)
        
        # Apply morphological operations
        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # Apply mask to image
        result = image * (mask[:, :, np.newaxis] / 255.0)
        
        # Add alpha channel
        alpha = mask
        result = np.dstack((result, alpha))
        
        return result.astype(np.uint8)
    
    def _kmeans_removal(self, image: np.ndarray) -> np.ndarray:
        """
        Remove background using K-means clustering
        
        Args:
            image: Input image
            
        Returns:
            Image with background removed
        """
        # Reshape image for clustering
        pixel_values = image.reshape((-1, 3))
        pixel_values = np.float32(pixel_values)
        
        # Define criteria and apply K-means
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
        k = 2  # Background and foreground
        _, labels, centers = cv2.kmeans(pixel_values, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
        
        # Convert back to uint8
        centers = np.uint8(centers)
        segmented_image = centers[labels.flatten()]
        segmented_image = segmented_image.reshape(image.shape)
        
        # Create mask (assuming background is the larger cluster)
        mask = labels.reshape(image.shape[:2])
        mask = np.where(mask == np.argmax(np.bincount(labels.flatten())), 0, 1)
        
        # Apply mask
        result = image * mask[:, :, np.newaxis]
        
        # Add alpha channel
        alpha = mask * 255
        result = np.dstack((result, alpha))
        
        return result.astype(np.uint8)
    
    def create_transparent_background(self, image: np.ndarray, 
                                    background_color: Tuple[int, int, int] = (255, 255, 255)) -> np.ndarray:
        """
        Create transparent background by removing specific color
        
        Args:
            image: Input image
            background_color: Background color to remove (R, G, B)
            
        Returns:
            Image with transparent background
        """
        # Create mask for background color
        mask = np.all(image == background_color, axis=2)
        
        # Invert mask
        mask = ~mask
        
        # Apply mask
        result = image * mask[:, :, np.newaxis]
        
        # Add alpha channel
        alpha = mask.astype(np.uint8) * 255
        result = np.dstack((result, alpha))
        
        return result.astype(np.uint8)
    
    def replace_background(self, foreground: np.ndarray, background: np.ndarray,
                          position: Tuple[int, int] = (0, 0)) -> np.ndarray:
        """
        Replace background with new image
        
        Args:
            foreground: Foreground image with alpha channel
            background: Background image
            position: Position to place foreground (x, y)
            
        Returns:
            Combined image
        """
        # Ensure foreground has alpha channel
        if foreground.shape[2] == 3:
            foreground = np.dstack((foreground, np.ones(foreground.shape[:2]) * 255))
        
        # Get dimensions
        fg_h, fg_w = foreground.shape[:2]
        bg_h, bg_w = background.shape[:2]
        
        # Calculate position
        x, y = position
        
        # Create result image
        result = background.copy()
        
        # Blend foreground onto background
        for i in range(fg_h):
            for j in range(fg_w):
                if y + i < bg_h and x + j < bg_w:
                    alpha = foreground[i, j, 3] / 255.0
                    if alpha > 0:
                        result[y + i, x + j] = (
                            foreground[i, j, :3] * alpha + 
                            result[y + i, x + j] * (1 - alpha)
                        ).astype(np.uint8)
        
        return result