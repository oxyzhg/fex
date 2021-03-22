/*
 * @lc app=leetcode.cn id=26 lang=javascript
 *
 * [26] 删除排序数组中的重复项
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  let p = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== nums[p]) {
      nums[++p] = nums[i];
    }
  }

  return p + 1;
};
// @lc code=end
