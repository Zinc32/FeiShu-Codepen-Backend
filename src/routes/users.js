const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 注册新用户
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 检查用户是否已存在
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: '用户名或邮箱已被注册'
            });
        }

        const user = new User({
            username,
            email,
            password // 注意：实际应用中需要对密码进行加密
        });

        const newUser = await user.save();
        res.status(201).json({
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 获取用户信息
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 