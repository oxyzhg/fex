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

  const backtrack = (selected, options) => {
    if (selected.length === nums.length) {
      result.push(selected);
      return;
    }
    for (let num of options) {
      if (selected.includes(num)) continue;
      backtrack([...selected, num], options);
    }
  };

  backtrack([], nums);

  return result;
};
// @lc code=end
