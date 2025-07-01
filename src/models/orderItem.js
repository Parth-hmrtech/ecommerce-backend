import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnect.js';

const OrderItem = sequelize.define('order_item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  seller_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: 'order_items',
  timestamps: true, 
  underscored: true,
});

export default OrderItem;
