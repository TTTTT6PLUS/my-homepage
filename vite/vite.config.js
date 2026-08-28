import { defineConfig } from "vite";

// base 用相对路径 "./"，这样打包后的 dist 放到任意子目录都能正常打开，
// 以后部署到 GitHub Pages 的 /my-homepage/vite/ 就靠它。
export default defineConfig({
  base: "./",
});