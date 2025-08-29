"""
Face detection and enhancement module for Auto Media Editor
"""

import cv2
import numpy as np
from typing import List, Tuple, Optional
from ..utils.logger import get_logger

logger = get_logger(__name__)


class FaceDetector:
    """Face detection and enhancement utilities"""
    
    def __init__(self):
        """Initialize face detector"""
        # Load pre-trained face detection models
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        self.eye_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_eye.xml'
        )
        
        logger.info("Face detector initialized")
    
    def detect_faces(self, image: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """
        Detect faces in image
        
        Args:
            image: Input image
            
        Returns:
            List of face bounding boxes (x, y, w, h)
        """
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        faces = self.face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30)
        )
        
        return faces.tolist()
    
    def detect_eyes(self, image: np.ndarray, face_bbox: Tuple[int, int, int, int]) -> List[Tuple[int, int, int, int]]:
        """
        Detect eyes within a face region
        
        Args:
            image: Input image
            face_bbox: Face bounding box (x, y, w, h)
            
        Returns:
            List of eye bounding boxes
        """
        x, y, w, h = face_bbox
        face_roi = image[y:y+h, x:x+w]
        
        gray = cv2.cvtColor(face_roi, cv2.COLOR_RGB2GRAY)
        eyes = self.eye_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(20, 20)
        )
        
        # Adjust coordinates to original image
        eyes_adjusted = [(x + ex, y + ey, ew, eh) for (ex, ey, ew, eh) in eyes]
        return eyes_adjusted
    
    def enhance_faces(self, image: np.ndarray) -> np.ndarray:
        """
        Enhance faces in image
        
        Args:
            image: Input image
            
        Returns:
            Image with enhanced faces
        """
        enhanced = image.copy()
        faces = self.detect_faces(image)
        
        for face_bbox in faces:
            enhanced = self._enhance_face_region(enhanced, face_bbox)
        
        return enhanced
    
    def _enhance_face_region(self, image: np.ndarray, face_bbox: Tuple[int, int, int, int]) -> np.ndarray:
        """
        Enhance a specific face region
        
        Args:
            image: Input image
            face_bbox: Face bounding box
            
        Returns:
            Image with enhanced face region
        """
        x, y, w, h = face_bbox
        face_roi = image[y:y+h, x:x+w]
        
        # Apply face enhancement
        enhanced_face = self._apply_face_enhancement(face_roi)
        
        # Blend enhanced face back into image
        result = image.copy()
        result[y:y+h, x:x+w] = enhanced_face
        
        return result
    
    def _apply_face_enhancement(self, face_roi: np.ndarray) -> np.ndarray:
        """
        Apply enhancement to face region
        
        Args:
            face_roi: Face region of interest
            
        Returns:
            Enhanced face region
        """
        enhanced = face_roi.copy()
        
        # Smooth skin
        enhanced = self._smooth_skin(enhanced)
        
        # Enhance eyes
        enhanced = self._enhance_eyes(enhanced)
        
        # Adjust brightness and contrast
        enhanced = self._adjust_face_lighting(enhanced)
        
        return enhanced
    
    def _smooth_skin(self, face_roi: np.ndarray) -> np.ndarray:
        """
        Apply skin smoothing
        
        Args:
            face_roi: Face region of interest
            
        Returns:
            Smoothed face region
        """
        # Bilateral filter for skin smoothing
        smoothed = cv2.bilateralFilter(face_roi, 9, 75, 75)
        
        # Blend with original
        result = cv2.addWeighted(face_roi, 0.7, smoothed, 0.3, 0)
        
        return result
    
    def _enhance_eyes(self, face_roi: np.ndarray) -> np.ndarray:
        """
        Enhance eyes in face region
        
        Args:
            face_roi: Face region of interest
            
        Returns:
            Face region with enhanced eyes
        """
        # Detect eyes in face region
        eyes = self.detect_eyes(face_roi, (0, 0, face_roi.shape[1], face_roi.shape[0]))
        
        result = face_roi.copy()
        
        for eye_bbox in eyes:
            ex, ey, ew, eh = eye_bbox
            eye_roi = face_roi[ey:ey+eh, ex:ex+ew]
            
            # Enhance eye region
            enhanced_eye = self._apply_eye_enhancement(eye_roi)
            result[ey:ey+eh, ex:ex+ew] = enhanced_eye
        
        return result
    
    def _apply_eye_enhancement(self, eye_roi: np.ndarray) -> np.ndarray:
        """
        Apply enhancement to eye region
        
        Args:
            eye_roi: Eye region of interest
            
        Returns:
            Enhanced eye region
        """
        enhanced = eye_roi.copy()
        
        # Sharpen eyes
        kernel = np.array([[-1, -1, -1],
                          [-1,  9, -1],
                          [-1, -1, -1]])
        sharpened = cv2.filter2D(enhanced, -1, kernel)
        
        # Blend sharpened with original
        result = cv2.addWeighted(enhanced, 0.6, sharpened, 0.4, 0)
        
        # Slightly brighten eyes
        hsv = cv2.cvtColor(result, cv2.COLOR_RGB2HSV)
        hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 1.1, 0, 255)
        result = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
        
        return result
    
    def _adjust_face_lighting(self, face_roi: np.ndarray) -> np.ndarray:
        """
        Adjust lighting for face region
        
        Args:
            face_roi: Face region of interest
            
        Returns:
            Face region with adjusted lighting
        """
        # Convert to LAB color space
        lab = cv2.cvtColor(face_roi, cv2.COLOR_RGB2LAB)
        
        # Apply CLAHE to L channel for better lighting
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        lab[:, :, 0] = clahe.apply(lab[:, :, 0])
        
        # Convert back to RGB
        result = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        return result
    
    def get_face_count(self, image: np.ndarray) -> int:
        """
        Get number of faces in image
        
        Args:
            image: Input image
            
        Returns:
            Number of faces detected
        """
        faces = self.detect_faces(image)
        return len(faces)
    
    def draw_face_boxes(self, image: np.ndarray, color: Tuple[int, int, int] = (0, 255, 0)) -> np.ndarray:
        """
        Draw bounding boxes around detected faces
        
        Args:
            image: Input image
            color: Box color (R, G, B)
            
        Returns:
            Image with face bounding boxes drawn
        """
        result = image.copy()
        faces = self.detect_faces(image)
        
        for (x, y, w, h) in faces:
            cv2.rectangle(result, (x, y), (x+w, y+h), color, 2)
        
        return result