/*
 * @lc app=leetcode.cn id=53 lang=javascript
 *
 * [53] 最大子序和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  // DP方程: max_sum=max(f(n), max_sum())

  let max = -Number.MAX_SAFE_INTEGER;
  let prev = 0;

  for (let i = 0; i < nums.length; i++) {
    prev = Math.max(prev + nums[i], nums[i]);
    max = Math.max(prev, max);
  }

  return max;
};
// @lc code=end
