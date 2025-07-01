import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnect.js';
import orderItems from './orderItem.js';

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  seller_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  buyer_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true,
});

// Set up associations (optional but valid here)
Order.hasMany(orderItems, { foreignKey: 'order_id' });
orderItems.belongsTo(Order, { foreignKey: 'order_id' });

export default Order;
