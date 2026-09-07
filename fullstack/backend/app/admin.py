# admin.py —— 后台注册
# 让五张表都能在 Django 后台可视化增删改查。

from django.contrib import admin
# ↑ 后台模块

from .models import Quote, Todo, Countdown, PoolName, Setting
# ↑ 五张表


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ["id", "text", "author", "created_at"]


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "done", "created_at"]


@admin.register(Countdown)
class CountdownAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "target_time", "created_at"]


@admin.register(PoolName)
class PoolNameAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "created_at"]


@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = ["id", "key", "value", "updated_at"]
