const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const InventoryRecord = require('./inventoryRecord');
const Log = require('./log');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin', 'user'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  tableName: 'users',
  timestamps: true
});

User.hasMany(InventoryRecord, { foreignKey: 'operator_id' });
InventoryRecord.belongsTo(User, { foreignKey: 'operator_id' });

User.hasMany(Log, { foreignKey: 'user_id' });
Log.belongsTo(User, { foreignKey: 'user_id' });

module.exports = User; 