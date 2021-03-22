/*
 * @lc app=leetcode.cn id=14 lang=javascript
 *
 * [14] 最长公共前缀
 */

// @lc code=start
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  if (strs.length === 0) return '';

  let pos = strs[0];
  let res = '';

  for (var i = 0; i < pos.length; i++) {
    let flug = pos[i];

    if (strs.slice(1).some((el) => el[i] !== flug)) break;

    res += flug;
  }

  return res;
};
// @lc code=end
