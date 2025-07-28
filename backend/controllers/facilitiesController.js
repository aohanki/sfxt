const Facility = require('../models/facility');
const Log = require('../models/log');

exports.getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.findAll();
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ message: '获取设施列表失败', error });
  }
};

exports.createFacility = async (req, res) => {
  try {
    console.log('收到前端数据:', req.body);
    const facility = await Facility.create(req.body);
    await Log.create({ user_id: req.user.id, action: `创建设施: ${facility.name}` });
    res.status(201).json(facility);
  } catch (error) {
    console.error('创建设施失败:', error);
    res.status(500).json({ message: '创建设施失败', error });
  }
};

exports.batchCreateFacilities = async (req, res) => {
  const facilities = req.body;
  try {
    const createdFacilities = await Facility.bulkCreate(facilities);
    await Log.create({ 
      user_id: req.user.id, 
      action: `批量导入${createdFacilities.length}个设施` 
    });
    res.status(201).json(createdFacilities);
  } catch (error) {
    res.status(500).json({ message: '批量导入设施失败', error });
  }
};

exports.updateFacility = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('收到前端数据:', req.body);
    await Facility.update(req.body, { where: { id } });
    const facility = await Facility.findByPk(id);
    await Log.create({ user_id: req.user.id, action: `更新设施: ${facility.name}` });
    res.json({ message: '更新成功' });
  } catch (error) {
    console.error('更新设施失败:', error);
    res.status(500).json({ message: '更新设施失败', error });
  }
};

exports.deleteFacility = async (req, res) => {
  const { id } = req.params;
  try {
    const facility = await Facility.findByPk(id);
    await facility.destroy();
    await Log.create({ user_id: req.user.id, action: `删除设施: ${facility.name}` });
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除设施失败', error });
  }
}; 