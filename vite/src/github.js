// GitHub 用户查询：输入用户名，查它的头像和公开资料；带防抖、防连点、超时

import { $, on, debounce } from "./utils.js";
// ↑ 引入三个工具，其中 debounce 用来做"输入停顿后自动搜索"

let loading = false;
// ↑ 防连点开关

async function searchUser() {
  // ↑ async 函数：查询核心逻辑
  if (loading) return;
  // ↑ 正在请求就挡掉，防止重复请求

  const name = $("ghName").value.trim();
  // ↑ 拿到输入的用户名并去空格
  if (!name) {
    // ↑ 空输入校验
    $("ghResult").innerText = "先输入一个用户名";
    return;
  }

  loading = true;
  const btn = $("btnSearchUser");
  btn.disabled = true;
  // ↑ 加载锁定：禁用按钮
  btn.textContent = "查询中...";

  $("ghResult").innerText = "查询中...";

  const controller = new AbortController();
  // ↑ 中断器
  const timer = setTimeout(() => controller.abort(), 5000);
  // ↑ 5 秒超时自动中断

  try {
    const res = await fetch(`https://api.github.com/users/${name}`, {
      signal: controller.signal,
      // ↑ 把用户名拼进 URL 请求这个用户的信息；signal 用于支持超时中断
    });
    if (!res.ok) throw new Error("没找到");
    // ↑ 如果响应不 ok（如 404 用户不存在），主动抛错进 catch
    const data = await res.json();
    // ↑ 解析成对象
    $("ghAvatar").src = data.avatar_url;
    // ↑ 设置头像
    $("ghAvatar").classList.remove("hidden");
    // ↑ 显示头像
    $("ghResult").innerText =
      `用户名：${data.login}，公开仓库：${data.public_repos} 个，粉丝：${data.followers} 人`;
    // ↑ 模板字符串拼接出简介
  } catch (err) {
    // ↑ 出错时
    if (err.name === "AbortError") {
      // ↑ 超时
      $("ghResult").innerText = "网络太慢，稍后再试~";
    } else {
      // ↑ 其它：没找到 / 断网 / 解析失败
      $("ghResult").innerText = "没找到这个用户，检查名字~";
      $("ghAvatar").classList.add("hidden");
    }
  } finally {
    // ↑ 收尾：恢复按钮和状态
    clearTimeout(timer);
    btn.disabled = false;
    btn.textContent = "查询";
    loading = false;
  }
}

export function initGithub() {
  on("btnSearchUser", "click", searchUser);
  // ↑ 点"查询"按钮触发
  on("ghName", "keydown", (e) => { if (e.key === "Enter") searchUser(); });
  // ↑ 在输入框按回车也触发
  on("ghName", "input", debounce(searchUser, 500));
  // ↑ 核心：输入时用 debounce 包一层，
  //   表示"停止输入 500ms 后"才自动搜一次，避免每敲一个字都发请求
}