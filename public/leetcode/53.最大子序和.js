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
  if (nums.length === 0) return 0;
  const dp = [];
  dp[0] = nums[0];

  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
  }
  return Math.max(...dp);
};
// @lc code=end

/**
 * 思路1：动态规划
 * 1. 若前一个元素大于0，则将其加到当前元素上
 *
 * 思路2：贪心算法
 * 1. 若当前指针所指元素之前的和小于0，则丢弃当前元素之前的数列
 */
