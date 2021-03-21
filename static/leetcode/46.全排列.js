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
  const len = nums.length;

  const helper = (curr) => {
    // terminator
    if (curr.length === len) {
      result.push(curr);
      return;
    }

    // current
    for (let num of nums) {
      if (curr.includes(num)) continue;
      helper([...curr, num]);
    }
  };

  helper([]);

  return result;
};
// @lc code=end
