---
id: dynamic-programing
title: 动态规划专题
---

**动态规划问题的一般形式就是求最值。**动态规划其实是运筹学的一种**最优化方法**，只不过在计算机问题上应用比较多，比如说让你求最长递增子序列呀，最小编辑距离呀等等。

动态规划三要素：

1. **重叠子问题**：动态规划的穷举有点特别，因为这类问题存在重叠子问题，如果暴力穷举的话效率会极其低下，所以需要备忘录或者 DP table 来优化穷举过程，避免不必要的计算。
2. **最优子结构**：动态规划问题一定会具备最优子结构，才能通过子问题的最值得到原问题的最值。
3. **状态转译方程**：虽然动态规划的核心思想是穷举求最值，但问题往往千变万化，穷举并不容易，只有列出正确的状态转移方程才能正确地穷举。这也是解决动态规划问题最难的一步。

列状态转移方程的思路：

- 明确状态
- 定义 dp 数组/函数的含义
- 明确选择
- 明确 base case

以[斐波那契数](https://leetcode-cn.com/problems/fibonacci-number/)题目为例，列举动态规划解题讨套路。

1、暴力递归

```js
function fib(N) {
  if (N <= 2) return 1;
  return fib(N - 1) + fib(N - 2);
}
```

暴力递归具有重叠子问题，有大量的重复的计算。

2、带备忘录的递归解法

```js
function fib(N) {
  const memo = new Map();
  return traverse(n, memo);
}
function traverse(n, memo) {
  // base case
  if (n <= 2) return 1;
  // existed
  if (memo.has(n)) return memo.get(n);
  // drill down
  memo.set(n, traverse(n - 1, memo) + traverse(n - 2, memo));
  return memo.get(n);
}
```

带备忘录的递归，把一棵存在巨量冗余的递归树通过剪枝，改造成了一幅不存在冗余的递归图，极大减少了子问题的个数。

3、dp 数组的迭代解法

```js
function fib(N) {
  const dp = [];
  // base case
  dp[1] = dp[2] = 1;
  for (let i = 3; i <= N; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[N];
}
```

与带备忘录自顶向下的递归解法不同，这是一种自底向上的解法。这个解法需要明确 `dp[i]` 的定义，并列出正确的状态转移方程（本题已给出）。

从题解中我们可以看到，每次迭代只用到了前两个值，所以我们可以把它优化到 `O(1)` 的空间复杂度。

```js
function fib(N) {
  if (N <= 2) return 1;
  let prev = 1;
  let last = 1;
  let temp;
  for (let i = 3; i <= N; i++) {
    temp = prev + last;
    prev = last;
    last = temp;
  }
  return last;
}
```

## 力扣常见题目

- [509. 斐波那契数](https://leetcode-cn.com/problems/fibonacci-number/)
- [322. 零钱兑换](https://leetcode-cn.com/problems/coin-change/)
- [53. 最大子序和](https://leetcode-cn.com/problems/maximum-subarray/)

## 常见问题解题思路

### 凑零钱

```js title="322.零钱兑换"
var coinChange = function (coins, amount) {
  const dp = Array(amount + 1).fill(Infinity); // dp[i] 代表兑换i零钱所需最少硬币数
  dp[0] = 0; // base case

  for (let i = 0; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin < 0) continue; // 跳过无效子问题
      dp[i] = Math.min(dp[i], 1 + dp[i - coin]); // 状态转移方程
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
};
```

### 最大子数组和

```js title="53.最大子序和"
var maxSubArray = function (nums) {
  if (nums.length === 0) return 0;
  const dp = []; // dp[i] 代表第i位的最大子序
  dp[0] = nums[0]; // base case

  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]); // 转态转移方程，前面的和如果是负数，就取当前值从新计算
  }
  return Math.max(...dp);
};
```

### 最长公共子序列
