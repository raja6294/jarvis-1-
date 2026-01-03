import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  try {
    const uploadOnResult = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });

    fs.unlinkSync(filePath);
    return uploadOnResult.secure_url;
  } catch (error) {
    fs.unlinkSync(filePath);
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

export default uploadOnCloudinary;