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
  // let ans = -Number.MAX_SAFE_INTEGER;
  // let prev = 0;

  // for (let curr of nums) {
  //   prev = Math.max(prev + curr, curr);
  //   ans = Math.max(ans, prev);
  // }

  // return ans;

  // let prev = nums[0];

  for (let i = 1; i < nums.length; i++) {
    if (nums[i - 1] > 0) {
      nums[i] = nums[i] + nums[i - 1];
    }
  }

  return Math.max(...nums);
};
// @lc code=end

/**
 * 思路1：动态规划
 * 1. 若前一个元素大于0，则将其加到当前元素上
 *
 * 思路2：贪心算法
 * 1. 若当前指针所指元素之前的和小于0，则丢弃当前元素之前的数列
 */
