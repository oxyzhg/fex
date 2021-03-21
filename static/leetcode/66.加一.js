/*
 * @lc app=leetcode.cn id=66 lang=javascript
 *
 * [66] 加一
 */

// @lc code=start
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    digits[i]++;
    digits[i] %= 10;

    // =0 说明需要进位，需要进行次轮进位操作
    if (digits[i] != 0) {
      return digits;
    }
  }

  // 如果能活着出循环，说明首位需要进位，即直接补1
  digits.unshift(1);
  return digits;
};
// @lc code=end
