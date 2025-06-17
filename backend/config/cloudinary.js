import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config();
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const uploadOnCloudinary = async (fileBuffer) => {
  try {
    const uploadResult = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    // Write buffer to stream
    const streamifier = await import("streamifier");
    streamifier.createReadStream(fileBuffer).pipe(uploadResult);

  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    throw new Error("Cloudinary upload failed");
  }
};


export default uploadOnCloudinary;
