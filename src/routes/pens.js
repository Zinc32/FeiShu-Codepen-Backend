const express = require('express');
const router = express.Router();
const Pen = require('../models/Pen');
const auth = require('../middleware/auth'); // Import auth middleware

// 获取所有公开的 pens
router.get('/public', async (req, res) => {
    try {
        const pens = await Pen.find({ isPublic: true })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });
        res.json(pens);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 获取用户的 pens
router.get('/user/me', auth, async (req, res) => {
    try {
        // req.user 由 auth 中间件设置
        const pens = await Pen.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(pens);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 创建新的 pen
router.post('/', auth, async (req, res) => {
    const pen = new Pen({
        title: req.body.title,
        description: req.body.description,
        html: req.body.html,
        css: req.body.css,
        js: req.body.js,
        userId: req.user.id, // 从认证后的用户中获取 userId
        isPublic: req.body.isPublic
    });

    try {
        const newPen = await pen.save();
        res.status(201).json(newPen);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 更新 pen
router.patch('/:id', auth, async (req, res) => {
    try {
        const pen = await Pen.findById(req.params.id);
        if (!pen) {
            return res.status(404).json({ message: 'Pen not found' });
        }

        // 确保只有 pen 的创建者才能更新
        if (pen.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: '用户未授权' });
        }

        Object.keys(req.body).forEach(key => {
            pen[key] = req.body[key];
        });
        pen.updatedAt = Date.now();

        const updatedPen = await pen.save();
        res.json(updatedPen);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 删除 pen
router.delete('/:id', auth, async (req, res) => {
    try {
        const pen = await Pen.findById(req.params.id);
        if (!pen) {
            return res.status(404).json({ message: 'Pen not found' });
        }

        // 确保只有 pen 的创建者才能删除
        if (pen.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: '用户未授权' });
        }

        await pen.deleteOne(); // Use deleteOne instead of remove
        res.json({ message: 'Pen deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 