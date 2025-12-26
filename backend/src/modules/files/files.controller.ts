import
{
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  NotFoundException,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { FilesService } from './files.service';

@ApiTags( 'Files' )
@Controller( 'files' )
export class FilesController
{
  constructor( private readonly filesService: FilesService ) { }

  @Post( 'upload' )
  @UseGuards( JwtGuard )
  @ApiBearerAuth()
  @UseInterceptors( FileInterceptor( 'file' ) )
  @ApiConsumes( 'multipart/form-data' )
  @ApiBody( {
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  } )
  @ApiOperation( { summary: 'Upload a single file' } )
  async uploadFile ( @UploadedFile() file: Express.Multer.File )
  {
    if ( !file )
    {
      throw new BadRequestException( 'No file uploaded' );
    }

    // Custom validation options
    const validationOptions = {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: [ 'image/jpeg', 'image/jpg', 'image/png', 'image/gif' ],
      allowedExtensions: [ '.jpg', '.jpeg', '.png', '.gif' ],
      requireImage: true,
    };

    return this.filesService.uploadFile( file, validationOptions );
  }

  @Post( 'upload-multiple' )
  @UseGuards( JwtGuard )
  @ApiBearerAuth()
  @UseInterceptors( FilesInterceptor( 'files', 10 ) ) // Max 10 files
  @ApiConsumes( 'multipart/form-data' )
  @ApiBody( {
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  } )
  @ApiOperation( { summary: 'Upload multiple files' } )
  async uploadMultipleFiles ( @UploadedFiles() files: Express.Multer.File[] )
  {
    if ( !files || files.length === 0 )
    {
      throw new BadRequestException( 'No files uploaded' );
    }

    // Custom validation options for each file
    const validationOptions = {
      maxSize: 5 * 1024 * 1024, // 5MB per file
      allowedMimeTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      allowedExtensions: [ '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx' ],
    };

    return this.filesService.uploadMultipleFiles( files, validationOptions );
  }

  @Post( 'upload/product-image/:productId' )
  @UseGuards( JwtGuard, AdminOrKeyGuard )
  @ApiBearerAuth()
  @UseInterceptors( FileInterceptor( 'image' ) )
  @ApiConsumes( 'multipart/form-data' )
  @ApiBody( {
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  } )
  @ApiOperation( { summary: 'Upload product image' } )
  async uploadProductImage (
    @Param( 'productId' ) productId: string,
    @UploadedFile() file: Express.Multer.File,
  )
  {
    if ( !file )
    {
      throw new BadRequestException( 'No image uploaded' );
    }

    return this.filesService.uploadProductImage( file, productId );
  }

  @Post( 'upload/avatar' )
  @UseGuards( JwtGuard )
  @ApiBearerAuth()
  @UseInterceptors( FileInterceptor( 'avatar' ) )
  @ApiConsumes( 'multipart/form-data' )
  @ApiBody( {
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  } )
  @ApiOperation( { summary: 'Upload user avatar' } )
  async uploadUserAvatar ( @UploadedFile() file: Express.Multer.File, @Req() req: any )
  {
    if ( !file )
    {
      throw new NotFoundException( 'No avatar uploaded' );
    }

    // Get user ID from JWT token
    const userId = req.user?.sub;
    if ( !userId )
    {
      throw new BadRequestException( 'User not found in request' );
    }

    return this.filesService.uploadUserAvatar( file, userId );
  }

  @UseGuards( JwtGuard )
  @Get( ':fileId' )
  @ApiBearerAuth()
  @ApiOperation( { summary: 'Get file information' } )
  async getFileInfo ( @Param( 'fileId' ) fileId: string, @Req() req: any )
  {
    // SECURITY: Require authentication to view file information
    const file = await this.filesService.getFileInfo( fileId );
    if ( !file )
    {
      throw new NotFoundException( 'File not found' );
    }

    // SECURITY: Check ownership if file has userId metadata
    // Users can only view their own files unless they're admin
    const user = req.user;
    const isAdmin = user?.role === 'ADMIN' || user?.email === process.env.ADMIN_EMAIL;

    if ( file.metadata?.userId && !isAdmin && user?.sub !== file.metadata.userId )
    {
      throw new ForbiddenException( 'You can only view your own files' );
    }

    return file;
  }

  @Get()
  @UseGuards( JwtGuard )
  @ApiBearerAuth()
  @ApiOperation( { summary: 'List files with filters' } )
  async listFiles (
    @Query( 'type' ) type?: string,
    @Query( 'userId' ) userId?: string,
    @Query( 'productId' ) productId?: string,
    @Query( 'page' ) page?: string,
    @Query( 'limit' ) limit?: string,
    @Req() req?: any,
  )
  {
    // SECURITY: Users can only list their own files unless they're admin
    const user = req.user;
    const isAdmin = user?.role === 'ADMIN' || user?.email === process.env.ADMIN_EMAIL;

    let targetUserId = userId;
    if ( !isAdmin )
    {
      if ( userId && userId !== user?.sub )
      {
        throw new ForbiddenException( 'You can only list your own files' );
      }
      targetUserId = user?.sub;
    }

    return this.filesService.listFiles( {
      type,
      userId: targetUserId,
      productId,
      page: page ? parseInt( page ) : undefined,
      limit: limit ? parseInt( limit ) : undefined,
    } );
  }

  @Delete( ':fileId' )
  @UseGuards( JwtGuard, AdminOrKeyGuard )
  @ApiBearerAuth()
  @ApiOperation( { summary: 'Delete file' } )
  async deleteFile ( @Param( 'fileId' ) fileId: string )
  {
    const success = await this.filesService.deleteFile( fileId );
    return { success, message: 'File deleted successfully' };
  }
}
