// api.ts —— 前端所有网络请求的"总出入口"
// 职责：
//   1) 封装对 Django 后端（8001 端口）的 REST 调用
//   2) 封装对第三方公开 API 的调用（dog.ceo / GitHub，原版就直连，这里保持）
// 组件只调用这里导出的函数，不直接写 fetch —— 网络逻辑集中管理

const BASE = "http://127.0.0.1:8001/api";
// ↑ 后端基址（Django 开发服务器地址）

// ===================== 类型定义（与后端模型一一对应） =====================

export interface Todo {
  id: number;
  title: string;
  done: boolean;
  created_at: string;
}

export interface Quote {
  id: number;
  text: string;
  author: string;
  created_at: string;
}

export interface PoolName {
  id: number;
  name: string;
  created_at: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  updated_at: string;
}

// ===================== 通用请求函数 =====================

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  // ↑ 泛型封装：拼 URL、带 JSON 头、解析响应、统一抛错
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`请求失败：HTTP ${res.status}`);
  return (await res.json()) as T;
}

// ===================== 待办接口（对应原 todo.ts） =====================

export const todoApi = {
  list: () => request<Todo[]>("/todos/"),
  create: (title: string) =>
    request<Todo>("/todos/", {
      method: "POST",
      body: JSON.stringify({ title, done: false }),
    }),
  update: (t: Todo) =>
    request<Todo>(`/todos/${t.id}/`, {
      method: "PATCH",
      body: JSON.stringify(t),
    }),
  remove: (id: number) =>
    request<void>(`/todos/${id}/`, { method: "DELETE" }),
};

// ===================== 语录接口（对应原 quote.ts） =====================

export const quoteApi = {
  list: () => request<Quote[]>("/quotes/"),
  // ↑ GET /quotes/：全部语录（备份导出用）
  random: () => request<Quote>("/quotes/random/"),
  // ↑ GET /quotes/random/：随机一条
};

// ===================== 抽签名单接口（对应原 draw.ts） =====================

export const poolApi = {
  list: () => request<PoolName[]>("/pool/"),
  create: (name: string) =>
    request<PoolName>("/pool/", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  remove: (id: number) => request<void>(`/pool/${id}/`, { method: "DELETE" }),
  random: () => request<PoolName>("/pool/random/"),
};

// ===================== 通用键值设置接口（原 localStorage 全家桶） =====================

export const settingApi = {
  // 读取某个键的值；后端约定：键不存在也返回 200 + value:""
  get: (key: string) =>
    request<Setting>(`/settings/get_by_key/?key=${encodeURIComponent(key)}`),

  // 写入某个键：有则更新，无则新建
  set: async (key: string, value: string): Promise<void> => {
    // 先查这个键是否存在
    const list = await request<Setting[]>("/settings/?key=" + encodeURIComponent(key));
    // ↑ 用 DRF 的 list + 过滤参数查
    if (list.length > 0) {
      // 已存在 → PATCH 更新
      await request<Setting>(`/settings/${list[0].id}/`, {
        method: "PATCH",
        body: JSON.stringify({ key, value }),
      });
    } else {
      // 不存在 → POST 新建
      await request<Setting>("/settings/", {
        method: "POST",
        body: JSON.stringify({ key, value }),
      });
    }
  },
};

// ===================== 第三方公开 API（原版直连，保持） =====================

export async function fetchRandomDog(): Promise<string> {
  // ↑ 从 dog.ceo 抓一张随机狗狗图，返回图片 URL
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = (await res.json()) as { message: string; status: string };
  return data.message;
}

export async function fetchGithubUser(name: string) {
  // ↑ 从 GitHub 公开 API 查用户资料（未登录匿名查询，有速率限制）
  const res = await fetch(`https://api.github.com/users/${name}`);
  if (!res.ok) throw new Error("没找到这个用户");
  const data = (await res.json()) as {
    avatar_url: string;
    login: string;
    public_repos: number;
    followers: number;
  };
  return data;
}
