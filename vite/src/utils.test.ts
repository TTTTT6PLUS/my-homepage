// utils.test.ts —— utils.ts 的单元测试
// 什么叫"单元测试"？把函数当"零件"单独验收：喂它输入，检查输出是否符合预期。
// 以后改代码再也不怕"改坏老功能"——跑一遍测试就知道！

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
// ↑ 从 vitest 引入测试三件套：
//   describe(描述, 函数)  —— 把相关测试分到一组
//   it(描述, 函数)        —— 一个具体的测试用例
//   expect(实际值).xxx    —— 断言：检查实际值是否满足条件
//   vi                   —— Vitest 工具集（这里用来造假计时器/假存储）

import { debounce, throttle, loadJSON, saveJSON } from "./utils";
// ↑ 被测对象：从 utils.ts 里引入要验收的函数

// ===== 测试前的"舞台布置" =====

// 用一个内存版 Map 冒充 localStorage（Node 测试环境里没有浏览器的小仓库）
const fakeStore = new Map<string, string>();

beforeEach(() => {
  // ↑ 每个测试开始前自动执行：重置假存储 + 启动假计时器
  fakeStore.clear();
  vi.useFakeTimers();
  // ↑ 假计时器：把 setTimeout 等"偷换成"可以手动拨动的时钟
  //   这样测试不用真等 500ms，直接 vi.advanceTimersByTime(500) 快进
  vi.stubGlobal("localStorage", {
    // ↑ 把全局的 localStorage 替换成假的（读写都走 fakeStore）
    getItem: (key: string) => fakeStore.get(key) ?? null,
    setItem: (key: string, value: string) => {
      fakeStore.set(key, value);
    },
    removeItem: (key: string) => {
      fakeStore.delete(key);
    },
  });
});

afterEach(() => {
  // ↑ 每个测试结束后自动执行：恢复真实计时器和真实 localStorage
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

// ===== 防抖 debounce 的测试组 =====

describe("debounce 防抖", () => {
  // ↑ describe 把"防抖"相关的测试打包成一组，测试报告里更好读

  it("连续触发时，只在停止后的 delay 毫秒执行一次", () => {
    // ↑ 这是防抖的核心行为：疯狂点按钮，只该"响"最后一次
    const fn = vi.fn();
    // ↑ vi.fn() 造一个"间谍函数"：能记录它被调用了几次、传了什么参数

    const debounced = debounce(fn, 300);
    // ↑ 把间谍函数包上 300ms 的防抖

    debounced();
    debounced();
    debounced("最后一次");
    // ↑ 一口气连续调用 3 次（模拟快速连点）

    expect(fn).not.toHaveBeenCalled();
    // ↑ 300ms 还没过，一次都不该执行

    vi.advanceTimersByTime(299);
    // ↑ 假时钟快进 299ms（还差 1ms 到点）
    expect(fn).not.toHaveBeenCalled();
    // ↑ 依然不该执行

    vi.advanceTimersByTime(1);
    // ↑ 快进最后 1ms，凑满 300ms
    expect(fn).toHaveBeenCalledTimes(1);
    // ↑ 只执行了一次
    expect(fn).toHaveBeenLastCalledWith("最后一次");
    // ↑ 而且执行的是"最后一次"传入的参数（前面的都被吞掉了）
  });

  it("每次触发都会重新计时（不是固定间隔）", () => {
    // ↑ 防抖 vs 节流的本质区别：防抖的倒计时会被"重置"
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced(); // 第 1 次触发，计时 300ms
    vi.advanceTimersByTime(200); // 过了 200ms...
    debounced(); // 第 2 次触发 → 倒计时被重置回 300ms
    vi.advanceTimersByTime(200); // 又过 200ms（距第 1 次已 400ms）
    expect(fn).not.toHaveBeenCalled();
    // ↑ 但距"第 2 次触发"才 200ms，所以还是不执行

    vi.advanceTimersByTime(100); // 凑满第 2 次触发后的 300ms
    expect(fn).toHaveBeenCalledTimes(1);
    // ↑ 现在才真正执行
  });
});

// ===== 节流 throttle 的测试组 =====

describe("throttle 节流", () => {
  it("第一次立即执行，间隔内再触发被忽略", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 1000);
    // ↑ 包上 1000ms 的节流

    throttled(); // 第一次触发
    expect(fn).toHaveBeenCalledTimes(1);
    // ↑ 节流不拦第一次：立即执行

    throttled(); // 刚执行完又触发
    throttled(); // 还在 1 秒内，继续触发
    expect(fn).toHaveBeenCalledTimes(1);
    // ↑ 都被拦下：间隔内最多执行一次
  });

  it("过了间隔后，下一次触发能再次执行", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 1000);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(999);
    throttled(); // 还差 1ms 满 1 秒 → 被拦
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1); // 凑满 1 秒
    throttled(); // 此时触发 → 放行
    expect(fn).toHaveBeenCalledTimes(2);
    // ↑ 现在累计执行 2 次
  });
});

// ===== 存储 loadJSON / saveJSON 的测试组 =====

describe("loadJSON / saveJSON 存取", () => {
  it("saveJSON 存进去的数字，loadJSON 能原样读出来", () => {
    saveJSON("bestScore", 42);
    // ↑ 存一个数字 42（内部会 JSON.stringify 成字符串 "42"）

    expect(loadJSON<number>("bestScore", 0)).toBe(42);
    // ↑ 读回来应该是数字 42，而不是字符串 "42"（JSON 解析的功劳）
  });

  it("键不存在时返回兜底值（不传兜底则返回 null）", () => {
    expect(loadJSON<string[]>("noSuchKey", [])).toEqual([]);
    // ↑ 没存过的键 + 给了兜底 [] → 返回 []

    expect(loadJSON("noSuchKey")).toBeNull();
    // ↑ 没存过的键 + 没给兜底 → 返回 null
  });

  it("能正确存取对象数组（待办列表场景）", () => {
    const tasks = [
      { text: "写测试", done: false },
      { text: "吃白饭", done: true },
    ];
    saveJSON("tasks", tasks);

    expect(loadJSON<{ text: string; done: boolean }[]>("tasks", [])).toEqual(
      tasks
    );
    // ↑ 对象数组经过 JSON 序列化/反序列化后，内容应完全一致
  });
});
