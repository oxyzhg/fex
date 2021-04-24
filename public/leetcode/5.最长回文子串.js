/*
 * @lc app=leetcode.cn id=5 lang=javascript
 *
 * [5] 最长回文子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  const length = s.length;
  if (length < 2) return s;

  let ans = '';

  for (let i = 0; i < length; i++) {
    // 奇数
    helper(i, i);
    // 偶数
    helper(i, i + 1);
  }

  function helper(m, n) {
    while (m >= 0 && n < length && s[m] === s[n]) {
      m--;
      n++;
    }

    // 回文区间 (m,n) 或 [m+1,n-1]
    if (n - m - 1 > ans.length) {
      ans = s.slice(m + 1, n);
    }
  }

  return ans;
};
// @lc code=end

/**
 * 思路1：中心扩散
 * 1. 回文字符串长度在奇数和偶数之间存在差异
 * 2. 在允许的区间内，逐渐向外扩散
 * 3. 调出while循环后，回文字符串的区间是 [m+1, n-1]
 * 4. 判断已存字符串大小，更新即可
 *
 * 思路2：动态规划
 * 1. dp[i][j] 代表[i,j]区间的string是否回文，是1否0
 * 2. 状态转移方程，dp[i][j]=dp[i+1][j-1]&&s[i]==s[j]
 * 3. 对角线上的值 dp[i][i]=1
 */
