// eslint.config.js —— ESLint 的配置文件（新版"扁平配置"格式）
// 角色比喻：这里是"检查官"的《执法手册》，规定：查哪些地方、按什么标准查

import js from "@eslint/js";
// ↑ 引入 ESLint 官方推荐规则包（一堆开箱即用的"基本执法标准"）

import tseslint from "typescript-eslint";
// ↑ 引入 typescript-eslint：让 ESLint 能"看懂" TypeScript 语法的翻译官 + TS 专用规则

import eslintConfigPrettier from "eslint-config-prettier";
// ↑ 引入"调解员"：把 ESLint 里跟排版(格式)有关的规则全部关掉，
//   因为排版的事交给 Prettier 管，两边不抢活、不打架

export default tseslint.config(
  // ↑ 用 tseslint 的辅助函数组装配置（它会把下面的片段合并成一套标准结构）

  {
    ignores: ["dist", "node_modules"],
    // ↑ 这些目录不在执法范围内（构建产物和第三方依赖不用检查）
  },

  {
    // 针对"特殊环境"文件的单独规则：
    // Service Worker 跑在浏览器后台线程，语言环境是 Web Worker，
    // 所以有 self / caches / fetch，但没有 window / document
    files: ["public/sw.js"],
    languageOptions: {
      globals: {
        self: "readonly",
        caches: "readonly",
        fetch: "readonly",
        // ↑ 把这些 SW 专用全局变量声明为"只读"，检查官就不会误报未定义了
      },
    },
  },

  {
    // 构建脚本跑在 Node.js 里，有 console / process，没有浏览器对象
    files: ["scripts/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },

  js.configs.recommended,
  // ↑ 启用 ESLint 官方推荐规则（变量未用、重复声明、可疑代码等基础检查）

  ...tseslint.configs.recommended,
  // ↑ 启用 TS 版推荐规则（额外检查类型相关写法，如 any 滥用等）

  eslintConfigPrettier,
  // ↑ 最后"关掉格式类规则"：保证 ESLint 只管代码质量、不管长得丑不丑
  //   （长得丑归 Prettier 管，第 4 步再请它出场）
);
