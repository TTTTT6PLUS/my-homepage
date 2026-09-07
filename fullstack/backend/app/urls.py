# urls.py —— app 的路由表
# DefaultRouter 自动为每个 ViewSet 生成一组 RESTful 接口。

from django.urls import path, include
# ↑ path：单条路由；include：挂载子路由表

from rest_framework.routers import DefaultRouter
# ↑ 自动路由器

from . import views
# ↑ 当前 app 的视图

router = DefaultRouter()
# ↑ 实例化路由器

router.register("quotes", views.QuoteViewSet, basename="quote")
router.register("todos", views.TodoViewSet, basename="todo")
router.register("countdowns", views.CountdownViewSet, basename="countdown")
router.register("pool", views.PoolNameViewSet, basename="pool")
router.register("settings", views.SettingViewSet, basename="setting")
# ↑ 五个视图集全部注册：quotes/todos/countdowns/pool/settings

urlpatterns = [
    path("", include(router.urls)),
    # ↑ 全部挂到 /api/ 前缀下（前缀在 config/urls.py 里加）
]
