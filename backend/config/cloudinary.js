import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config();
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const uploadOnCloudinary = async (buffer, mimetype) => {
  try {
    const base64String = buffer.toString("base64");
    const dataUri = `data:${mimetype};base64,${base64String}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri);

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Cloudinary upload failed");
  }
};




export default uploadOnCloudinary;
