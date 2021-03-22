/*
 * @lc app=leetcode.cn id=7 lang=javascript
 *
 * [7] 整数反转
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function (x) {
  const sign = Math.sign(x);
  const str = Math.abs(x).toString().split('').reverse().join('');
  const res = str * sign;

  return res >= Math.pow(-2, 31) && res <= Math.pow(2, 31) - 1 ? res : 0;
};
// @lc code=end
