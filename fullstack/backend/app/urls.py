# urls.py —— app 的"路由表"
# 作用：把"网址"和"视图函数"一一对应起来，就像前台的门牌号指引。
# 用 DRF 的 Router 后，一个 ViewSet 会自动生成一组 RESTful 接口，不用一个个手写。

from django.urls import path, include
# ↑ path：定义单条路由；include：把别的路由表整个挂进来（本项目这行暂用不到，先留）

from rest_framework.routers import DefaultRouter
# ↑ DefaultRouter：DRF 的"自动路由器"——你给它注册视图集，它自动生成标准接口
#   还会额外送一个 /api/ 根页面，方便在浏览器里点着测试

from . import views
# ↑ 导入当前 app 的视图（. 表示"当前目录"，即 app/views.py）

router = DefaultRouter()
# ↑ 创建一个路由器实例

router.register("quotes", views.QuoteViewSet, basename="quote")
# ↑ 注册语录视图集：所有 /quotes/ 开头的请求都交给 QuoteViewSet 处理
#   basename：给这一组接口起个"类名后缀"，DRF 内部命名用

router.register("todos", views.TodoViewSet, basename="todo")
# ↑ 注册待办视图集 → /todos/ 开头的请求

router.register("countdowns", views.CountdownViewSet, basename="countdown")
# ↑ 注册倒计时视图集 → /countdowns/ 开头的请求

urlpatterns = [
    path("", include(router.urls)),
    # ↑ 把所有由 router 生成的接口，挂到 app 的根路径下
    #   最终完整路径 = config/urls.py 里加的前缀(/api/) + 这里的内容
]
