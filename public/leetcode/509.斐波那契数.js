/*
 * @lc app=leetcode.cn id=509 lang=javascript
 *
 * [509] 斐波那契数
 */

// @lc code=start
/**
 * @param {number} N
 * @return {number}
 */
var fib = function (N) {
  if (N < 2) return N;

  let prev = 0;
  let last = 1;
  let temp;

  for (let i = 2; i <= N; i++) {
    temp = prev + last;
    prev = last;
    last = temp;
  }

  return last;
};
// @lc code=end

/**
 * 思路1：递归
 * 1. 具备递归的特点
 * 2. 递归终止条件是 n<=1
 * 3. 递归优化实验 memo 避免重复计算
 *
 * 思路2：动态规划
 * 1. 根据前两项已知值，向后推导
 * 2. 最后一项就是结果
 *
 * 思路3：遍历优化
 * 1. 在DP基础上，只保留前两个值，优化空间复杂度
 */
