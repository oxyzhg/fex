/*
 * @lc app=leetcode.cn id=22 lang=javascript
 *
 * [22] 括号生成
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
  const result = [];

  const f = (str = '', left = 0, right = 0) => {
    // terminator
    if (left === n && right === n) {
      result.push(str);
      return;
    }

    // process + drill down
    if (left < n) f(str + '(', left + 1, right);
    if (right < left) f(str + ')', left, right + 1);
  };

  f();

  return result;
};
// @lc code=end
