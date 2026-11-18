import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File, folder = 'gadgetstore') {
    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve({ url: result!.secure_url, publicId: result!.public_id });
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async uploadImages(files: Express.Multer.File[], folder = 'gadgetstore') {
    const results = await Promise.all(files.map((f) => this.uploadImage(f, folder)));
    return { data: { images: results } };
  }

  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
    return { message: 'Image deleted' };
  }
}
