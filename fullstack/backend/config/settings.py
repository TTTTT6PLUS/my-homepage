"""
Django 项目的总配置文件（settings.py）
作用：相当于整个后端的"总开关面板"——装哪些应用、开哪些中间件、连哪个数据库，都在这配。
本文件由本鱼重写为精简中文注释版，方便主人逐行学习。
"""

from pathlib import Path
# ↑ 从 Python 标准库导入 Path（处理文件路径的工具）
#   Django 用它在不同操作系统上都能正确拼接路径

# ===== 路径相关 =====

BASE_DIR = Path(__file__).resolve().parent.parent
# ↑ 项目根目录：settings.py 在 config/ 里，它的父目录的父目录 = 项目根（backend/）
#   后面所有文件路径（数据库、静态文件）都以它为基准

# ===== 安全相关 =====

SECRET_KEY = 'django-insecure-6&-b9kc5%9()ibzknjv)hf!8g%z5-a(0(dni=&w@*0e8=&1u_y'
# ↑ 签名密钥：Django 用它加密 session、密码等（生产环境必须换成保密的随机串）

DEBUG = True
# ↑ 调试模式：True 时出错会显示详细报错页（开发期开，上线必须关）

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
# ↑ 允许访问本站的域名列表（开发期放行本机；上线要加服务器域名）

# ===== 应用注册 =====
# 装哪些"零件"进这个项目

INSTALLED_APPS = [
    'django.contrib.admin',           # Django 自带的后台管理系统
    'django.contrib.auth',            # 用户认证（登录/权限）
    'django.contrib.contenttypes',    # 内容类型框架（auth 的依赖）
    'django.contrib.sessions',        # 会话管理（记住登录状态）
    'django.contrib.messages',        # 一次性消息提示
    'django.contrib.staticfiles',     # 静态文件（CSS/JS/图片）
    'rest_framework',                 # ★ 我们加的：Django REST Framework（写 API 用）
    'corsheaders',                    # ★ 我们加的：跨域支持（允许 Vue 前端来请求）
    'app',                            # ★ 我们加的：业务应用（放待办/语录/倒计时的代码）
]

# ===== 中间件 =====
# 中间件 = 请求进来时按顺序经过的一道道"安检门"

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',   # ★ 我们加的：跨域门（要放在最前面）
    'django.middleware.security.SecurityMiddleware',   # 安全头
    'django.contrib.sessions.middleware.SessionMiddleware',  # 会话
    'django.middleware.common.CommonMiddleware',   # 通用处理
    'django.middleware.csrf.CsrfViewMiddleware',   # CSRF 防护（防跨站伪造请求）
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # 认证
    'django.contrib.messages.middleware.MessageMiddleware',  # 消息
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # 防点击劫持
]

# ===== 路由入口 =====

ROOT_URLCONF = 'config.urls'
# ↑ 告诉 Django："URL 路由的总表在 config/urls.py 里"

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',  # 用 Django 模板引擎
        'DIRS': [],               # 额外模板目录（我们纯 API 后端用不到，留空）
        'APP_DIRS': True,         # 允许去每个 app 自己的 templates/ 找模板
        'OPTIONS': {
            'context_processors': [   # 给模板注入的公共变量
                'django.template.context_processors.request',     # request 对象
                'django.contrib.auth.context_processors.auth',    # 用户信息
                'django.contrib.messages.context_processors.messages',  # 消息
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
# ↑ WSGI 入口：部署到服务器时用它跑 Python

# ===== 数据库配置 =====

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',   # 用 SQLite（单文件数据库，零配置）
        'NAME': BASE_DIR / 'db.sqlite3',          # 数据库文件就放在项目根目录
    }
}

# ===== 密码校验规则 =====
# 用户设密码时 Django 会按这些规则检查强度（我们暂不做注册，先保留默认）

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ===== 国际化 =====

LANGUAGE_CODE = 'zh-hans'
# ↑ ★ 改成中文：Django 后台界面会显示中文

TIME_ZONE = 'Asia/Shanghai'
# ↑ ★ 改成中国时区：时间戳按北京时间存

USE_I18N = True
# ↑ 启用国际化（配合 LANGUAGE_CODE 生效）

USE_TZ = True
# ↑ 数据库里存带时区的时间（推荐开启，前端再转本地时间）

# ===== 静态文件 =====

STATIC_URL = 'static/'
# ↑ 静态文件的 URL 前缀

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# ↑ 每张表默认主键类型：大整数自增（现代推荐）

# ===== ★ 我们加的：Django REST Framework 配置 =====

REST_FRAMEWORK = {
    # 我们故意不用默认的 SessionAuthentication（会强制要 CSRF token，
    # 让纯 API 调用变麻烦），改用宽松的 AllowAny 方便开发期前后端联调
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    # ↑ 空 = 不强制任何登录方式（开发期；上线前应补上 Token/JWT 认证）
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',   # 任何请求都放行（开发期）
    ],
}

# ===== ★ 我们加的：跨域 CORS 配置 =====

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',   # Vue 开发服务器（vue-lab 默认端口）
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5175',   # Vue 开发服务器（fullstack 前端实际端口）
    'http://127.0.0.1:5175',
]
# ↑ 只允许这些"来源"的网页跨域调用本后端，别的一律拒绝（安全）
