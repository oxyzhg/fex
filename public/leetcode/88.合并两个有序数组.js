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
  let index = m + n - 1;

  while (index >= 0) {
    if (m > 0 && n > 0) {
      nums1[index--] = nums1[m - 1] > nums2[n - 1] ? nums1[--m] : nums2[--n];
    } else if (m > 0) {
      nums1[index--] = nums1[--m];
    } else if (n > 0) {
      nums1[index--] = nums2[--n];
    }
  }

  return nums1;
};
// @lc code=end

/**
 * 双指针
 * 1. 取两个数组总长度-1作为合并后数组的末尾索引
 * 2. 每次迭代判断是否都合并完
 * 3. 如果都未合并完，取最大值填入数组，如果nums1未合并完，直接合入即可，nums2同理
 */
