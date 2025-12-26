const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 获取所有商品（支持分页和搜索）
router.get('/', (req, res) => {
  const { page = 1, limit = 10, search = '', category = '' } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, products) => {
    if (err) {
      return res.status(500).json({ error: '获取商品列表失败' });
    }

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];

    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    db.get(countQuery, countParams, (err, result) => {
      if (err) {
        return res.status(500).json({ error: '获取商品总数失败' });
      }

      res.json({
        products,
        total: result.total,
        page: parseInt(page),
        totalPages: Math.ceil(result.total / limit)
      });
    });
  });
});

// 获取单个商品详情
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: '获取商品详情失败' });
    }
    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }
    res.json(product);
  });
});

// 创建商品（仅管理员）
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, stock, image_url, category } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: '请提供商品名称和价格' });
  }

  db.run(
    'INSERT INTO products (name, description, price, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, stock || 0, image_url, category],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '创建商品失败' });
      }
      res.status(201).json({
        message: '商品创建成功',
        productId: this.lastID
      });
    }
  );
});

// 更新商品（仅管理员）
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, stock, image_url, category } = req.body;

  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category = ? WHERE id = ?',
    [name, description, price, stock, image_url, category, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '更新商品失败' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: '商品不存在' });
      }
      res.json({ message: '商品更新成功' });
    }
  );
});

// 删除商品（仅管理员）
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: '删除商品失败' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: '商品不存在' });
    }
    res.json({ message: '商品删除成功' });
  });
});

module.exports = router;
