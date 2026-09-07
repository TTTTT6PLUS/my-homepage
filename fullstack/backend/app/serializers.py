# serializers.py —— 序列化器
# 作用：模型对象 <-> JSON 的"翻译官"。ModelSerializer 自动完成增删改查的序列化逻辑。

from rest_framework import serializers
# ↑ 从 DRF 导入序列化器基类

from .models import Quote, Todo, Countdown, PoolName, Setting
# ↑ 导入全部五张表


class QuoteSerializer(serializers.ModelSerializer):
    """语录序列化器"""

    class Meta:
        model = Quote
        fields = ["id", "text", "author", "created_at"]


class TodoSerializer(serializers.ModelSerializer):
    """待办序列化器"""

    class Meta:
        model = Todo
        fields = ["id", "title", "done", "created_at"]


class CountdownSerializer(serializers.ModelSerializer):
    """倒计时序列化器"""

    class Meta:
        model = Countdown
        fields = ["id", "name", "target_time", "created_at"]


class PoolNameSerializer(serializers.ModelSerializer):
    """抽签名单序列化器"""

    class Meta:
        model = PoolName
        fields = ["id", "name", "created_at"]


class SettingSerializer(serializers.ModelSerializer):
    """通用键值序列化器"""

    class Meta:
        model = Setting
        fields = ["id", "key", "value", "updated_at"]
