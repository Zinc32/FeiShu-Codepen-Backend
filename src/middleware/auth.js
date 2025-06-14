const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 从请求头获取 token
    const token = req.header('Authorization');

    // 检查 token 是否存在
    if (!token) {
        return res.status(401).json({ message: '没有 token，授权被拒绝' });
    }

    try {
        // 验证 token
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

        // 将用户添加到请求中
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token 无效' });
    }
}; 