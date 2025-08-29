"""
Configuration management for Auto Media Editor
"""

import os
import yaml
from pathlib import Path
from typing import Dict, Any, Optional


class Config:
    """Configuration manager for Auto Media Editor"""
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize configuration
        
        Args:
            config_path: Path to configuration file
        """
        self.config_path = config_path or "config/settings.yaml"
        self._config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from YAML file"""
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
            return config or {}
        except FileNotFoundError:
            print(f"Warning: Config file {self.config_path} not found. Using defaults.")
            return self._get_default_config()
        except yaml.YAMLError as e:
            print(f"Error parsing config file: {e}")
            return self._get_default_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration"""
        return {
            "general": {
                "output_quality": "high",
                "temp_directory": "./temp",
                "max_workers": 4,
                "log_level": "INFO"
            },
            "ai": {
                "use_gpu": True,
                "model_cache_dir": "./models",
                "device": "auto"
            },
            "image": {
                "enhancement": {
                    "level": "auto",
                    "face_detection": True
                }
            },
            "video": {
                "stabilization": {
                    "enabled": True
                }
            },
            "audio": {
                "normalization": {
                    "enabled": True
                }
            }
        }
    
    def get(self, key: str, default: Any = None) -> Any:
        """
        Get configuration value by key
        
        Args:
            key: Configuration key (supports dot notation)
            default: Default value if key not found
            
        Returns:
            Configuration value
        """
        keys = key.split('.')
        value = self._config
        
        try:
            for k in keys:
                value = value[k]
            return value
        except (KeyError, TypeError):
            return default
    
    def set(self, key: str, value: Any) -> None:
        """
        Set configuration value
        
        Args:
            key: Configuration key (supports dot notation)
            value: Value to set
        """
        keys = key.split('.')
        config = self._config
        
        # Navigate to parent of target key
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        
        # Set the value
        config[keys[-1]] = value
    
    def save(self, path: Optional[str] = None) -> None:
        """
        Save configuration to file
        
        Args:
            path: Path to save configuration (optional)
        """
        save_path = path or self.config_path
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        with open(save_path, 'w', encoding='utf-8') as f:
            yaml.dump(self._config, f, default_flow_style=False, allow_unicode=True)
    
    def reload(self) -> None:
        """Reload configuration from file"""
        self._config = self._load_config()
    
    @property
    def temp_dir(self) -> str:
        """Get temporary directory path"""
        temp_dir = self.get('general.temp_directory', './temp')
        os.makedirs(temp_dir, exist_ok=True)
        return temp_dir
    
    @property
    def model_cache_dir(self) -> str:
        """Get model cache directory path"""
        cache_dir = self.get('ai.model_cache_dir', './models')
        os.makedirs(cache_dir, exist_ok=True)
        return cache_dir
    
    @property
    def device(self) -> str:
        """Get device for AI models"""
        return self.get('ai.device', 'auto')
    
    @property
    def use_gpu(self) -> bool:
        """Check if GPU should be used"""
        return self.get('ai.use_gpu', True)
    
    @property
    def max_workers(self) -> int:
        """Get maximum number of workers"""
        return self.get('general.max_workers', 4)
    
    @property
    def log_level(self) -> str:
        """Get log level"""
        return self.get('general.log_level', 'INFO')
    
    def get_image_config(self) -> Dict[str, Any]:
        """Get image processing configuration"""
        return self.get('image', {})
    
    def get_video_config(self) -> Dict[str, Any]:
        """Get video processing configuration"""
        return self.get('video', {})
    
    def get_audio_config(self) -> Dict[str, Any]:
        """Get audio processing configuration"""
        return self.get('audio', {})
    
    def get_web_config(self) -> Dict[str, Any]:
        """Get web interface configuration"""
        return self.get('web', {})


# Global configuration instance
config = Config()