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
  let i = num1.length - 1;
  let j = num2.length - 1;

  let carry = 0;
  let sum = '';

  while (i >= 0 || j >= 0 || carry > 0) {
    if (i >= 0) {
      carry += +num1[i--];
    }
    if (j >= 0) {
      carry += +num2[j--];
    }

    sum = (carry % 10) + sum;
    carry = Math.floor(carry / 10);
  }

  return sum;
};
// @lc code=end
