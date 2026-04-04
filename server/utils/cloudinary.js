import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv";

dotenv.config({})

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

const uploadMedia = async (file, foldername = "SandCTours") => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: foldername,

    })

    return uploadResponse;
  } catch (error) {
    console.log(error)
  }
}

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.log(error)
  }
}

const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
};


export { uploadMedia, deleteMediaFromCloudinary, deleteVideoFromCloudinary }