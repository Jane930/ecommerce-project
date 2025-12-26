const db = require('./database');
const bcrypt = require('bcryptjs');

// 初始化数据
async function initData() {
  console.log('开始初始化数据...');

  try {
    // 创建管理员账号
    const adminPassword = await bcrypt.hash('admin123', 10);
    db.run(
      'INSERT OR IGNORE INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [1, 'admin', 'admin@example.com', adminPassword, 'admin'],
      (err) => {
        if (err) console.error('创建管理员失败:', err);
        else console.log('✓ 管理员账号创建成功');
      }
    );

    // 创建普通用户
    const userPassword = await bcrypt.hash('user123', 10);
    db.run(
      'INSERT OR IGNORE INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [2, 'user', 'user@example.com', userPassword, 'customer'],
      (err) => {
        if (err) console.error('创建用户失败:', err);
        else console.log('✓ 普通用户创建成功');
      }
    );

    // 等待用户创建完成
    setTimeout(() => {
      insertProducts();
    }, 500);

  } catch (error) {
    console.error('初始化数据失败:', error);
  }
}

// 插入商品数据
function insertProducts() {
  const products = [
    { name: 'iPhone 15 Pro', description: '最新款苹果手机，A17 Pro芯片，钛金属边框', price: 7999, stock: 50, category: '手机', image_url: 'https://picsum.photos/300/300?random=1' },
    { name: 'MacBook Pro 14', description: 'M3芯片，14英寸Liquid视网膜显示屏', price: 14999, stock: 30, category: '电脑', image_url: 'https://picsum.photos/300/300?random=2' },
    { name: 'AirPods Pro 2', description: '主动降噪，空间音频，USB-C充电', price: 1899, stock: 100, category: '耳机', image_url: 'https://picsum.photos/300/300?random=3' },
    { name: 'iPad Air', description: 'M1芯片，10.9英寸显示屏，支持Apple Pencil', price: 4799, stock: 60, category: '平板', image_url: 'https://picsum.photos/300/300?random=4' },
    { name: 'Apple Watch Series 9', description: 'S9芯片，全天候视网膜显示屏', price: 3199, stock: 80, category: '手表', image_url: 'https://picsum.photos/300/300?random=5' }
  ];

  let completed = 0;
  products.forEach((product, index) => {
    db.run(
      'INSERT OR IGNORE INTO products (id, name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [index + 1, product.name, product.description, product.price, product.stock, product.category, product.image_url],
      (err) => {
        if (err) console.error(`创建商品 ${product.name} 失败:`, err);
        else console.log(`✓ 商品 ${product.name} 创建成功`);

        completed++;
        if (completed === products.length) {
          insertMoreProducts();
        }
      }
    );
  });
}

// 插入更多商品
function insertMoreProducts() {
  const moreProducts = [
    { name: 'Samsung Galaxy S24', description: '三星旗舰手机，骁龙8 Gen 3处理器', price: 5999, stock: 45, category: '手机', image_url: 'https://picsum.photos/300/300?random=6' },
    { name: 'Dell XPS 15', description: '15.6英寸4K显示屏，Intel i7处理器', price: 12999, stock: 25, category: '电脑', image_url: 'https://picsum.photos/300/300?random=7' },
    { name: 'Sony WH-1000XM5', description: '顶级降噪耳机，30小时续航', price: 2499, stock: 70, category: '耳机', image_url: 'https://picsum.photos/300/300?random=8' },
    { name: 'Kindle Paperwhite', description: '6.8英寸电子书阅读器，防水设计', price: 998, stock: 120, category: '电子书', image_url: 'https://picsum.photos/300/300?random=9' },
    { name: 'Nintendo Switch', description: '任天堂游戏机，OLED屏幕版', price: 2399, stock: 55, category: '游戏机', image_url: 'https://picsum.photos/300/300?random=10' }
  ];

  let completed = 0;
  moreProducts.forEach((product, index) => {
    db.run(
      'INSERT OR IGNORE INTO products (id, name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [index + 6, product.name, product.description, product.price, product.stock, product.category, product.image_url],
      (err) => {
        if (err) console.error(`创建商品 ${product.name} 失败:`, err);
        else console.log(`✓ 商品 ${product.name} 创建成功`);

        completed++;
        if (completed === moreProducts.length) {
          insertFinalProducts();
        }
      }
    );
  });
}

// 插入最后一批商品
function insertFinalProducts() {
  const finalProducts = [
    { name: 'GoPro Hero 12', description: '运动相机，5.3K视频录制', price: 3499, stock: 40, category: '相机', image_url: 'https://picsum.photos/300/300?random=11' },
    { name: 'Bose SoundLink', description: '便携蓝牙音箱，12小时续航', price: 1299, stock: 90, category: '音箱', image_url: 'https://picsum.photos/300/300?random=12' },
    { name: 'Logitech MX Master 3', description: '无线鼠标，人体工学设计', price: 699, stock: 150, category: '配件', image_url: 'https://picsum.photos/300/300?random=13' },
    { name: 'Samsung T7 SSD 1TB', description: '移动固态硬盘，1050MB/s读取速度', price: 899, stock: 100, category: '存储', image_url: 'https://picsum.photos/300/300?random=14' },
    { name: 'Anker PowerCore', description: '20000mAh移动电源，快充支持', price: 299, stock: 200, category: '配件', image_url: 'https://picsum.photos/300/300?random=15' }
  ];

  let completed = 0;
  finalProducts.forEach((product, index) => {
    db.run(
      'INSERT OR IGNORE INTO products (id, name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [index + 11, product.name, product.description, product.price, product.stock, product.category, product.image_url],
      (err) => {
        if (err) console.error(`创建商品 ${product.name} 失败:`, err);
        else console.log(`✓ 商品 ${product.name} 创建成功`);

        completed++;
        if (completed === finalProducts.length) {
          insertSampleOrders();
        }
      }
    );
  });
}

// 插入示例订单
function insertSampleOrders() {
  // 为普通用户创建一个示例订单
  db.run(
    'INSERT OR IGNORE INTO orders (id, user_id, total_amount, status) VALUES (?, ?, ?, ?)',
    [1, 2, 9898, 'pending'],
    (err) => {
      if (err) console.error('创建示例订单失败:', err);
      else {
        console.log('✓ 示例订单创建成功');

        // 添加订单详情
        db.run('INSERT OR IGNORE INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [1, 1, 1, 7999]);
        db.run('INSERT OR IGNORE INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [1, 3, 1, 1899]);

        console.log('✓ 订单详情添加成功');
      }

      setTimeout(() => {
        console.log('\n=================================');
        console.log('数据初始化完成！');
        console.log('=================================');
        console.log('测试账号：');
        console.log('管理员 - 用户名: admin, 密码: admin123');
        console.log('普通用户 - 用户名: user, 密码: user123');
        console.log('已创建 15 个商品和 1 个示例订单');
        console.log('=================================\n');
        process.exit(0);
      }, 500);
    }
  );
}

// 运行初始化
initData();
