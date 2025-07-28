const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const InventoryRecord = require('./inventoryRecord');

const Facility = sequelize.define('Facility', {
  name: { type: DataTypes.STRING, allowNull: false },
  model: { type: DataTypes.STRING },
  serial_number: { type: DataTypes.STRING, unique: true },
  location: { type: DataTypes.STRING },
  manufacturer: { type: DataTypes.STRING },
  purchase_date: { type: DataTypes.DATE },
  expiry_date: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING, defaultValue: '在库' },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  longitude: { type: DataTypes.DOUBLE },
  latitude: { type: DataTypes.DOUBLE }
}, {
  tableName: 'facilities',
  timestamps: false
});

Facility.hasMany(InventoryRecord, { foreignKey: 'facility_id' });
InventoryRecord.belongsTo(Facility, { foreignKey: 'facility_id' });

module.exports = Facility; 