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
  return helper(n, new Map());
};

function helper(n, map) {
  if (map.has(n)) return map.get(n);

  if (n <= 2) {
    map.set(n, n);
  } else {
    map.set(n, helper(n - 1, map) + helper(n - 2, map));
  }

  return map.get(n);
}
// @lc code=end

/**
 * 推导公式：f(n)=f(n-1)+f(n-2)
 *
 * 思路1：递归
 * 1. 根据推导公式，我们可以发现这是一道DFS能解决的题目
 * 2. 如果n<=2,那么设置特殊值即可，如果n>2,那么递归计算、
 * 3. 特殊地，避免重复计算，增加一个hash缓存
 *
 * 思路2：动态规划
 * 1. 建立数组存每一级的层数，特殊地 dp[1]=1, dp[2]=2
 * 2. 从第三阶开始，遍历通过递推公式计算每阶的值
 * 3. 最终返回 dp[n] 即可
 *
 * 思路3：遍历
 * 1. 根据动态规划的思路，我们可以知道计算最后一次的值，只需要前两次的值即可，那么该方法就是动态规划的优化
 * 2. 只需要两个变量保存倒1、倒2的值，其余的值不再保存
 */
