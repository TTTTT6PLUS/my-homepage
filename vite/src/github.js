import { $, on } from "./utils.js";

let loading = false;   // 新增：防连点开关

async function searchUser() {
  if (loading) return;                    // 防连点：正在请求就挡掉

  const name = $("ghName").value.trim();
  if (!name) {                            // 空输入校验（此时还没真正开始请求）
    $("ghResult").innerText = "先输入一个用户名";
    return;
  }

  loading = true;                         // 通过校验，才开始标记"请求中"
  const btn = $("btnSearchUser");
  btn.disabled = true;                    // 加载锁定
  btn.textContent = "查询中...";

  $("ghResult").innerText = "查询中...";

  const controller = new AbortController();            // 新增：超时控制
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`https://api.github.com/users/${name}`, {
      signal: controller.signal,          // 新增：把信号交给 fetch
    });
    if (!res.ok) throw new Error("没找到"); // 404 等情况，主动抛错进 catch
    const data = await res.json();
    $("ghAvatar").src = data.avatar_url;
    $("ghAvatar").classList.remove("hidden");
    $("ghResult").innerText =
      `用户名：${data.login}，公开仓库：${data.public_repos} 个，粉丝：${data.followers} 人`;
  } catch (err) {
    if (err.name === "AbortError") {               // 超时
      $("ghResult").innerText = "网络太慢，稍后再试~";
    } else {                                       // 其他：没找到 / 断网 / 解析错
      $("ghResult").innerText = "没找到这个用户，检查名字~";
      $("ghAvatar").classList.add("hidden");
    }
  } finally {
    clearTimeout(timer);                 // 取消闹钟
    btn.disabled = false;
    btn.textContent = "查询";
    loading = false;
  }
}

export function initGithub() {
  on("btnSearchUser", "click", searchUser);
  on("ghName", "keydown", (e) => { if (e.key === "Enter") searchUser(); });
}