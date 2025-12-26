const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 用户注册
router.post('/register', async (req, res) => {
  const { username, email, password, role = 'customer' } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: '请提供完整的注册信息' });
  }

  try {
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: '用户名或邮箱已存在' });
          }
          return res.status(500).json({ error: '注册失败' });
        }

        // 记录活动日志
        db.run('INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
          [this.lastID, 'register', `用户 ${username} 注册成功`]);

        res.status(201).json({
          message: '注册成功',
          userId: this.lastID
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 用户登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '请提供用户名和密码' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: '服务器错误' });
    }

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }

      // 生成JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // 记录登录日志
      db.run('INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
        [user.id, 'login', `用户 ${username} 登录`]);

      res.json({
        message: '登录成功',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: '服务器错误' });
    }
  });
});

// 获取当前用户信息
router.get('/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, role, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: '服务器错误' });
      }
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      res.json(user);
    }
  );
});

// 用户注销（登出）
router.post('/logout', authenticateToken, (req, res) => {
  // 记录注销日志
  db.run('INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
    [req.user.id, 'logout', `用户 ${req.user.username} 注销登录`]);

  res.json({ message: '注销成功' });
});

// 获取所有客户列表（仅管理员）
router.get('/admin/customers', authenticateToken, requireAdmin, (req, res) => {
  const query = `
    SELECT u.id, u.username, u.email, u.created_at,
           COUNT(DISTINCT o.id) as totalOrders,
           COALESCE(SUM(o.total_amount), 0) as totalSpent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.role = 'customer'
    GROUP BY u.id
    ORDER BY totalSpent DESC
  `;

  db.all(query, [], (err, customers) => {
    if (err) {
      return res.status(500).json({ error: '获取客户列表失败' });
    }
    res.json(customers);
  });
});

// 获取客户详情和活动日志（仅管理员）
router.get('/admin/customers/:id', authenticateToken, requireAdmin, (req, res) => {
  const customerId = req.params.id;

  // 获取客户基本信息
  db.get('SELECT id, username, email, created_at FROM users WHERE id = ? AND role = "customer"',
    [customerId],
    (err, customer) => {
      if (err) {
        return res.status(500).json({ error: '获取客户信息失败' });
      }
      if (!customer) {
        return res.status(404).json({ error: '客户不存在' });
      }

      // 获取客户活动日志
      db.all('SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
        [customerId],
        (err, logs) => {
          if (err) {
            return res.status(500).json({ error: '获取活动日志失败' });
          }

          // 获取客户订单统计
          db.get(`
            SELECT COUNT(*) as totalOrders,
                   COALESCE(SUM(total_amount), 0) as totalSpent
            FROM orders
            WHERE user_id = ?
          `, [customerId], (err, stats) => {
            if (err) {
              return res.status(500).json({ error: '获取订单统计失败' });
            }

            res.json({
              customer,
              activityLogs: logs,
              orderStats: stats
            });
          });
        }
      );
    }
  );
});

module.exports = router;
