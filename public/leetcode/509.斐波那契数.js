/*
 * @lc app=leetcode.cn id=509 lang=javascript
 *
 * [509] 斐波那契数
 */

// @lc code=start
/**
 * @param {number} N
 * @return {number}
 */
var fib = function (N) {
  // 解法1: 递归+记忆化搜索
  // const helper = (n, memo) => {
  //   if (n <= 1) {
  //     return n;
  //   }
  //   if (memo[n]) return memo[n];
  //   memo[n] = helper(n - 1, memo) + helper(n - 2, memo);
  //   return memo[n];
  // };
  // return helper(N, []);

  // 解法2: 遍历+记忆化搜索
  // const dp = [];
  // dp[0] = 0;
  // dp[1] = 1;
  // for (let i = 2; i <= N; i++) {
  //   dp[i] = dp[i - 1] + dp[i - 2];
  // }
  // return dp[N];
  
  // 解法3: 遍历+空间复杂度优化
  // if (N <= 1) return N;
  // let p = 0;
  // let q = 1;
  // let r;
  // for (let i = 2; i <= N; i++) {
  //   r = p + q;
  //   p = q;
  //   q = r;
  // }
  // return q;
};
// @lc code=end
