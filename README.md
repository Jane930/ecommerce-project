# 电子商务网站

华南理工大学《网络应用开发》课程实验项目

## 项目简介

这是一个基于 Vue 3 + Express 的全栈电子商务网站，实现了完整的在线购物功能，包括用户管理、商品管理、购物车、订单管理等核心功能。

## 技术栈

### 后端
- **Node.js** - JavaScript 运行环境
- **Express** - Web 应用框架
- **SQLite3** - 轻量级数据库
- **JWT** - 用户认证
- **bcryptjs** - 密码加密

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Axios** - HTTP 客户端
- **Tailwind CSS** - CSS 框架
- **Vite** - 构建工具

## 功能特性

### 顾客端功能
- ✅ 用户注册、登录、注销
- ✅ 浏览商品列表
- ✅ 搜索商品
- ✅ 添加商品到购物车
- ✅ 查看和管理购物车
- ✅ 创建订单
- ✅ 查看订单历史和状态

### 管理端功能
- ✅ 商品管理（增删改查）
- ✅ 订单管理
- ✅ 查看所有订单
- ✅ 用户活动日志记录

## 项目结构

```
ecommerce-project/
├── backend/                 # 后端代码
│   ├── database.js         # 数据库配置
│   ├── server.js           # 服务器入口
│   ├── middleware/         # 中间件
│   │   └── auth.js        # 认证中间件
│   └── routes/            # API 路由
│       ├── users.js       # 用户路由
│       ├── products.js    # 商品路由
│       └── orders.js      # 订单路由
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── api/           # API 接口
│   │   ├── stores/        # 状态管理
│   │   ├── router/        # 路由配置
│   │   ├── views/         # 页面组件
│   │   ├── App.vue        # 根组件
│   │   └── main.js        # 入口文件
│   └── index.html         # HTML 模板
└── README.md              # 项目文档
```

## 安装和运行

### 环境要求
- Node.js 14.0 或更高版本
- npm 或 yarn 包管理器

### 后端安装和运行

1. 进入后端目录：
```bash
cd backend
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量（编辑 .env 文件）：
```
PORT=3000
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

4. 初始化数据库（首次运行）：
```bash
npm run init
```

这将创建：
- 2 个测试账号（admin 和 user）
- 15 个示例商品
- 1 个示例订单

5. 启动后端服务器：
```bash
npm start
```

后端服务器将运行在 http://localhost:3000

### 前端安装和运行

1. 打开新终端，进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

前端应用将运行在 http://localhost:5173

## 测试账号

### 管理员账号
- 用户名: admin
- 密码: admin123
- 角色: 管理员（可访问管理后台）

### 普通用户账号
- 用户名: user
- 密码: user123
- 角色: 顾客

注意：首次运行需要先注册这些账号，或者直接注册新账号使用。

## 使用说明

### 顾客端操作流程

1. **注册/登录**
   - 访问首页，点击"注册"按钮
   - 填写用户名、邮箱和密码完成注册
   - 使用注册的账号登录系统

2. **浏览和搜索商品**
   - 点击导航栏的"商品列表"
   - 使用搜索框搜索商品
   - 查看商品详情、价格和库存

3. **购物流程**
   - 点击"加入购物车"按钮
   - 进入"购物车"页面查看已选商品
   - 点击"结算"按钮创建订单
   - 在"我的订单"页面查看订单状态

### 管理员操作流程

1. **登录管理后台**
   - 使用管理员账号登录
   - 点击导航栏的"管理后台"

2. **商品管理**
   - 点击"添加商品"按钮创建新商品
   - 填写商品名称、描述、价格、库存等信息
   - 点击"编辑"修改商品信息
   - 点击"删除"移除商品

3. **订单管理**
   - 切换到"订单管理"标签
   - 查看所有用户的订单信息
   - 查看订单状态和金额

## API 接口文档

### 用户相关接口
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户信息（需认证）

### 商品相关接口
- `GET /api/products` - 获取商品列表
- `GET /api/products/:id` - 获取商品详情
- `POST /api/products` - 创建商品（需管理员权限）
- `PUT /api/products/:id` - 更新商品（需管理员权限）
- `DELETE /api/products/:id` - 删除商品（需管理员权限）

### 订单和购物车接口
- `GET /api/orders/cart` - 获取购物车（需认证）
- `POST /api/orders/cart` - 添加商品到购物车（需认证）
- `DELETE /api/orders/cart/:id` - 删除购物车商品（需认证）
- `POST /api/orders` - 创建订单（需认证）
- `GET /api/orders` - 获取用户订单列表（需认证）
- `GET /api/orders/admin/all` - 获取所有订单（需管理员权限）

## 数据库设计

### 用户表 (users)
- id: 用户ID（主键）
- username: 用户名（唯一）
- email: 邮箱（唯一）
- password: 密码（加密存储）
- role: 角色（customer/admin）
- created_at: 创建时间

### 商品表 (products)
- id: 商品ID（主键）
- name: 商品名称
- description: 商品描述
- price: 价格
- stock: 库存
- image_url: 图片URL
- category: 分类
- created_at: 创建时间

### 订单表 (orders)
- id: 订单ID（主键）
- user_id: 用户ID（外键）
- total_amount: 总金额
- status: 订单状态
- created_at: 创建时间

### 订单详情表 (order_items)
- id: 详情ID（主键）
- order_id: 订单ID（外键）
- product_id: 商品ID（外键）
- quantity: 数量
- price: 单价

### 购物车表 (cart)
- id: 购物车ID（主键）
- user_id: 用户ID（外键）
- product_id: 商品ID（外键）
- quantity: 数量

### 活动日志表 (activity_logs)
- id: 日志ID（主键）
- user_id: 用户ID（外键）
- action: 操作类型
- details: 详细信息
- created_at: 创建时间
