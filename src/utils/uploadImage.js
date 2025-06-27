// /src/utils/uploadImage.js

import cloudinary from '../config/cloudinaryConfig.js';
import fs from 'fs';

const uploadFile = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log("Uploaded to Cloudinary:", result.secure_url);

    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
      else console.log("Local file deleted:", filePath);
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(error.message || 'Cloudinary upload failed');
  }
};

export { uploadFile };
