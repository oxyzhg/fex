/*
 * @lc app=leetcode.cn id=69 lang=javascript
 *
 * [69] x 的平方根
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function (x) {
  if (x === 0 || x === 1) return x;

  let left = 0;
  let right = x;

  while (left <= right) {
    // 中间值向下取整
    let mid = left + ((right - left) >> 1);

    // 1. 中间值平方大于x 则缩小范围 right=mid-1
    // 2. 中间值平方小于x 则扩大范围 left=mid+1
    // 3. 中间值平方等于x 值已经出现
    if (mid * mid > x) {
      right = mid - 1;
    } else if (mid < x) {
      left = mid + 1;
    } else {
      return mid;
    }
  }

  return right;
};
// @lc code=end
