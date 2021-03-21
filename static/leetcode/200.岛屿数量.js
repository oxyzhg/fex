/*
 * @lc app=leetcode.cn id=200 lang=javascript
 *
 * [200] 岛屿数量
 */

// @lc code=start
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  let count = 0;

  const dfsMark = (x, y) => {
    if (grid[x][y] === '1') {
      grid[x][y] = '0';
    } else {
      return;
    }

    // 这里做边界拦截，递归剪枝操作，防止爆栈
    if (x < grid.length - 1) dfsMark(x + 1, y);
    if (x > 0 && x < grid.length) dfsMark(x - 1, y);
    if (y < grid[x].length - 1) dfsMark(x, y + 1);
    if (y > 0 && y < grid[x].length) dfsMark(x, y - 1);
  };

  // 遍历网格
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // 如果是岛屿，把岛屿周边都夷为平地
      if (grid[i][j] === '1') {
        count++;
        dfsMark(i, j);
      }
    }
  }

  return count;
};
// @lc code=end
