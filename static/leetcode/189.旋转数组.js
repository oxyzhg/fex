/*
 * @lc app=leetcode.cn id=189 lang=javascript
 *
 * [189] 旋转数组
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
  if (k === 0) return nums;

  // 方法一 暴力循环
  for (let i = 0; i < k; i++) {
    nums.unshift(nums.pop());
  }

  // 方法二 splice
  // nums.splice(0, 0, ...nums.splice(nums.length - k, k));

  // 方法三 splice+ushift
  // nums.unshift(...nums.splice(nums.length - k, k));

  return nums;
};
// @lc code=end
