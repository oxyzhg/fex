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
  let ans = 0;

  const rows = grid.length;
  const cols = grid[0].length;

  const traverse = (x, y) => {

    if (grid[x][y] === '1') {
      grid[x][y] = '0'; // 夷为平地，标记为已访问
    } else {
      return;
    }

    if (x + 1 < rows) traverse(x + 1, y);
    if (x - 1 >= 0) traverse(x - 1, y);
    if (y + 1 < cols) traverse(x, y + 1);
    if (y - 1 >= 0) traverse(x, y - 1);
  };

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j< cols; j++) {
      if (grid[i][j] === '1') {
        ans++;
        traverse(i, j);
      }
    }
  }

  return ans;
};
// @lc code=end

/**
 * 思路：DFS
 * 1. 深度优先遍历，如果当前是1表示陆地，则计数加一
 * 2. 然后将该陆地周边相连的陆地都夷为平地，防止后续重复标记
 * 3. 深度优先遍历的过程中，要判断判断的边界，并选择合适的退出条件
 * 4. 明确我们深度优先遍历的过程的将陆地关联的周边岛屿都夷为平地的过程，本身不涉及其他操作
 */