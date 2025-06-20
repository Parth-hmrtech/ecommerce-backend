import cloudinary from '../config/cloudinaryConfig.js';
import fs from 'fs';

const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);

        fs.unlink(filePath, () => {});
        
        return result.secure_url;
    } catch (error) {
        throw new Error(error.message || 'Cloudinary upload failed');
    }
};

export { uploadFile };
