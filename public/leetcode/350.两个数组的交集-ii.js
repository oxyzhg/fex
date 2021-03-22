/*
 * @lc app=leetcode.cn id=350 lang=javascript
 *
 * [350] 两个数组的交集 II
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function (nums1, nums2) {
  nums1 = nums1.sort();
  nums2 = nums2.sort();

  let p = 0; // left pointer
  let q = 0; // right pointer

  const result = [];

  while (p < nums1.length && q < nums2.length) {
    if (nums1[p] < nums2[q]) p++;
    else if (nums1[p] > nums2[q]) q++;
    else {
      result.push(nums1[p]);
      p++;
      q++;
    }
  }

  return result;
};
// @lc code=end
