const { Op } = require('sequelize');
const Facility = require('../models/facility');
const sequelize = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    // 1. 总设施数量
    const totalFacilities = await Facility.count();

    // 2. 按状态统计设施数量
    const statusCounts = await Facility.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status']
    });

    // 3. 日期处理：让 now 只保留日期部分
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    // 4. 即将过期的设施 (今天及未来30天)
    const expiringSoon = await Facility.findAll({
      where: {
        expiry_date: {
          [Op.gte]: now,
          [Op.lte]: thirtyDaysFromNow
        }
      },
      order: [['expiry_date', 'ASC']]
    });

    // 5. 已经过期的设施 (expiry_date < 今天)
    const expiredFacilities = await Facility.findAll({
      where: {
        expiry_date: {
          [Op.lt]: now
        }
      },
      order: [['expiry_date', 'ASC']]
    });

    // 6. 获取所有设施
    const allFacilities = await Facility.findAll({
      order: [
        ['status', 'ASC'],
        ['name', 'ASC']
      ]
    });

    res.json({
      totalFacilities,
      statusCounts,
      expiringSoon,
      expiredFacilities,
      allFacilities
    });

  } catch (error) {
    res.status(500).json({ message: '获取统计数据失败', error });
  }
}; 