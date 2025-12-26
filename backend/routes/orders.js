const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// 配置邮件发送器
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.qq.com',
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 获取购物车
router.get('/cart', authenticateToken, (req, res) => {
  const query = `
    SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.all(query, [req.user.id], (err, items) => {
    if (err) {
      return res.status(500).json({ error: '获取购物车失败' });
    }
    res.json(items);
  });
});

// 添加商品到购物车
router.post('/cart', authenticateToken, (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  // 检查商品是否存在
  db.get('SELECT * FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ error: '商品不存在' });
    }

    // 检查库存
    if (product.stock < quantity) {
      return res.status(400).json({ error: '库存不足' });
    }

    // 检查购物车中是否已有该商品
    db.get('SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id],
      (err, item) => {
        if (item) {
          // 更新数量
          db.run('UPDATE cart SET quantity = quantity + ? WHERE id = ?',
            [quantity, item.id],
            (err) => {
              if (err) {
                return res.status(500).json({ error: '更新购物车失败' });
              }
              res.json({ message: '已更新购物车' });
            }
          );
        } else {
          // 添加新商品
          db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [req.user.id, product_id, quantity],
            (err) => {
              if (err) {
                return res.status(500).json({ error: '添加到购物车失败' });
              }
              res.status(201).json({ message: '已添加到购物车' });
            }
          );
        }
      }
    );
  });
});

// 删除购物车商品
router.delete('/cart/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM cart WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '删除失败' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: '商品不存在' });
      }
      res.json({ message: '已从购物车删除' });
    }
  );
});

// 创建订单
router.post('/', authenticateToken, (req, res) => {
  // 获取购物车商品
  const cartQuery = `
    SELECT c.*, p.price, p.stock, p.name
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.all(cartQuery, [req.user.id], (err, items) => {
    if (err || items.length === 0) {
      return res.status(400).json({ error: '购物车为空' });
    }

    // 计算总金额并检查库存
    let totalAmount = 0;
    for (const item of items) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ error: `商品 ${item.name} 库存不足` });
      }
      totalAmount += item.price * item.quantity;
    }

    // 创建订单
    db.run('INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [req.user.id, totalAmount],
      function(err) {
        if (err) {
          return res.status(500).json({ error: '创建订单失败' });
        }

        const orderId = this.lastID;

        // 添加订单详情并更新库存
        const insertPromises = items.map(item => {
          return new Promise((resolve, reject) => {
            db.run('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
              [orderId, item.product_id, item.quantity, item.price],
              (err) => {
                if (err) return reject(err);

                // 更新库存
                db.run('UPDATE products SET stock = stock - ? WHERE id = ?',
                  [item.quantity, item.product_id],
                  (err) => err ? reject(err) : resolve()
                );
              }
            );
          });
        });

        Promise.all(insertPromises)
          .then(() => {
            // 清空购物车
            db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

            // 记录活动日志
            db.run('INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
              [req.user.id, 'purchase', `创建订单 #${orderId}`]);

            // 发送订单确认邮件
            db.get('SELECT email, username FROM users WHERE id = ?', [req.user.id], (err, user) => {
              if (!err && user) {
                const mailOptions = {
                  from: process.env.EMAIL_USER,
                  to: user.email,
                  subject: '订单确认 - 电子商务网站',
                  html: `
                    <h2>订单确认</h2>
                    <p>尊敬的 ${user.username}，</p>
                    <p>您的订单已成功创建！</p>
                    <p><strong>订单号：</strong>#${orderId}</p>
                    <p><strong>订单金额：</strong>¥${totalAmount.toFixed(2)}</p>
                    <p><strong>订单状态：</strong>待处理</p>
                    <h3>订单详情：</h3>
                    <ul>
                      ${items.map(item => `<li>${item.name} x ${item.quantity} - ¥${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
                    </ul>
                    <p>感谢您的购买！</p>
                  `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log('邮件发送失败:', error);
                  } else {
                    console.log('邮件发送成功:', info.response);
                  }
                });
              }
            });

            res.status(201).json({
              message: '订单创建成功',
              orderId,
              totalAmount
            });
          })
          .catch(() => {
            res.status(500).json({ error: '订单处理失败' });
          });
      }
    );
  });
});

// 获取用户订单列表
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT o.*,
      GROUP_CONCAT(p.name || ' x' || oi.quantity) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  db.all(query, [req.user.id], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: '获取订单列表失败' });
    }
    res.json(orders);
  });
});

// 获取所有订单（仅管理员）
router.get('/admin/all', authenticateToken, requireAdmin, (req, res) => {
  const query = `
    SELECT o.*, u.username, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  db.all(query, [], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: '获取订单列表失败' });
    }
    res.json(orders);
  });
});

// 获取销售统计报表（仅管理员）
router.get('/admin/statistics', authenticateToken, requireAdmin, (req, res) => {
  const stats = {};

  // 获取总销售额
  db.get('SELECT SUM(total_amount) as totalSales, COUNT(*) as totalOrders FROM orders', [], (err, result) => {
    if (err) {
      return res.status(500).json({ error: '获取统计数据失败' });
    }

    stats.totalSales = result.totalSales || 0;
    stats.totalOrders = result.totalOrders || 0;

    // 获取按状态分组的订单数
    db.all('SELECT status, COUNT(*) as count FROM orders GROUP BY status', [], (err, statusData) => {
      if (err) {
        return res.status(500).json({ error: '获取状态统计失败' });
      }

      stats.ordersByStatus = statusData;

      // 获取最畅销商品
      db.all(`
        SELECT p.name, SUM(oi.quantity) as totalSold, SUM(oi.quantity * oi.price) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY oi.product_id
        ORDER BY totalSold DESC
        LIMIT 10
      `, [], (err, topProducts) => {
        if (err) {
          return res.status(500).json({ error: '获取商品统计失败' });
        }

        stats.topProducts = topProducts;

        // 获取每日销售统计（最近7天）
        db.all(`
          SELECT DATE(created_at) as date,
                 COUNT(*) as orders,
                 SUM(total_amount) as sales
          FROM orders
          WHERE created_at >= date('now', '-7 days')
          GROUP BY DATE(created_at)
          ORDER BY date DESC
        `, [], (err, dailySales) => {
          if (err) {
            return res.status(500).json({ error: '获取每日统计失败' });
          }

          stats.dailySales = dailySales;
          res.json(stats);
        });
      });
    });
  });
});

module.exports = router;
