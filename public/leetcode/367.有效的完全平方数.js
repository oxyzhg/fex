/*
 * @lc app=leetcode.cn id=367 lang=javascript
 *
 * [367] 有效的完全平方数
 */

// @lc code=start
/**
 * @param {number} num
 * @return {boolean}
 */
var isPerfectSquare = function (num) {
  if (num === 0 || num === 1) return true;

  let left = 0;
  let right = num;

  while (left <= right) {
    let mid = (left + right) >> 1;
    let temp = mid * mid;

    if (temp > num) {
      right = mid - 1;
    } else if (temp < num) {
      left = mid + 1;
    } else {
      return true;
    }
  }

  return false;
};
// @lc code=end
