# 🐳 我的个人主页 · Vue 3.5 + Django + SQLite 全栈重构版

把原「我的个人主页」（vite 版 19 个功能模块）整体重构为 **Vue 3.5 + Django REST Framework + SQLite** 的全栈应用。
数据链路：Vue 组件 → api.ts(fetch) → Django API → SQLite 数据库。
原来存 localStorage 的数据（待办/名单/名字/主题/成绩/语录）全部迁移到服务器数据库，换设备也能读到同一份。

## 目录结构

```
fullstack/
├── backend/                     # Django 后端
│   ├── config/                  # 项目配置（settings/总路由）
│   ├── app/                     # 业务应用
│   │   ├── models.py            # 5 张表：Todo/Quote/Countdown/PoolName/Setting
│   │   ├── serializers.py       # DRF 序列化器
│   │   ├── views.py             # ViewSet 视图集（含 random 自定义接口）
│   │   ├── urls.py              # 路由（DefaultRouter）
│   │   └── admin.py             # 后台注册
│   └── manage.py
└── frontend/                    # Vue 3.5 前端
    └── src/
        ├── main.ts              # 入口（注册 v-reveal 指令）
        ├── App.vue              # 根组件：组装全部面板 + 键盘快捷键 + 主题管理
        ├── api.ts               # 全部后端/第三方 API 封装
        ├── store.ts             # 全局设置（替代 localStorage 全家桶）
        ├── bus.ts               # 轻量事件总线（跨组件快捷键）
        ├── audio.ts             # Web Audio 共享发声器（电子琴/游戏用）
        ├── directives/reveal.ts # 滚动显现指令（替代原 reveal.ts）
        ├── style.css            # 复用原版全部样式（变量/布局/按钮/动画）
        └── components/          # 15 个功能面板组件
```

## 后端数据模型（5 张表）

| 表 | 原模块 | 说明 |
|----|--------|------|
| Todo | todo 待办清单 | title + done，增删改查 |
| Quote | quote 摸鱼语录 | text + author，支持随机一条 |
| Countdown | （扩展） | name + target_time 倒计时目标 |
| PoolName | draw 幸运抽签 | 名单，每行一个名字 |
| Setting | greet/theme/guess | 通用键值：myName/green/myTheme/bestScore |

## 前端功能面板（对应原 19 个模块）

| 组件 | 原模块 | 数据来源 |
|------|--------|----------|
| GreetHeader | 头部 + theme + win | Setting 表（名字/主题）+ 本地(窗口宽) |
| GreetPanel | greet 打招呼/改名/换肤 | Setting 表 |
| QuotePanel | quote 语录 | Quote 表（/random/） |
| TodoPanel | todo 待办 | Todo 表 |
| TimerPanel | timer 倒计时 | 纯前端 |
| DrawPanel | draw 抽签 | PoolName 表 |
| DogPanel | dog 随机狗 | dog.ceo（第三方直连） |
| GithubPanel | github 查询 | api.github.com（第三方直连） |
| GuessPanel | guess 猜数字 | Setting 表（bestScore） |
| BoardPanel | board 涂鸦板 | 纯前端(Canvas) |
| TtsPanel | tts 语音 | 浏览器 Web Speech |
| FishPanel | fish 接小鱼 | 纯前端(Canvas+音效) |
| SkillPanel | skill 技能图 | Chart.js（前端） |
| PianoPanel | audio 电子琴 | Web Audio（共享 audio.ts） |
| BackupPanel | backup 数据备份 | 导出/导入全部后端数据 JSON |

> 原 `pwa.ts`（Service Worker）为线上静态站离线能力，开发期由 Vite 提供，暂不移植；原 `reveal.ts`/`shortcut.ts` 分别用指令与全局键盘监听实现。

## 启动步骤

### 1. 启动后端（端口 8001）

```bash
cd fullstack/backend
python manage.py migrate          # 第一次先建表
python manage.py runserver 127.0.0.1:8001
```

造种子数据（语录/名单/默认设置）：
```bash
python manage.py shell -c "from app.models import Quote,PoolName; Quote.objects.create(text='Talk is cheap, show me the code',author='Linus'); PoolName.objects.create(name='张三'); print('ok')"
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
curl http://127.0.0.1:8001/api/todos/              # 待办
curl http://127.0.0.1:8001/api/quotes/random/      # 随机语录
curl http://127.0.0.1:8001/api/pool/random/        # 抽签
curl "http://127.0.0.1:8001/api/settings/get_by_key/?key=myName"  # 设置
```

## 关键配置备忘

- 后端允许的跨域来源在 `backend/config/settings.py` 的 `CORS_ALLOWED_ORIGINS`（前端换端口要同步加）
- 前端后端地址在 `frontend/src/api.ts` 顶部的 `BASE`
- 开发期刻意关闭登录认证（`AllowAny`），**仅限本地学习**；上线前必须补 Token/JWT 认证

## 学习要点

- ORM：models.py 定义表，`makemigrations` + `migrate` 建表，零手写 SQL
- DRF：`ModelViewSet` = 一个类五种接口；`@action` 加自定义接口（随机语录/抽签）
- 全局设置：原 localStorage 的 5 个 key → `Setting` 键值表 + Vue reactive store，一处读写全端同步
- 跨组件通信：快捷键用轻量事件总线（bus.ts）广播，组件各自订阅
