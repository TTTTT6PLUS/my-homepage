// 数据备份：把 localStorage 的数据导出成 JSON 文件，也能从文件恢复回去

import { $, on, loadJSON, saveJSON, notify } from "./utils";
// ↑ 引入工具：$（找元素）、on（绑事件）、loadJSON（读）、saveJSON（写）、notify（弹通知）

const KEYS: string[] = ["tasks", "pool", "myName", "green", "bestScore", "myTheme"];
// ↑ 要备份的数据 key 清单（待办、名单、名字、肤色、最佳成绩、主题）

function exportData(): void {
  const data: Record<string, unknown> = {};
  // ↑ 准备一个空对象，用来装所有要备份的数据

  KEYS.forEach((key) => {
    data[key] = loadJSON(key, null);
    // ↑ 逐个从 localStorage 读出，塞进 data 对象
  });

  const json = JSON.stringify(data, null, 2);
  // ↑ 把对象转成字符串；null 是"替换函数"占位，2 表示缩进 2 格更好看

  const blob = new Blob([json], { type: "application/json" });
  // ↑ 把字符串包成一个 Blob（二进制文件对象），声明它是 JSON 类型

  const url = URL.createObjectURL(blob);
  // ↑ 给这个 Blob 生成一个临时内存地址，浏览器通过它就能下载

  const a = document.createElement("a");
  // ↑ 临时造一个 <a> 标签
  a.href = url;
  a.download = "my-homepage-backup.json";
  // ↑ download 属性：点击时不跳转，而是下载，并指定文件名
  a.click();
  // ↑ 模拟点击，触发下载

  URL.revokeObjectURL(url);
  // ↑ 用完释放临时地址，避免内存被占着

  notify("导出成功", "数据已打包成 JSON 文件下载~");
}

function importData(): void {
  $<HTMLInputElement>("fileInput").click();
  // ↑ 点"导入数据"按钮时，其实是偷偷去点那个隐藏的文件输入框，弹出选择文件窗口
}

function restoreData(file: File): void {
  // ↑ 真正干活的：把选中的文件读出来、解析、写回 localStorage
  const reader = new FileReader();
  // ↑ 造一个"文件读取器"，专门用来读本地文件内容

  reader.onload = () => {
    // ↑ 文件读完以后，会执行这个回调（reader.result 里就是文件文本）
    try {
      const data = JSON.parse(reader.result as string);
      // ↑ 把文件里的 JSON 文本还原成对象；写不对会抛错，被下面 catch 接住

      KEYS.forEach((key) => {
        if (data[key] != null) {
          saveJSON(key, data[key]);
          // ↑ 只有文件里真的带了这项数据（不是 null/undefined）才写，避免把好东西覆盖成空
        }
      });

      notify("导入成功", "数据已恢复，马上刷新页面~");
      // ↑ 通知用户搞定了
      setTimeout(() => location.reload(), 800);
      // ↑ 稍等半秒让通知显示出来，再刷新页面，让所有模块重新读新数据
    } catch {
      notify("导入失败", "文件内容不是合法的 JSON，请重新选择~");
      // ↑ 解析失败：语法不对或不是备份文件，友好提示
    }
  };

  reader.readAsText(file);
  // ↑ 以"文本"方式读这个文件，读完后自动触发上面的 onload
}

export function initBackup(): void {
  on("btnExportData", "click", exportData);
  // ↑ 点"导出数据"按钮 → 下载 JSON 文件
  on("btnImportData", "click", importData);
  // ↑ 点"导入数据"按钮 → 打开文件选择框
  on("fileInput", "change", (e: Event) => {
    // ↑ 文件输入框"选中了文件"时触发
    const input = e.target as HTMLInputElement;
    // ↑ e.target 就是这个隐藏的 file input
    const file = input.files![0];
    // ↑ 拿到用户选中的第一个文件（files 是数组，选一个就是files[0]）
    if (file) restoreData(file);
    // ↑ 确实选了文件才去恢复
    input.value = "";
    // ↑ 清空输入框的值，下次还能再选同一个文件（否则选相同文件不触发 change）
  });
}
