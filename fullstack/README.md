# 🐳 鲸鱼娘的全栈小窝

把个人主页重构为 **Vue 3.5 + Django + SQLite** 的全栈体系骨架。
打通链路：Vue 组件 → fetch → Django REST Framework API → SQLite 数据库。

## 目录结构

```
fullstack/
├── backend/                 # Django 后端
│   ├── config/              # 项目配置（settings / 总路由）
│   ├── app/                 # 业务应用（模型 / 序列化器 / 视图 / 路由 / 后台）
│   └── manage.py            # Django 命令行入口
└── frontend/                # Vue 3.5 前端
    └── src/
        ├── api.ts           # 前端调用后端 API 的封装
        ├── App.vue          # 根组件
        └── components/      # TodoCard / QuoteCard / CountdownCard
```

## 数据模型（三张表）

| 表 | 模块 | 说明 |
|----|------|------|
| Todo | 待办清单 | title + done（增删改查全链路） |
| Quote | 摸鱼语录 | text + author，支持随机一条 |
| Countdown | 倒计时 | name + target_time |

## 启动步骤

### 1. 启动后端（端口 8001）

```bash
cd fullstack/backend
python manage.py migrate          # 第一次先建表
python manage.py runserver 127.0.0.1:8001
```

可选：造种子数据（语录/待办/倒计时示例）：
```bash
python manage.py shell -c "from app.models import Quote,Todo,Countdown; from datetime import datetime,timezone; Quote.objects.create(text='Talk is cheap, show me the code', author='Linus'); Todo.objects.create(title='示例待办', done=False); Countdown.objects.create(name='考研倒计时', target_time=datetime(2026,12,26,tzinfo=timezone.utc)); print('ok')"
```

Django 后台（可视化增删数据）：浏览器打开 `http://127.0.0.1:8001/admin/`

### 2. 启动前端（端口 5175 附近）

```bash
cd fullstack/frontend
npm install        # 第一次先装依赖
npm run dev
```

浏览器打开终端提示的地址（如 `http://localhost:5175/`）。

### 3. 验证 API（可选）

```bash
curl http://127.0.0.1:8001/api/todos/          # 待办列表
curl http://127.0.0.1:8001/api/quotes/random/  # 随机语录
curl http://127.0.0.1:8001/api/countdowns/     # 倒计时列表
```

## 关键配置备忘

- 后端允许的跨域来源在 `backend/config/settings.py` 的 `CORS_ALLOWED_ORIGINS`（前端换端口要同步加）
- 前端后端地址在 `frontend/src/api.ts` 顶部的 `BASE`
- 本骨架刻意关闭了登录认证（`AllowAny`），**仅限本地学习**；上线前必须补 Token/JWT 认证

## 学习要点

- ORM：`models.py` 里用 Python 类定义表，`migrate` 自动建表，无需手写 SQL
- DRF：`ModelViewSet` 一个类 = 列表/新增/详情/改/删五种接口；`ModelSerializer` 自动翻译 JSON
- 全栈数据流：前端不再用 localStorage，数据统一存服务器数据库，任何设备看到同一份
