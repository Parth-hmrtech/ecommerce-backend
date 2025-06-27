import {
    findUser,
    updateUser,
    resetUserPassword,
} from '../services/user.service.js';
import { uploadFile } from '../utils/uploadImage.js';

const getUserController = async (req, res) => {

    try {

        const user = await findUser(req.user.id);

        return res.status(200).json({
            error: false,
            message: 'User get successfully!',
            data: { user }
        });

    }

    catch (error) {

        throw Error(error);

    }
};
const updateUserController = async (req, res) => {
  try {
    const userData = { ...req.body };

    // Handle uploaded file if it exists
    if (req.file) {
      const filePath = req.file.path;
      const imageUrl = await uploadFile(filePath); // Assume this returns a full URL
      userData.image_url = imageUrl;
    } else {
      console.log('No file uploaded');
    }
    console.log(userData);
    
    // Validate user ID from auth middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: User ID missing',
      });
    }

  const updated = await updateUser({ id: req.user.id, data: userData });
console.log('User updated:', updated); // ✅ see the result

    
    return res.status(200).json({
      error: false,
      message: 'Update successful',
      data: updated,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      error: true,
      message: error.message || 'Something went wrong while updating the profile',
    });
  }
};

const resetPasswordController = async (req, res) => {

    try {

        if (!req.body.oldPassword || !req.body.newPassword) {

            return res.json({ message: 'Old password and new password are required' });

        }

        const resetPassword = await resetUserPassword({ userId: req.user.id, ...req.body });

        res.status(200).json({
            error: false,
            message: "Reset password successful",
            data: resetPassword
        });

    } catch (error) {

        throw Error(error);

    }
};

export {
    getUserController,
    resetPasswordController,
    updateUserController,
};










