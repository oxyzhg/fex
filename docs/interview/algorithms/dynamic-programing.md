---
id: dynamic-programing
title: 动态规划专题
---

**动态规划问题的一般形式就是求最值。**动态规划其实是运筹学的一种**最优化方法**，只不过在计算机问题上应用比较多，比如说让你求最长递增子序列呀，最小编辑距离呀等等。

动态规划三要素：

1. **重叠子问题**：动态规划的穷举有点特别，因为这类问题存在重叠子问题，如果暴力穷举的话效率会极其低下，所以需要备忘录或者 DP table 来优化穷举过程，避免不必要的计算。
2. **最优子结构**：动态规划问题一定会具备最优子结构，才能通过子问题的最值得到原问题的最值。
3. **状态转移方程**：虽然动态规划的核心思想是穷举求最值，但问题往往千变万化，穷举并不容易，只有列出正确的状态转移方程才能正确地穷举。这也是解决动态规划问题最难的一步。

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
  return traverse(N, memo);
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

- [509.斐波那契数](https://leetcode-cn.com/problems/fibonacci-number/)
- [322.零钱兑换](https://leetcode-cn.com/problems/coin-change/)
- [53.最大子序和](https://leetcode-cn.com/problems/maximum-subarray/)
- [718.最长重复子数组](https://leetcode-cn.com/problems/maximum-length-of-repeated-subarray/)
- [1143.最长公共子序列](https://leetcode-cn.com/problems/longest-common-subsequence/description/)
- [5.最长回文子串](https://leetcode-cn.com/problems/longest-palindromic-substring/description/)

## 常见问题解题思路

### 凑零钱

```js title="322.零钱兑换"
var coinChange = function (coins, amount) {
  // dp[i] 表示兑换i零钱所需最少硬币数
  const dp = Array(amount + 1).fill(Infinity);
  // base case
  dp[0] = 0;

  for (let i = 0; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin < 0) continue; // 跳过无效子问题
      // 状态转移方程
      // highlight-next-line
      dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
};
```

### 最大子数组和

```js title="53.最大子序和"
var maxSubArray = function (nums) {
  if (nums.length === 0) return 0;
  // dp[i] 表示第i位的最大子序
  const dp = [];
  // base case
  dp[0] = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // 转态转移方程，前面的和如果是负数，就取当前值从新计算
    // highlight-next-line
    dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
  }
  return Math.max(...dp);
};
```

### 最长公共子序列

```js title="718.最长重复子数组"
var findLength = function (nums1, nums2) {
  const m = nums1.length;
  const n = nums2.length;
  // dp[i][j] 表示从i到j之间最长公共子序
  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));
  // base case: dp[i][0]=dp[0][j]=0
  let ans = 0;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (nums1[i - 1] === nums2[j - 1]) {
        // 状态转移方程，前一对重复的基础上才能加一
        // highlight-next-line
        dp[i][j] = dp[i - 1][j - 1] + 1;
        ans = Math.max(ans, dp[i][j]);
      }
    }
  }

  return ans;
};
```

```js title="1143.最长公共子序列"
var longestCommonSubsequence = function (text1, text2) {
  const m = text1.length;
  const n = text2.length;
  // dp[i][j] 表示从i到j之间最长公共子序
  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));
  // base case: dp[0][j]=dp[i][0]=0

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1.charAt(i - 1) === text2.charAt(j - 1)) {
        // highlight-next-line
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // highlight-next-line
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
};
```

### 最长回文子序

```js title="5.最长回文子串"
// 待补充动态规划写法
```

### 股票买卖系列问题

股票买卖相关题目动态规划解题思路：

- `dp[i][k][s]` 代表第 i 天第 k 次交易买入或卖出的最大收益
- base case:
  - `dp[-1][k][0] = dp[i][0][0] = 0`
  - `dp[-1][k][1] = dp[i][0][1] = -Infinity` 不存在的场景
- 状态转移方程：取决于是否维持前一天的状态
  - `dp[i][k][0] = max(dp[i-1][k][0], dp[i-1][k][0] + prices[i])`
  - `dp[i][k][1] = max(dp[i-1][k][1], dp[i-1][k-1][0] - prices[i])`

以上思路对于不同的股票买卖题目，其 k 值或许不同，具体场景再分析。

```js title="121.买卖股票的最佳时机"
var maxProfit = function (prices) {
  const n = prices.length;
  // dp[i][s] 表示第i天的最大收益
  const dp = Array.from(Array(n), () => Array(2));

  for (let i = 0; i < n; i++) {
    if (i === 0) {
      // base case
      dp[i][0] = 0;
      dp[i][1] = -prices[i];
      continue;
    }
    // 状态转移方程
    // highlight-start
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
    dp[i][1] = Math.max(dp[i - 1][1], -prices[i]);
    // highlight-end
  }

  return dp[n - 1][0];
};
```

```js title="122.买卖股票的最佳时机II"
var maxProfit = function (prices) {
  const n = prices.length;
  // dp[i][s] 表示第i天的最大收益
  const dp = Array.from(Array(n), () => Array(2));

  for (let i = 0; i < n; i++) {
    if (i === 0) {
      // base case
      dp[i][0] = 0;
      dp[i][1] = -prices[i];
      continue;
    }
    // 状态转移方程
    // highlight-start
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
    // highlight-end
  }

  return dp[n - 1][0];
};
```

### 打家劫舍系列问题

```js title="198.打家劫舍"
var rob = function (nums) {
  const n = nums.length;
  if (n === 0) return 0;
  // dp[i] 表示从第i家开始抢，能够抢到最多的钱
  const dp = Array(n + 1).fill();
  // base case
  dp[n] = 0;

  for (let i = n - 1; i >= 0; i--) {
    if (i === n - 1) {
      dp[i] = nums[i];
      continue;
    }
    // 状态转移方程：取决于前一天是否抢
    // highlight-next-line
    dp[i] = Math.max(dp[i + 1], nums[i] + dp[i + 2]);
  }

  return dp[0];
};
```
