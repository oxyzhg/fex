/*
 * @lc app=leetcode.cn id=46 lang=javascript
 *
 * [46] 全排列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  const result = [];

  const traverse = (current) => {
    if (current.length === nums.length) {
      result.push(current);
      return;
    }

    for (let num of nums) {
      if (current.includes(num)) continue;
      traverse([...current, num]);
    }
  }

  traverse([]);

  return result;
};
// @lc code=end
