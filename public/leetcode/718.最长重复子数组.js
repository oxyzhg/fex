/*
 * @lc app=leetcode.cn id=718 lang=javascript
 *
 * [718] 最长重复子数组
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function (nums1, nums2) {
  const m = nums1.length;
  const n = nums2.length;
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));
  let ans = 0;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (nums1[i - 1] === nums2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        ans = Math.max(ans, dp[i][j]);
      }
    }
  }

  return ans;
};
// @lc code=end

/**
 * 思路：动态规划
 * 1. dp[i][j] 代表nums1中从0-i项与nums2中从0-j项最长重复子集
 * 2. base case dp[i][0]=dp[0][j]=0
 * 3. 状态转移方程
 *        dp[i][j]=d[i-1][j-1]+1 同时进一位
 *
 */
