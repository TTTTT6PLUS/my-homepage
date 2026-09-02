// PWA 注册模块：把 Service Worker 挂到页面上，让主页离线也能打开

export function initPwa() {
  // ↑ 启动函数，供 main.js 调用

  if (!("serviceWorker" in navigator)) {
    // ↑ 先判断浏览器支不支持 Service Worker（老浏览器没这 API）
    return;
    // ↑ 不支持就悄悄走人，页面照常工作，不影响其它功能
  }

  navigator.serviceWorker
    .register("./sw.js")
    // ↑ 注册 sw.js 作为 Service Worker；相对路径，部署到子目录也能对上
    .then((registration) => {
      // ↑ 注册成功，registration 里带有这个 SW 的信息（比如作用范围 scope）
      console.log("Service Worker 注册成功，作用范围：", registration.scope);
      // ↑ 打印成功日志，方便在控制台确认
    })
    .catch((err) => {
      // ↑ 注册失败（例如路径写错、不是 HTTPS/localhost）
      console.error("Service Worker 注册失败：", err);
      // ↑ 打印错误信息，方便排查
    });
}