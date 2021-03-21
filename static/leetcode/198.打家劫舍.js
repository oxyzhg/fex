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
  if (nums.length === 0) return 0;

  const dp = new Array(nums.length).fill().map(() => new Array(2).fill(0));

  // DP方程:
  // dp[i][0]=max(dp[i-1][0], dp[i-1][1])
  // dp[i][1]=dp[i-1][0]+count

  dp[0][0] = 0;
  dp[0][1] = nums[0];

  for (let i = 1; i < nums.length; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1]);
    dp[i][1] = dp[i - 1][0] + nums[i];
  }

  return Math.max(dp[nums.length - 1][0], dp[nums.length - 1][1]);
};
// @lc code=end
