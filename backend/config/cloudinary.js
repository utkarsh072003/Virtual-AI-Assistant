import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config();
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const uploadOnCloudinary = async (filePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);

    // ✅ Delete local file after upload
    fs.unlinkSync(filePath);

    return uploadResult.secure_url;

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    // ❗ Always delete file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // ❗ Instead of returning res.status... throw error to be handled in controller
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadOnCloudinary;
