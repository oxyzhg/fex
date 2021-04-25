/*
 * @lc app=leetcode.cn id=322 lang=javascript
 *
 * [322] 零钱兑换
 */

// @lc code=start
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 0; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin < 0) continue;
      dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
};
// @lc code=end

/**
 * 思路1：动态规划
 * 1. dp[i] 代表找零i元，需要最小硬币数
 * 2. base case 是 dp[0]=0, 即找零0元不需要硬币数
 * 3. 状态转移方程 dp[i]=min(dp[i], 1+dp[i-coin])
 *
 * 思路2：贪心算法
 */
