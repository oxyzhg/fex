/*
 * @lc app=leetcode.cn id=77 lang=javascript
 *
 * [77] 组合
 */

// @lc code=start
/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function (n, k) {
  return helper(k, n);
};

const helper = (max, n, out = [], curr = [], index = 1) => {
  // terminator
  if (curr.length === max) {
    out.push(curr);
  } else {
    while (index <= n) {
      // drill down
      helper(max, n, out, [...curr, index], ++index);
    }
  }
  return out;
};
// @lc code=end
