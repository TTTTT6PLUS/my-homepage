// GitHub 用户查询：输入用户名，查它的头像和公开资料；带防抖、防连点、超时

import { $, on, debounce, fetchJSON, onEnter } from "./utils";

let loading = false;
// ↑ 防连点开关

async function searchUser(): Promise<void> {
  // ↑ async 函数：查询核心逻辑
  if (loading) return;
  // ↑ 正在请求就挡掉，防止重复请求

  const name = $<HTMLInputElement>("ghName").value.trim();
  // ↑ 拿到输入的用户名并去空格
  if (!name) {
    // ↑ 空输入校验
    $("ghResult").innerText = "先输入一个用户名";
    return;
  }

  loading = true;
  const btn = $<HTMLButtonElement>("btnSearchUser");
  btn.disabled = true;
  // ↑ 加载锁定：禁用按钮
  btn.textContent = "查询中...";

  $("ghResult").innerText = "查询中...";

  try {
    // 定义"GitHub 用户接口"返回的数据形状（只声明我们用到的那几个字段）
    interface GitHubUser {
      avatar_url: string;
      login: string;
      public_repos: number;
      followers: number;
    }

    const data = await fetchJSON<GitHubUser>(
      `https://api.github.com/users/${name}`,
    );
    // ↑ fetchJSON<GitHubUser>：告诉泛型"按 GitHubUser 的形状来理解返回数据"
    const avatar = $<HTMLImageElement>("ghAvatar");
    avatar.src = data.avatar_url;
    // ↑ 设置头像
    avatar.classList.remove("hidden");
    // ↑ 显示头像
    $("ghResult").innerText =
      `用户名：${data.login}，公开仓库：${data.public_repos} 个，粉丝：${data.followers} 人`;
    // ↑ 模板字符串拼接出简介
  } catch (err) {
    // ↑ 出错时；err 是 unknown，先判断是不是"超时中断"再取属性
    const isTimeout = err instanceof DOMException && err.name === "AbortError";
    if (isTimeout) {
      // ↑ 超时
      $("ghResult").innerText = "网络太慢，稍后再试~";
    } else {
      // ↑ 其它：没找到 / 断网 / 解析失败
      $("ghResult").innerText = "没找到这个用户，检查名字~";
      $<HTMLImageElement>("ghAvatar").classList.add("hidden");
    }
  } finally {
    // ↑ 收尾：恢复按钮和状态
    btn.disabled = false;
    btn.textContent = "查询";
    loading = false;
  }
}

export function initGithub(): void {
  on("btnSearchUser", "click", searchUser);
  // ↑ 点"查询"按钮触发
  onEnter("ghName", searchUser);
  on("ghName", "input", debounce(searchUser, 500));
  // ↑ 核心：输入时用 debounce 包一层，
  //   表示"停止输入 500ms 后"才自动搜一次，避免每敲一个字都发请求
}
