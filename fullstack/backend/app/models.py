# models.py —— 数据模型层
# 作用：用 Python 类定义数据库表。每个类 = 一张表 = 主页上的一个数据模块。
# 本文件覆盖原个人主页所有"需要持久化"的数据（以前存 localStorage，现在入 SQLite）。

from django.db import models
# ↑ 从 Django 导入 models（提供各种字段类型）

# ---- 语录（原 quote 模块的数据）----


class Quote(models.Model):
    """语录表：随机摸鱼语录的数据来源。"""

    text = models.CharField(max_length=300)
    # ↑ 语录正文

    author = models.CharField(max_length=50, default="佚名")
    # ↑ 作者，默认佚名

    created_at = models.DateTimeField(auto_now_add=True)
    # ↑ 创建时间（自动记录）

    def __str__(self) -> str:
        # ↑ 后台显示代表文字
        return self.text[:20]


# ---- 待办（原 todo 模块的数据）----


class Todo(models.Model):
    """待办表：存任务文字和完成状态。"""

    title = models.CharField(max_length=200)
    # ↑ 任务描述

    done = models.BooleanField(default=False)
    # ↑ 是否完成

    created_at = models.DateTimeField(auto_now_add=True)
    # ↑ 创建时间

    def __str__(self) -> str:
        return self.title[:20]


# ---- 倒计时（原 timer 的"预定目标"，可选功能）----


class Countdown(models.Model):
    """倒计时表：存"事件名 + 目标时间"。"""

    name = models.CharField(max_length=100)
    # ↑ 事件名（如"考研倒计时"）

    target_time = models.DateTimeField()
    # ↑ 目标时刻

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name


# ---- 幸运抽签名单（原 draw 模块的 pool 数组）----
# 以前 pool 是 localStorage 里一个字符串数组；
# 现在每加一个名字 = 数据库里新增一行，更规范、可独立增删。


class PoolName(models.Model):
    """抽签名单表：一行一个名字。"""

    name = models.CharField(max_length=50)
    # ↑ 名字

    created_at = models.DateTimeField(auto_now_add=True)
    # ↑ 加入时间（抽签可"后进先出"，或按加入顺序展示）

    class Meta:
        ordering = ["id"]
        # ↑ 默认按加入先后排序（id 递增）

    def __str__(self) -> str:
        return self.name


# ---- 通用键值表（原 greet/theme/guess 的散装 localStorage）----
# 原主页用散装 key 存：myName(名字)、green(绿肤开关)、myTheme(深色主题)、bestScore(最佳成绩)。
# 全栈版统一放进一张"键值表"：key 是名字，value 是 JSON 字符串。一套接口管全部。


class Setting(models.Model):
    """通用键值设置表：存简单的"单值设置"。"""

    key = models.CharField(max_length=50, unique=True)
    # ↑ 键名，如 "myName"；unique=True 保证不重复（一个键只有一行）

    value = models.TextField(default="")
    # ↑ 值，存 JSON 字符串（数字/布尔/字符串都能 JSON 序列化后存进来）

    updated_at = models.DateTimeField(auto_now=True)
    # ↑ 更新时间（每次修改自动刷新）

    def __str__(self) -> str:
        return f"{self.key}={self.value[:20]}"
