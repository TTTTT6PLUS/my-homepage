# views.py —— 视图层（API 前台）
# ModelViewSet 自动提供 list/create/retrieve/update/destroy 五种接口。

import random
# ↑ 随机模块（语录随机用）

from rest_framework import viewsets, status
# ↑ 视图集 + 状态码

from rest_framework.decorators import action
# ↑ 自定义接口装饰器

from rest_framework.response import Response
# ↑ DRF 响应对象

from .models import Quote, Todo, Countdown, PoolName, Setting
# ↑ 五张表

from .serializers import (
    QuoteSerializer,
    TodoSerializer,
    CountdownSerializer,
    PoolNameSerializer,
    SettingSerializer,
)
# ↑ 五个序列化器


class QuoteViewSet(viewsets.ModelViewSet):
    """语录接口"""

    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

    @action(detail=False, methods=["get"])
    def random(self, request):
        """自定义接口：随机一条语录"""
        quotes = list(Quote.objects.all())
        if not quotes:
            return Response(
                {"detail": "还没有语录，先去后台加一条吧~"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(QuoteSerializer(random.choice(quotes)).data)


class TodoViewSet(viewsets.ModelViewSet):
    """待办接口"""

    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


class CountdownViewSet(viewsets.ModelViewSet):
    """倒计时接口"""

    queryset = Countdown.objects.all()
    serializer_class = CountdownSerializer


class PoolNameViewSet(viewsets.ModelViewSet):
    """抽签名单接口：增删查都由 DRF 自动处理"""

    queryset = PoolName.objects.all()
    serializer_class = PoolNameSerializer

    @action(detail=False, methods=["get"])
    def random(self, request):
        """自定义接口：从名单里随机抽一个人"""
        names = list(PoolName.objects.all())
        if not names:
            return Response(
                {"detail": "名单还是空的，先加几个名字吧~"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(PoolNameSerializer(random.choice(names)).data)


class SettingViewSet(viewsets.ModelViewSet):
    """
    通用键值接口（myName/green/myTheme/bestScore 全走这里）
    提供 get_or_create 风格的便捷方法：按 key 读取，不存在时返回默认值。
    """

    queryset = Setting.objects.all()
    serializer_class = SettingSerializer

    @action(detail=False, methods=["get"])
    def get_by_key(self, request):
        """GET /settings/get_by_key/?key=xxx → 返回该 key 的 value（无则空串）"""
        key = request.query_params.get("key", "")
        # ↑ 从网址参数里取 key
        obj = Setting.objects.filter(key=key).first()
        # ↑ 查这个键（first()：有就返回第一条，没有返回 None）
        if not obj:
            return Response({"key": key, "value": ""})
            # ↑ 没找到也返回 200 + 空值，方便前端统一处理
        return Response(SettingSerializer(obj).data)
