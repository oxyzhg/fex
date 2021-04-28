---
id: backtrack
title: 回溯算法专题
---

解决一个回溯问题，实际上就是一个决策树的遍历过程。你只需要思考 3 个问题：

1. **路径**：也就是已经做出的选择。
2. **选择列表**：也就是你当前可以做的选择。
3. **结束条件**：也就是到达决策树底层，无法再做选择的条件。

回溯算法模板：

```js
/**
 * @param {any[]} selected 路径
 * @param {any[]} options 选择列表
 */
function backtrack(selected, options) {
  if (/* 满足条件 */) {
    result.push(selected);
    return;
  }
  for (let item in options) {
    // 做选择
    backtrack(selected, options);
    // 撤销选择
  }
}
```

典型例题：

- [46.全排列](https://leetcode-cn.com/problems/permutations/)
- [51.N 皇后](https://leetcode-cn.com/problems/n-queens/)
