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
  if (s.length % 2) return false;

  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '[',
  };

  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i);

    if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(c);
    }
  }

  return stack.length === 0;
};
// @lc code=end

/**
 * 思路：栈
 * 1. 利用栈后入先出的特点，找出匹配的符号
 * 2. 如果当前是闭括号，且没配对成功，那么就是无效括号，否则就匹配并出栈
 * 3. 如果当前是开括号，那么就直接进栈
 * 4. 最终还要判断栈是否为空，不为空也是无效
 */
