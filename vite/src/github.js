import { $, on } from "./utils.js";

async function searchUser() {
  const name = $("ghName").value.trim();
  if (!name) {
    $("ghResult").innerText = "先输入一个用户名";
    return;
  }
  $("ghResult").innerText = "查询中...";
  try {
    const res = await fetch(`https://api.github.com/users/${name}`);
    if (!res.ok) throw new Error("没找到");
    const data = await res.json();
    $("ghAvatar").src = data.avatar_url;
    $("ghAvatar").classList.remove("hidden");
    $("ghResult").innerText =
      `用户名：${data.login}，公开仓库：${data.public_repos} 个，粉丝：${data.followers} 人`;
  } catch (err) {
    $("ghResult").innerText = "没找到这个用户，检查名字~";
    $("ghAvatar").classList.add("hidden");
  }
}

export function initGithub() {
  on("btnSearchUser", "click", searchUser);
  on("ghName", "keydown", (e) => { if (e.key === "Enter") searchUser(); });
}