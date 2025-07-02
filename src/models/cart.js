import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnect.js';

const cart = sequelize.define('cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  buyer_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
}, {
  tableName: 'cart_item',
  timestamps: true,
  underscored: true,
});

export default cart;
