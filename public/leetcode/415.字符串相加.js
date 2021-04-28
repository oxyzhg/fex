/*
 * @lc app=leetcode.cn id=415 lang=javascript
 *
 * [415] 字符串相加
 */

// @lc code=start
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function (num1, num2) {
  let ans = '';
  let m = num1.length - 1;
  let n = num2.length - 1;
  let carry = 0;

  while (m >= 0 || n >= 0 || carry > 0) {
    if (m >= 0) {
      carry += +num1[m--];
    }
    if (n >= 0) {
      carry += +num2[n--];
    }
    ans = (carry % 10) + ans;
    carry = Math.floor(carry / 10);
  }

  return ans;
};
// @lc code=end
