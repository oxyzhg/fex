/*
 * @lc app=leetcode.cn id=34 lang=javascript
 *
 * [34] 在排序数组中查找元素的第一个和最后一个位置
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
  const length = nums.length;
  let start = 0;
  let end = length;
  let mid;

  while (start <= end) {
    mid = (start + end) >> 1;

    if (nums[mid] === target) {
      start = mid;
      end = mid;
    } else if (nums[mid] < target) start = mid + 1;
    else end = mid - 1;
  }

  if (start > end) return [-1, -1];

  while (nums[start - 1] === target) start--;
  while (nums[end + 1] === target) end++;

  return [start, end];
};
// @lc code=end
