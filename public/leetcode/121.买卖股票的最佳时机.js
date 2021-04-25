/*
 * @lc app=leetcode.cn id=121 lang=javascript
 *
 * [121] 买卖股票的最佳时机
 */

// @lc code=start
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;

  for (let i = 0; i < prices.length; i++) {
    min = Math.min(min, prices[i]);
    max = Math.max(max, prices[i] - min);
  }

  return max;
};
// @lc code=end

/**
 * 股票类问题整体DP设计：
 * 1. dp[i][k][s] 表示第i天，持有或不持有的最大收益，最多进行k次交易 i>=0,k>=1,s=0|1
 * 2. base case
 *      dp[-1][k][0] = dp[i][0][0] = 0
 *      dp[-1][k][1] = dp[i][0][1] = -Infinity 不存在的场景
 * 3. 状态转移方程
 *      dp[i][k][0] = max(dp[i-1][k][0], dp[i-1][k][1]+prices[i])
 *      dp[i][k][1] = max(dp[i-1][k][1], dp[i-1][k-1][0]-prices[i])
 *
 * 思路1：动态规划
 * 1. dp[i][s]
 * 2. base case
 *      dp[-1][0] = dp[i][0] = 0
 *      dp[-1][1] = dp[i][1] = -Infinity
 * 3. 状态转译方程
 *      dp[i][0] = max(dp[i-1][0], dp[i-1][1]+prices[i])
 *      dp[i][1] = max(dp[i-1][1], -prices[i])
 *
 * 思路2：DP+空间优化
 * 1. 在动态规划的基础上，我们每轮计算只用到前一轮的两个数，那么优化思路就从这两个变量开始
 * 2. 计算方法跟DP思路一致
 *
 * 思路3：找最大值与最小值间的差值
 * 1. 找一个序列的最小值，在次之后再找最大值
 * 2. 最值间的差值就是最大利润
 * 3. 注意这个方式不存在普适性，是个特别的思路
 */
