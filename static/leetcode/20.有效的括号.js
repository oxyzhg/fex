/*
 * @lc app=leetcode.cn id=20 lang=javascript
 *
 * [20] 有效的括号
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  // 非偶数无效
  if (s.length % 2) return false;

  let stack = [];
  let map = { ')': '(', '}': '{', ']': '[' };

  for (let i = 0; i < s.length; i++) {
    let str = s.charAt(i);
    if (map[str]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(str);
    }
  }

  return stack.length === 0;
};
// @lc code=end
