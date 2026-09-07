# admin.py —— 后台管理注册
# 作用：把数据模型"登记"进 Django 自带的后台，这样就能在网页上可视化增删改数据，
# 不用手敲 SQL。访问 http://127.0.0.1:8000/admin/ 即可进入。

from django.contrib import admin
# ↑ 导入 Django 后台管理模块

from .models import Quote, Todo, Countdown
# ↑ 导入我们定义的三张表


@admin.register(Quote)
# ↑ 装饰器：把 Quote 表注册进后台
class QuoteAdmin(admin.ModelAdmin):
    list_display = ["id", "text", "author", "created_at"]
    # ↑ 后台列表页要显示的列


@admin.register(Todo)
# ↑ 把 Todo 表注册进后台
class TodoAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "done", "created_at"]
    # ↑ 后台列表页要显示的列


@admin.register(Countdown)
# ↑ 把 Countdown 表注册进后台
class CountdownAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "target_time", "created_at"]
    # ↑ 后台列表页要显示的列
