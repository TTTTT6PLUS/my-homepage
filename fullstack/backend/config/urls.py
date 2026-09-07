# urls.py —— 整个后端的"总路由表"
# 作用：浏览器/前端请求进来时，先到这查"该交给谁处理"。
# 结构：/admin/ → Django 后台；/api/ → 我们的业务接口（转交给 app/urls.py）。

from django.contrib import admin
# ↑ 导入 Django 自带的后台管理

from django.urls import path, include
# ↑ path：定义一条路由；include：把另一个路由表整体挂载进来

urlpatterns = [
    path("admin/", admin.site.urls),
    # ↑ Django 后台：访问 /admin/ 就能进管理页面（可增删语录/待办等）

    path("api/", include("app.urls")),
    # ↑ ★ 我们的业务接口：所有 /api/ 开头的请求，转交给 app/urls.py 处理
    #   比如 /api/quotes/、/api/todos/、/api/countdowns/ 都会在那找到对应视图
]
