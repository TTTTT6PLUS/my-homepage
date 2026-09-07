# views.py —— 视图层（API 的"前台接待员"）
# 作用：接收前端的 HTTP 请求（GET/POST/PUT/DELETE），调用模型读写数据库，返回 JSON。
# DRF 的 ViewSet 帮我们把"增删改查"的样板代码都写好了，我们只声明路由怎么配。

import random
# ↑ 导入 Python 自带的随机模块（用于随机语录）

from rest_framework import viewsets, status
# ↑ viewsets：视图集（一套现成的增删改查逻辑）
#   status：HTTP 状态码常量（如 200 成功、201 创建成功、404 找不到）

from rest_framework.decorators import action
# ↑ action：装饰器，用来给视图集"加自定义接口"（比如下面的随机语录）

from rest_framework.response import Response
# ↑ Response：DRF 的响应对象（自动把数据变成 JSON 返回）

from .models import Quote, Todo, Countdown
# ↑ 导入三张表

from .serializers import QuoteSerializer, TodoSerializer, CountdownSerializer
# ↑ 导入三个序列化器


class QuoteViewSet(viewsets.ModelViewSet):
    """
    语录的"视图集"：自动获得 list(列表)/create(新增)/retrieve(详情)/
    update(修改)/destroy(删除) 五种标准接口。
    ModelViewSet = 模型 + 视图集：它自己知道去哪张表取数据。
    """

    queryset = Quote.objects.all()
    # ↑ 数据来源：取出语录表里的所有记录

    serializer_class = QuoteSerializer
    # ↑ 用哪个序列化器来翻译数据

    @action(detail=False, methods=["get"])
    # ↑ 自定义接口：detail=False 表示它不针对某一条(id)，而是作用于整个集合
    #   methods=["get"] 表示用 GET 方法访问
    def random(self, request):
        # ↑ 接口名叫 random，所以 URL 会是 /api/quotes/random/
        quotes = list(Quote.objects.all())
        # ↑ 把语录表所有记录转成 Python 列表（因为 ORM 查询集不支持 random 下标）
        if not quotes:
            # ↑ 如果这张表是空的
            return Response(
                {"detail": "还没有语录，先去后台加一条吧~"},
                status=status.HTTP_404_NOT_FOUND,
            )
            # ↑ 返回 404 + 一句友好的中文提示
        quote = random.choice(quotes)
        # ↑ 从列表里随机挑一条
        return Response(QuoteSerializer(quote).data)
        # ↑ 把选中那条序列化成 JSON 返回


class TodoViewSet(viewsets.ModelViewSet):
    """
    待办的视图集：标准五接口（列表/新增/详情/改/删）
    """

    queryset = Todo.objects.all()
    # ↑ 数据来源：待办表全部记录

    serializer_class = TodoSerializer
    # ↑ 用待办序列化器


class CountdownViewSet(viewsets.ModelViewSet):
    """
    倒计时的视图集：标准五接口
    """

    queryset = Countdown.objects.all()
    # ↑ 数据来源：倒计时表全部记录

    serializer_class = CountdownSerializer
    # ↑ 用倒计时序列化器
