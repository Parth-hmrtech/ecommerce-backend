import users from '../models/user.js';

const findUser = async (userId) => {
    return await users.findByPk(userId);
};
const updateUser = async ({ id, data }) => {
    const result = await users.update(data, {
        where: { id },
    });

    return result[0] > 0; // returns true if update affected rows
};


const resetUserPassword = async ({ userId, oldPassword, newPassword }) => {
    console.log(oldPassword);
    console.log(newPassword);
    
    const user = await users.findByPk(userId);
    const isValid = await user.validPassword(oldPassword);

    if (!isValid) {
        return { message: 'Old password is incorrect' };
    }

    user.password_hash = newPassword;

    await user.save();
    return user;
};

export {
    findUser,
    updateUser,
    resetUserPassword,
};