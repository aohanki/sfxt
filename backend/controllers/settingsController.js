const Setting = require('../models/setting');
const nodemailer = require('nodemailer');

// 获取所有设置
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = JSON.parse(setting.value);
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ message: '获取设置失败', error });
  }
};

// 更新设置
exports.updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    console.log('Received settings:', settings);
    
    // 保存每个设置项
    for (const [key, value] of Object.entries(settings)) {
      console.log('Saving setting:', key, value);
      try {
        await Setting.upsert({
          key,
          value: JSON.stringify(value)
        });
        console.log('Setting saved successfully:', key);
      } catch (error) {
        console.error('Error saving setting:', key, error);
        throw error;
      }
    }

    // 暂时跳过邮件测试
    console.log('All settings updated successfully');

    res.json({ message: '设置更新成功' });
  } catch (error) {
    res.status(500).json({ message: '更新设置失败', error });
  }
};

// 发送预警邮件
exports.sendWarningEmail = async (warnings) => {
  try {
    const settings = await Setting.findAll();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = JSON.parse(setting.value);
    });

    if (!settingsObj.enableEmailNotification || !settingsObj.emailRecipients) {
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    let warningText = '消防设施库存管理系统预警通知：\n\n';
    warnings.forEach(warning => {
      warningText += `${warning.message}\n`;
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: settingsObj.emailRecipients,
      subject: '消防设施库存管理系统 - 预警通知',
      text: warningText
    });
  } catch (error) {
    console.error('发送预警邮件失败:', error);
  }
}; 