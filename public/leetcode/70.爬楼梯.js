/*
 * @lc app=leetcode.cn id=70 lang=javascript
 *
 * [70] 爬楼梯
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
  // if (n <= 2) return n;
  // let p = 1;
  // let q = 1;
  // let r;
  // for (let i = 3; i < nums.length; i++) {
  //   r = p + 1;
  //   p = q;
  //   q = r;
  // }
  // return q;

  return help(n, new Map());
};

const help = (n, map) => {
  // 1. 递归终结条件：哈希表存即退出递归
  // 2. 处理当前层：当前阶楼梯 f(n)=f(n-1)+f(n-2), 特殊地处理n<=2的情况
  // 3. 下探到下一层：在处理当前层的时候，就包含下探操作
  // 4. 清理状态：暂无

  if (map.has(n)) return map.get(n);

  if (n <= 2) {
    map.set(n, n);
  } else {
    map.set(n, help(n - 1, map) + help(n - 2, map));
  }

  return map.get(n);
};
// @lc code=end
