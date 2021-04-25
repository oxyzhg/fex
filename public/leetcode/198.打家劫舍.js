/*
 * @lc app=leetcode.cn id=198 lang=javascript
 *
 * [198] 打家劫舍
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function (nums) {
  const length = nums.length;
  if (length === 0) return 0;

  const dp = Array(length + 1).fill();
  dp[length] = 0;

  for (let i = length - 1; i >= 0; i--) {
    if (i === length - 1) {
      dp[i] = nums[i];
      continue;
    }
    dp[i] = Math.max(dp[i + 1], nums[i] + dp[i + 2]);
  }

  return dp[0];
};
// @lc code=end

/**
 * 思路：动态规划
 * 1. dp[i] 表示从第i家开始抢，能够抢到的最多的钱
 * 2. base case dp[length]=0
 * 3. 状态转移方程 dp[i] = max(dp[i+1], nums[i]+dp[i+2])
 */
