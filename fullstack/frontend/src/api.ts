// api.ts —— 前端调用后端 API 的"桥梁"
// 作用：把"请求 Django 后端"的代码集中在这里，组件里只调用这里的函数，
// 不用每个组件都写一遍 fetch。这也是工程化的好习惯：网络层单独隔离。

// 后端地址：Django 跑在本机 8001 端口
const BASE = "http://127.0.0.1:8001/api";
// ↑ 所有请求都拼上这个前缀，比如 /todos/ 会变成 http://127.0.0.1:8001/api/todos/

// ---- 类型定义：和后端 models.py / serializers.py 里的字段一一对应 ----

export interface Todo {
  // ↑ 待办对象（对应后端的 Todo 表）
  id: number; // 主键：后端自动生成
  title: string; // 标题文字
  done: boolean; // 是否完成
  created_at: string; // 创建时间（ISO 字符串）
}

export interface Quote {
  // ↑ 语录对象（对应后端的 Quote 表）
  id: number;
  text: string; // 语录正文
  author: string; // 作者
  created_at: string;
}

export interface Countdown {
  // ↑ 倒计时对象（对应后端的 Countdown 表）
  id: number;
  name: string; // 事件名
  target_time: string; // 目标时间（ISO 字符串）
  created_at: string;
}

// ---- 通用请求函数（内部工具，组件不直接用） ----

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  // ↑ 封装 fetch：自动拼 URL、解析 JSON、统一错误处理
  //   泛型 T：调用方告诉它"这次期望返回什么类型的对象"
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    // ↑ 告诉后端"我发的是 JSON 格式"
    ...options,
    // ↑ 展开调用方额外传入的配置（如 method、body）
  });
  if (!res.ok) {
    // ↑ 如果状态码不是 2xx（成功）
    throw new Error(`请求失败：HTTP ${res.status}`);
    // ↑ 抛出一个带状态码的错误，让组件 catch 后提示用户
  }
  return (await res.json()) as T;
  // ↑ 解析响应 JSON 并断言成泛型 T 的类型
}

// ---- 待办接口 ----

export const todoApi = {
  // ↑ 把待办相关的接口函数打包成一个对象（命名空间，好找）
  list: () => request<Todo[]>("/todos/"),
  // ↑ GET /todos/：获取全部待办

  create: (title: string) =>
    request<Todo>("/todos/", {
      method: "POST", // POST = 新增
      body: JSON.stringify({ title, done: false }), // 把新待办序列化成 JSON
    }),

  toggle: (t: Todo) =>
    request<Todo>(`/todos/${t.id}/`, {
      method: "PATCH", // PATCH = 局部更新（只改 done 字段）
      body: JSON.stringify({ done: !t.done }), // 把完成状态取反后发给后端
    }),

  remove: (id: number) =>
    request<void>(`/todos/${id}/`, { method: "DELETE" }),
  // ↑ DELETE /todos/<id>/：删除指定 id 的待办
};

// ---- 语录接口 ----

export const quoteApi = {
  list: () => request<Quote[]>("/quotes/"),
  // ↑ GET /quotes/：全部语录

  random: () => request<Quote>("/quotes/random/"),
  // ↑ GET /quotes/random/：随机一条（后端 views.py 里自定义的接口）
};

// ---- 倒计时接口 ----

export const countdownApi = {
  list: () => request<Countdown[]>("/countdowns/"),
  // ↑ GET /countdowns/：全部倒计时
};
