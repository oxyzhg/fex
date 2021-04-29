/*
 * @lc app=leetcode.cn id=62 lang=javascript
 *
 * [62] 不同路径
 */

const { memo } = require('react');

// @lc code=start
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
  // 最优子结构: f(m, n) = f(m+1, n) + f(m, n+1)

  // 解法1: 递归（超时）
  // const helper = (i, j) => {
  //   if (i === m && j === n) return 1;
  //   if (i > m || j > n) return 0;

  //   const pathsRight = helper(i + 1, j);
  //   const pathsBottom = helper(i, j + 1);

  //   return pathsRight + pathsBottom;
  // };

  // return helper(1, 1);

  // 解法2: 递归+记忆化搜索
  // const memo = new Array(m + 1);
  // for (let i = 0; i < memo.length; i++) {
  //   memo[i] = new Array(n + 1).fill(-1);
  // }

  // const helper = (i, j, memo) => {
  //   if (i === m && j === n) return 1;
  //   if (i > m || j > n) return 0;

  //   if (memo[i][j] === -1) {
  //     const pathsRight = helper(i, j + 1, memo);
  //     const pathsBottom = helper(i + 1, j, memo);

  //     memo[i][j] = pathsRight + pathsBottom;
  //   }

  //   return memo[i][j];
  // };

  // return helper(1, 1, memo);

  // 解法3: 动态规划（自底向上）
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(1));
  dp[m][n] = 1;

  for (let i = m - 1; i > 0; i--) {
    for (let j = n - 1; j > 0; j--) {
      dp[i][j] = dp[i + 1][j] + dp[i][j + 1];
    }
  }

  return dp[1][1];
};
// @lc code=end

/**
 * 思路：动态规划
 * 1. dp[i][j] 表示从位置[i,j]移动到位置[m,n]所需路径数
 * 2. base case dp[m][n]=1 本题需要自顶向下遍历  实际上dp[m][j]=dp[i][n]=1 因为只能单向走 另一方面也能反映出距离终点越近可选的路越少
 * 3. 状态转移方程 dp[i][j]=dp[i+1][j]+dp[i][j+1]
 */