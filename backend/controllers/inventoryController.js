const InventoryRecord = require('../models/inventoryRecord');
const Facility = require('../models/facility');
const User = require('../models/user');
const Log = require('../models/log');
const { Op } = require('sequelize');
const sequelize = require('../config/db');
const moment = require('moment');

// 入库操作
exports.inStock = async (req, res) => {
  const { facility_id, quantity, remark } = req.body;
  const operator_id = req.user.id;

  try {
    // 1. 创建入库记录
    const record = await InventoryRecord.create({
      facility_id,
      quantity,
      remark,
      operation_type: '入库',
      operator_id
    });

    // 2. 更新设施数量
    const facility = await Facility.findByPk(facility_id);
    await facility.update({ 
      quantity: facility.quantity + quantity
    });
    
    // 3. 记录日志
    await Log.create({ user_id: operator_id, action: `入库 ${facility.name} (数量: ${quantity})` });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: '操作失败', error });
  }
};

// 出库操作
exports.outStock = async (req, res) => {
  const { facility_id, quantity, remark } = req.body;
  const operator_id = req.user.id;

  try {
    // 1. 检查设施状态
    const facility = await Facility.findByPk(facility_id);
    if (facility.status !== '在库') {
      return res.status(400).json({ message: '该设施当前不可出库' });
    }

    // 2. 创建出库记录
    const record = await InventoryRecord.create({
      facility_id,
      quantity,
      remark,
      operation_type: '出库',
      operator_id
    });

    // 3. 检查库存数量是否足够
    if (facility.quantity < quantity) {
      return res.status(400).json({ message: '库存数量不足' });
    }

    // 4. 更新设施数量
    await facility.update({ 
      quantity: facility.quantity - quantity
    });

    // 4. 记录日志
    await Log.create({ user_id: operator_id, action: `出库 ${facility.name} (数量: ${quantity})` });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: '操作失败', error });
  }
};

// 获取库存记录
exports.getRecords = async (req, res) => {
  try {
    const records = await InventoryRecord.findAll({
      include: [
        { model: Facility, attributes: ['name', 'model', 'status'] },
        { model: User, attributes: ['username'] }
      ],
      order: [['operation_time', 'DESC']]
    });

    // 获取预警信息
    const warnings = await getWarnings();

    res.json({
      records,
      warnings
    });
  } catch (error) {
    res.status(500).json({ message: '记录查询失败', error });
  }
};

// 获取预警信息
async function getWarnings() {
  const warnings = [];

  try {
    // 1. 检查即将过期的设施
    const thirtyDaysFromNow = moment().add(30, 'days').toDate();
    const expiringFacilities = await Facility.findAll({
      where: {
        expiry_date: {
          [Op.lte]: thirtyDaysFromNow,
          [Op.gt]: new Date()
        }
      }
    });

    if (expiringFacilities.length > 0) {
      warnings.push({
        type: 'expiring',
        message: `${expiringFacilities.length}个设施即将在30天内过期`,
        facilities: expiringFacilities
      });
    }

    // 2. 检查频繁出库的设施
    const lastMonth = moment().subtract(30, 'days').toDate();
    // 首先获取频繁出库的设施ID
    const frequentOutStockIds = await InventoryRecord.findAll({
      attributes: [
        'facility_id',
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        operation_type: '出库',
        operation_time: {
          [Op.gte]: lastMonth
        }
      },
      group: ['facility_id'],
      having: sequelize.literal('COUNT(*) >= 5')
    });

    // 然后获取这些设施的详细信息
    const facilityIds = frequentOutStockIds.map(record => record.facility_id);
    const frequentOutStock = await Facility.findAll({
      where: {
        id: {
          [Op.in]: facilityIds
        }
      }
    });

    if (frequentOutStock.length > 0) {
      warnings.push({
        type: 'frequent_out',
        message: `${frequentOutStock.length}个设施出库频繁`,
        facilities: frequentOutStock
      });
    }

    return warnings;
  } catch (error) {
    console.error('获取预警信息失败:', error);
    return [];
  }
}