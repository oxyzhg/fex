/*
 * @lc app=leetcode.cn id=11 lang=javascript
 *
 * [11] 盛最多水的容器
 */

// @lc code=start
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  // 双指针+夹逼计算

  let p = 0;
  let q = height.length - 1;

  let max = 0;
  let area; // width*height, height=Math.min(left, right)

  while (p < q) {
    area = Math.min(height[p], height[q]) * (q - p);

    if (area > max) max = area;

    if (height[p] < height[q]) p++;
    else q--;
  }

  return max;
};
// @lc code=end
