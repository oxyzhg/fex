/*
 * @lc app=leetcode.cn id=120 lang=javascript
 *
 * [120] 三角形最小路径和
 */

// @lc code=start
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function (triangle) {
  // f(i,j) = Math.min(f(i+1, j), f(i+1, j+1))

  // 副作用：直接修改函数参数，工业程序会带来问题
  for (let i = triangle.length - 2; i >= 0; i--) {
    // 从倒数第二行开始向上计算
    for (let j = 0; j < triangle[i].length; j++) {
      // 当前节点向下的最小路径 + 当前节点值保存
      triangle[i][j] += Math.min(triangle[i + 1][j], triangle[i + 1][j + 1]);
    }
  }

  return triangle[0][0];
};
// @lc code=end
