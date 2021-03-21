/*
 * @lc app=leetcode.cn id=47 lang=javascript
 *
 * [47] 全排列 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
  const result = [];
  nums = nums.sort(); // 暂不理解为什么排序

  const helper = (curr, remain) => {
    // terminator
    if (remain.length === 0) {
      result.push(curr);
      return;
    }

    // current
    let uniques = new Set();

    for (let i = 0; i < remain.length; i++) {
      if (uniques.has(remain[i])) {
        continue;
      } else {
        uniques.add(remain[i]);
        curr.push(remain[i]);
        // drill down
        helper([...curr], [...remain.slice(0, i), ...remain.slice(i + 1)]);
        curr.pop();
      }
    }
  };

  helper([], nums);

  return result;
};
// @lc code=end
