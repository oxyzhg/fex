/*
 * @lc app=leetcode.cn id=63 lang=javascript
 *
 * [63] 不同路径 II
 */

// @lc code=start
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function (obstacleGrid) {
  const rows = obstacleGrid.length;
  const cols = obstacleGrid[0].length;

  if (obstacleGrid[rows - 1][cols - 1] === 1 || obstacleGrid[0][0] === 1) {
    return 0;
  }

  const dp = new Array(rows).fill().map(() => new Array(cols).fill(1));

  for (let i = rows - 1; i >= 0; i--) {
    for (let j = cols - 1; j >= 0; j--) {
      if (i === rows - 1 && j === cols - 1) {
        // 最后一个格子
        dp[i][j] = 1;
      } else if (obstacleGrid[i][j] === 1) {
        // 有障碍的格子
        dp[i][j] = 0;
      } else {
        let pathsRight = j > cols - 2 ? 0 : obstacleGrid[i][j + 1] === 1 ? 0 : dp[i][j + 1];
        let pathsBottom = i > rows - 2 ? 0 : obstacleGrid[i + 1][j] === 1 ? 0 : dp[i + 1][j];

        dp[i][j] = pathsRight + pathsBottom;
      }
    }
  }

  return dp[0][0];
};
// @lc code=end
