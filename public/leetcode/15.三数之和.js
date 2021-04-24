/*
 * @lc app=leetcode.cn id=15 lang=javascript
 *
 * [15] 三数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  const result = [];
  const length = nums.length;
  let p, q, sum;

  nums = nums.sort((a, b) => a - b);

  for (let i = 0; i < length; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    p = i + 1;
    q = length - 1;

    while (p < q) {
      sum = nums[i] + nums[p] + nums[q];

      if (sum === 0) {
        result.push([nums[i], nums[p], nums[q]]);

        while (p < q && nums[p] === nums[p + 1]) p++;
        while (p < q && nums[q] === nums[q - 1]) q--;
        p++;
        q--;
      } else if (sum < 0) {
        p++;
      } else {
        q--;
      }
    }
  }

  return result;
};
// @lc code=end

/**
 * 思路：双指针，夹逼
 * 1. 排序，让数组成为有序数组，方便后续剪枝和夹逼
 */
