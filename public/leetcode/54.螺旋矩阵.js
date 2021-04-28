/*
 * @lc app=leetcode.cn id=54 lang=javascript
 *
 * [54] 螺旋矩阵
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
  const ans = [];

  while (matrix.length) {
    const first = matrix.shift();
    ans.push(...first);
    for (const m of matrix) {
      let val = m.pop();
      if (val) {
        ans.push(val);
        m.reverse();
      }
    }
    matrix.reverse();
  }

  return ans;
};
// @lc code=end

/**
 * 思路：顺序化反
 * 1. 取出矩阵的第一行
 * 2. 矩阵剩下的每一行取出最后一个值，并将该行反序
 * 3. 然后将矩阵纵向反序
 * 4. 顺序化反是为了操作的统一，也是该题解题的核心
 */
