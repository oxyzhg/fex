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
  let res = [];
  let len = nums.length;
  let p, q, sum;

  nums.sort((a, b) => a - b)

  for (let i = 0; i < len; i++) {
      if (nums[0] > 0) break;
      if (i > 0 && nums[i] === nums[i - 1]) continue;

      p = i + 1;
      q = len - 1;

      while (p < q) {
          sum = nums[i] + nums[p] + nums[q];

          if (sum === 0) {
              res.push([nums[i], nums[p], nums[q]]);

              while (p < q && nums[p] === nums[p + 1]) p++;
              while (p < q && nums[q] === nums[q - 1]) q--;
              p++;
              q--;
          }
          else if (sum < 0) p++;
          else if (sum > 0) q--;
      }
  }

  return res;
};
// @lc code=end
