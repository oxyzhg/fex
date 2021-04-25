/*
 * @lc app=leetcode.cn id=122 lang=javascript
 *
 * [122] 买卖股票的最佳时机 II
 */

// @lc code=start
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let ans = 0;
  let prev, curr;

  for (let i = 1; i < prices.length; i++) {
    prev = prices[i - 1];
    curr = prices[i];

    if (curr > prev) {
      ans += curr - prev;
    }
  }

  return ans;
};
// @lc code=end

/**
 * 股票类问题整体DP设计思路：
 * 1. dp[i][k][s]
 * 2. base case
 *      dp[-1][k][0] = dp[i][0][0] = 0
 *      dp[-1][k][1] = dp[i][0][1] = -Infinity 不存在的场景
 * 3. 状态转译方程
 *      dp[i][k][0] = max(dp[i-1][k][0], dp[i-1][k][0]+prices[i])
 *      dp[i][k][1] = max(dp[i-1][k][1], dp[i-1][k-1][0]-prices[i])
 *
 * 思路1：动态规划
 * 1. 股票类DP设计思路，应用到本题，k趋近于无穷大，可以看作是不变的值
 * 2. 状态转移方程变为
 *      dp[i][0] = max(dp[i-1][0], dp[i-1][1]+prices[i])
 *      dp[i][1] = max(dp[i-1][1], dp[i-1][0]-prices[i])
 *
 * 思路2：DP+空间优化
 *
 * 思路3：找单调递增区间
 */
