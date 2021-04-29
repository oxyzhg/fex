/*
 * @lc app=leetcode.cn id=240 lang=javascript
 *
 * [240] 搜索二维矩阵 II
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
  if (!matrix || !matrix.length) return false;

  const rows = matrix.length;
  const cols = matrix[0].length;

  const hasTarget = (startRow, endRow, startCol, endCol) => {
    if (startRow > endRow || startCol > endCol) return false;

    const middleRow = Math.floor((endRow - startRow) / 2) + startRow;
    const middleCol = Math.floor((endCol - startCol) / 2) + startCol;

    if (matrix[middleRow][middleCol] === target) return true;

    if (matrix[middleRow][middleCol] < target) {
      return (
        hasTarget(startRow, middleRow, middleCol + 1, endCol) ||
        hasTarget(middleRow + 1, endRow, startCol, endCol)
      );
    } else {
      return (
        hasTarget(startRow, endRow, startCol, middleCol - 1) ||
        hasTarget(startRow, middleRow - 1, middleCol, endCol)
      );
    }
  };

  return hasTarget(0, rows - 1, 0, cols - 1);
};
// @lc code=end

/**
 * 实例：二分查找
 * 1. 利用二维矩阵的特性，不断缩小查找范围
 * 2. 必要时可以通过画图找边界
 */