# serializers.py —— 序列化器
# 作用：模型对象(数据库行) <-> JSON(网络传输格式) 的"翻译官"。
# 前端发来的 JSON -> 校验 -> 存数据库；数据库数据 -> JSON -> 返回给前端。

from rest_framework import serializers
# ↑ 从 DRF 导入 serializers（里面是各种序列化器基类）

from .models import Quote, Todo, Countdown
# ↑ 从同目录 models.py 导入三张表（. 表示"当前这个 app"）


class QuoteSerializer(serializers.ModelSerializer):
    """
    语录的序列化器
    ModelSerializer 是 DRF 的"偷懒神器"：只要告诉它"管哪张表、暴露哪些字段"，
    它就能自动完成增删改查所需的序列化/反序列化逻辑，不用手写。
    """

    class Meta:
        # ↑ Meta 是内部配置类，专门放"给序列化器的设置"
        model = Quote
        # ↑ 关联哪张表

        fields = ["id", "text", "author", "created_at"]
        # ↑ 要暴露给前端的字段白名单（id 是主键，前端靠它定位要删/改哪条）


class TodoSerializer(serializers.ModelSerializer):
    """
    待办的序列化器
    """

    class Meta:
        model = Todo
        # ↑ 关联待办表

        fields = ["id", "title", "done", "created_at"]
        # ↑ 暴露：主键、标题、完成状态、创建时间


class CountdownSerializer(serializers.ModelSerializer):
    """
    倒计时的序列化器
    """

    class Meta:
        model = Countdown
        # ↑ 关联倒计时表

        fields = ["id", "name", "target_time", "created_at"]
        # ↑ 暴露：主键、事件名、目标时间、创建时间
