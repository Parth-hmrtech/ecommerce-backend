import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnect.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false, // Recommend making it required
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false, // Recommend making it required
  },
  role: {
    type: DataTypes.ENUM('seller', 'buyer'),
    defaultValue: 'buyer',
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['email', 'role'],
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    },
  }
});

// Instance method
User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password_hash);
};

export default User;
