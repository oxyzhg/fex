/*
 * @lc app=leetcode.cn id=125 lang=javascript
 *
 * [125] 验证回文串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
  // 1. 去掉所有无效字符
  // 2. 与字符翻转后的字符串对比
  const str = s.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
  return str === str.split('').reverse().join('');
};

// @lc code=end
