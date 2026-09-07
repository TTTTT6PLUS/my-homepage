# models.py —— 数据模型层
# 作用：用 Python 类"画"出数据库表长什么样。
# Django 会根据这里的类，自动帮我们建表（这就是 ORM：用代码代替手写 SQL）。

from django.db import models
# ↑ 从 Django 导入 models 模块（里面全是"字段类型"和"表行为"的现成工具）

# 下面三个类，每个类 = 一张数据库表 = 主页上的一个功能模块


class Quote(models.Model):
    """
    语录表（对应主页的"随机摸鱼语录"模块）
    以前语录是写死在 JS 数组里的；现在改成存数据库，以后可以在后台随时增删。
    """

    text = models.CharField(max_length=300)
    # ↑ 语录正文：CharField = 短文本字段，最长 300 字

    author = models.CharField(max_length=50, default="佚名")
    # ↑ 作者：短文本，最多 50 字；没填时默认"佚名"

    created_at = models.DateTimeField(auto_now_add=True)
    # ↑ 创建时间：auto_now_add 表示"新增时自动记录当前时间，之后不再变"

    def __str__(self) -> str:
        # ↑ 魔法方法：打印/后台显示这条记录时，用什么文字代表它
        return self.text[:20]
        # ↑ 取语录前 20 个字作为代表（太长会刷屏）


class Todo(models.Model):
    """
    待办表（对应主页的"待办清单"模块）
    以前任务存在浏览器 localStorage，换设备就没了；
    现在存数据库，任何设备访问都能读到同一份。
    """

    title = models.CharField(max_length=200)
    # ↑ 待办事项的文字描述

    done = models.BooleanField(default=False)
    # ↑ 是否已完成：布尔字段，默认 False（未完成）

    created_at = models.DateTimeField(auto_now_add=True)
    # ↑ 创建时间：自动记录

    def __str__(self) -> str:
        # ↑ 后台显示代表文字
        return self.title[:20]
        # ↑ 取标题前 20 字


class Countdown(models.Model):
    """
    倒计时表（对应主页的"倒计时器"模块）
    存一个"目标事件名 + 目标时间"，前端读取后自行计算还剩多少秒。
    """

    name = models.CharField(max_length=100)
    # ↑ 倒计时事件的名字，比如"考研倒计时"

    target_time = models.DateTimeField()
    # ↑ 目标时间：到哪个时刻为止（存带时区的时间）

    created_at = models.DateTimeField(auto_now_add=True)
    # ↑ 创建时间

    def __str__(self) -> str:
        # ↑ 后台显示代表文字
        return self.name
        # ↑ 直接显示事件名
