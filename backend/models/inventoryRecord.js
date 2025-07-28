const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const InventoryRecord = sequelize.define('InventoryRecord', {
  facility_id: { type: DataTypes.INTEGER, allowNull: false },
  operation_type: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  operator_id: { type: DataTypes.INTEGER, allowNull: false },
  operation_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  remark: { type: DataTypes.STRING }
}, {
  tableName: 'inventory_records',
  timestamps: false
});

module.exports = InventoryRecord; 