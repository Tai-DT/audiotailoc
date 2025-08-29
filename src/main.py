"""
Main entry point for Auto Media Editor
"""

import click
import sys
from pathlib import Path
from typing import Optional

from .image_processor import ImageProcessor
from .video_editor import VideoEditor
from .audio_mixer import AudioMixer
from .utils.config import config
from .utils.logger import setup_logger
from .utils.file_utils import FileUtils

# Setup logger
logger = setup_logger()


@click.group()
@click.version_option(version="1.0.0")
@click.option('--config', '-c', help='Configuration file path')
@click.option('--verbose', '-v', is_flag=True, help='Verbose output')
def cli(config_file, verbose):
    """Auto Media Editor - Automatic Image, Video, and Audio Processing"""
    if verbose:
        logger.setLevel('DEBUG')
    
    if config_file:
        config.config_path = config_file
        config.reload()


@cli.group()
def image():
    """Image processing commands"""
    pass


@image.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--enhance', is_flag=True, help='Enhance image quality')
@click.option('--level', type=click.Choice(['auto', 'low', 'medium', 'high']), 
              default='auto', help='Enhancement level')
@click.option('--remove-bg', is_flag=True, help='Remove background')
@click.option('--enhance-faces', is_flag=True, help='Enhance faces')
@click.option('--style', type=click.Path(exists=True), help='Style image for transfer')
def process(input_path, output_path, enhance, level, remove_bg, enhance_faces, style):
    """Process image with specified options"""
    try:
        processor = ImageProcessor()
        
        options = {}
        if enhance:
            options['enhancement'] = True
            options['enhancement_level'] = level
        if remove_bg:
            options['background_removal'] = True
        if enhance_faces:
            options['face_enhancement'] = True
        if style:
            options['style_transfer'] = True
            options['style_image'] = style
        
        result_path = processor.process_image(input_path, output_path, options)
        click.echo(f"✅ Image processed successfully: {result_path}")
        
    except Exception as e:
        logger.error(f"Failed to process image: {e}")
        click.echo(f"❌ Error: {e}", err=True)
        sys.exit(1)


@image.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--level', type=click.Choice(['auto', 'low', 'medium', 'high']), 
              default='auto', help='Enhancement level')
def enhance(input_path, output_path, level):
    """Enhance image quality"""
    try:
        processor = ImageProcessor()
        result_path = processor.enhance(input_path, output_path, level)
        click.echo(f"✅ Image enhanced successfully: {result_path}")
        
    except Exception as e:
        logger.error(f"Failed to enhance image: {e}")
        click.echo(f"❌ Error: {e}", err=True)
        sys.exit(1)


@image.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
def remove_background(input_path, output_path):
    """Remove background from image"""
    try:
        processor = ImageProcessor()
        result_path = processor.remove_background(input_path, output_path)
        click.echo(f"✅ Background removed successfully: {result_path}")
        
    except Exception as e:
        logger.error(f"Failed to remove background: {e}")
        click.echo(f"❌ Error: {e}", err=True)
        sys.exit(1)


@cli.group()
def video():
    """Video processing commands"""
    pass


@video.command()
@click.argument('input_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--stabilize', is_flag=True, help='Stabilize video')
@click.option('--auto-cut', is_flag=True, help='Auto cut scenes')
@click.option('--speed', type=float, help='Speed multiplier')
def edit(input_path, output_path, stabilize, auto_cut, speed):
    """Edit video with specified options"""
    try:
        editor = VideoEditor()
        
        options = {}
        if stabilize:
            options['stabilization'] = True
        if auto_cut:
            options['auto_cut'] = True
        if speed:
            options['speed'] = speed
        
        result_path = editor.edit_video(input_path, output_path, options)
        click.echo(f"✅ Video edited successfully: {result_path}")
        
    except Exception as e:
        logger.error(f"Failed to edit video: {e}")
        click.echo(f"❌ Error: {e}", err=True)
        sys.exit(1)


@cli.group()
def audio():
    """Audio processing commands"""
    pass


@audio.command()
@click.argument('video_path', type=click.Path(exists=True))
@click.argument('music_path', type=click.Path(exists=True))
@click.argument('output_path', type=click.Path())
@click.option('--volume', type=float, default=0.3, help='Background music volume (0.0-1.0)')
@click.option('--fade-in', type=float, default=2.0, help='Fade in duration (seconds)')
@click.option('--fade-out', type=float, default=3.0, help='Fade out duration (seconds)')
def mix(video_path, music_path, output_path, volume, fade_in, fade_out):
    """Mix video with background music"""
    try:
        mixer = AudioMixer()
        result_path = mixer.add_background_music(
            video_path, music_path, output_path, 
            volume_ratio=volume, fade_in=fade_in, fade_out=fade_out
        )
        click.echo(f"✅ Audio mixed successfully: {result_path}")
        
    except Exception as e:
        logger.error(f"Failed to mix audio: {e}")
        click.echo(f"❌ Error: {e}", err=True)
        sys.exit(1)


@cli.command()
@click.argument('input_dir', type=click.Path(exists=True))
@click.argument('output_dir', type=click.Path())
@click.option('--type', 'file_type', type=click.Choice(['image', 'video', 'audio']), 
              default='image', help='File type to process')
@click.option('--enhance', is_flag=True, help='Enhance files')
def batch(input_dir, output_dir, file_type, enhance):
    """Process multiple files in batch"""
    try:
        if file_type == 'image':
            processor = ImageProcessor()
            options = {'enhancement': True} if enhance else {}
            result_paths = processor.batch_process(input_dir, output_dir, options)
        elif file_type == 'video':
            editor = VideoEditor()
            result_paths = editor.batch_process(input_dir, output_dir)
        elif file_type == 'audio':
            mixer = AudioMixer()
            result_paths = mixer.batch_process(input_dir, output_dir)
        
        click.echo(f"✅ Batch processing completed: {len(result_paths)} files processed")
        
    except Exception as e:
        logger.error(f"Failed to process batch: {e}")
        click.echo(f"❌ Error: {e}", err=True)
        sys.exit(1)


@cli.command()
@click.argument('file_path', type=click.Path(exists=True))
def info(file_path):
    """Get file information"""
    try:
        file_info = FileUtils.get_file_info(file_path)
        
        click.echo(f"📁 File Information:")
        click.echo(f"  Name: {file_info['name']}")
        click.echo(f"  Type: {file_info['type']}")
        click.echo(f"  Size: {file_info['size_mb']:.2f} MB")
        click.echo(f"  Path: {file_info['path']}")
        
        if file_info['type'] == 'image':
            processor = ImageProcessor()
            image_info = processor.get_image_info(file_path)
            click.echo(f"  Dimensions: {image_info['width']}x{image_info['height']}")
            click.echo(f"  Aspect Ratio: {image_info['aspect_ratio']:.2f}")
        
    except Exception as e:
        logger.error(f"Failed to get file info: {e}")
        click.echo(f"❌ Error: {e}", err=True)
        sys.exit(1)


@cli.command()
def web():
    """Start web interface"""
    try:
        from .web_interface.app import create_app
        app = create_app()
        
        web_config = config.get_web_config()
        host = web_config.get('host', '0.0.0.0')
        port = web_config.get('port', 8080)
        debug = web_config.get('debug', False)
        
        click.echo(f"🌐 Starting web interface at http://{host}:{port}")
        app.run(host=host, port=port, debug=debug)
        
    except ImportError:
        click.echo("❌ Web interface not available. Install Flask to enable.")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Failed to start web interface: {e}")
        click.echo(f"❌ Error: {e}", err=True)
        sys.exit(1)


if __name__ == '__main__':
    cli()