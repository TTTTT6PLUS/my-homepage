// ===== Service Worker：离线管家 =====
// 它运行在独立线程，能拦截页面发出的网络请求，实现"先缓存、再联网"

const CACHE_NAME = "my-homepage-202609040228";
// ↑ 缓存版本号：每次构建会由 scripts/bump-sw.js 自动改成新时间戳，浏览器才会刷新离线缓存

const PRECACHE = ["./", "./index.html", "./avatar.svg", "./manifest.json"];
// ↑ 要"提前藏好"的核心资源清单（相对路径，部署到子目录也能对上）

// —— install：第一次装上时，把核心资源塞进"仓库" ——
self.addEventListener("install", (event) => {
  // ↑ "安装"阶段：SW 第一次被浏览器下载时触发
  event.waitUntil(
    // ↑ waitUntil 告诉浏览器"先别急着宣布装完"，等里面的活干完再说
    caches.open(CACHE_NAME)
      // ↑ 打开（不存在就新建）一个叫 CACHE_NAME 的缓存仓库
      .then((cache) => cache.addAll(PRECACHE))
      // ↑ 把清单里的资源一次性塞进仓库；任何一个下载失败，整个安装都会失败
  );
  self.skipWaiting();
  // ↑ 新 SW 装好后，不等待旧页面关闭，立刻接管控制权
});

// —— activate：接管后，把旧版本的缓存仓库清掉 ——
self.addEventListener("activate", (event) => {
  // ↑ "激活"阶段：新 SW 接管控制权时触发
  event.waitUntil(
    caches.keys()
      // ↑ 拿到浏览器里所有缓存仓库的名字（可能残留旧的 v1、v2……）
      .then((keys) =>
        Promise.all(
          // ↑ 并行处理每个仓库
          keys
            .filter((key) => key !== CACHE_NAME)
            // ↑ 只留下"名字不等于当前版本"的（即旧版本）
            .map((key) => caches.delete(key))
            // ↑ 逐个删掉旧仓库，避免垃圾越积越多
        )
      )
  );
  self.clients.claim();
  // ↑ 立即接管所有已打开的页面，不用非得刷新一次才生效
});

// —— fetch：拦截每个请求，能离线就从缓存给 ——
self.addEventListener("fetch", (event) => {
  const req = event.request;
  // ↑ 取出这次被拦截的请求对象

  if (req.method !== "GET") return;
  // ↑ 只处理 GET 请求（图片、JS、CSS、HTML 都是 GET；提交表单的 POST 不缓存）

  event.respondWith(
    // ↑ respondWith：用我们准备好的响应去"回答"这次请求
    caches.match(req).then((cached) => {
      // ↑ 先到缓存里找，看有没有现成的
      if (cached) return cached;
      // ↑ 命中缓存，直接返回 —— 断网也能用，这就是离线的关键

      return fetch(req).then((res) => {
        // ↑ 没缓存，才真正联网去请求
        if (res.ok) {
          // ↑ 请求成功（状态码 200~299）
          const clone = res.clone();
          // ↑ 响应只能被读一次，克隆一份存缓存，原样那份返回给页面
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          // ↑ 把新拉到的资源也存进仓库，下次离线就有了（渐进式缓存）
        }
        return res;
        // ↑ 把真正拿到的响应交还给页面
      });
    })
  );
});