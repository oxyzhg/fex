/*
 * @lc app=leetcode.cn id=88 lang=javascript
 *
 * [88] 合并两个有序数组
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function (nums1, m, nums2, n) {
  let current = m + n - 1; // 倒序插入

  while (current >= 0) {
    if (m > 0 && n > 0) {
      nums1[current--] = nums1[m - 1] > nums2[n - 1] ? nums1[--m] : nums2[--n];
    } else if (m > 0) {
      nums1[current--] = nums1[--m];
    } else if (n > 0) {
      nums1[current--] = nums2[--n];
    }
  }

  return nums1;
};
// @lc code=end
