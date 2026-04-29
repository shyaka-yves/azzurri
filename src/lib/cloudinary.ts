import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type CloudinaryResource = {
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  url: string;
  secure_url: string;
};

export async function uploadToCloudinary(buffer: Buffer, folder: string = 'azzurri'): Promise<CloudinaryResource> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as CloudinaryResource);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function listCloudinaryImages(folder: string = 'azzurri'): Promise<CloudinaryResource[]> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 500,
    });
    return result.resources;
  } catch (error) {
    console.error('Error listing Cloudinary images:', error);
    return [];
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getCloudinaryUrl(publicId: string, options: { width?: number; height?: number; crop?: string; quality?: string | number; format?: string } = {}): string {
  return cloudinary.url(publicId, {
    fetch_format: options.format || 'auto',
    quality: options.quality || 'auto',
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
    secure: true,
  });
}

export { cloudinary };
