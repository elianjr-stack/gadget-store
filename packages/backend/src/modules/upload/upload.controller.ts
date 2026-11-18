import { Controller, Post, Delete, Param, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.STAFF)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadOne(@UploadedFile() file: Express.Multer.File) { return this.uploadService.uploadImage(file); }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMany(@UploadedFiles() files: Express.Multer.File[]) { return this.uploadService.uploadImages(files); }

  @Delete(':publicId')
  deleteImage(@Param('publicId') publicId: string) { return this.uploadService.deleteImage(decodeURIComponent(publicId)); }
}
