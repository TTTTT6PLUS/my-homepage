// 构建前自动更新 Service Worker 的缓存版本号
// 每次重新构建都会生成一个新版本，浏览器才会强制刷新离线缓存

import { readFileSync, writeFileSync } from "node:fs";
// ↑ 引入 Node 内置的文件读写函数（同步版，读/写都是一步到位）
import { fileURLToPath } from "node:url";
// ↑ 用来把 import.meta.url 这种"文件地址"转成"真实磁盘路径"
import path from "node:path";
// ↑ 引入 path 模块，用来拼接路径

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// ↑ 算出当前脚本所在的目录（scripts 目录）

const swPath = path.join(__dirname, "..", "public", "sw.js");
// ↑ 往上跳一级，定位到 public/sw.js

const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);
// ↑ 造时间戳：把 "2026-09-02T10:30:00.000Z" 变成 "202609021030"（年月日 + 时分）

const version = `my-homepage-${stamp}`;
// ↑ 拼出新的缓存版本号，例如 my-homepage-202609021030

const code = readFileSync(swPath, "utf8");
// ↑ 读出 sw.js 的完整内容（utf8 编码）

const newCode = code.replace(
  /const CACHE_NAME = "[^"]*";/,
  `const CACHE_NAME = "${version}";`,
);
// ↑ 用正则找出原来那句 CACHE_NAME 定义，整句替换成新版本号

writeFileSync(swPath, newCode);
// ↑ 把改好的内容写回 sw.js

console.log(`✅ CACHE_NAME 已更新为：${version}`);
// ↑ 打印一句提示，构建日志里能看到，方便确认
