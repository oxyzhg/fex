/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let map = {}; // hash cache
  let left = 0; // left position

  return s.split('').reduce((max, v, i) => {
    // 1. update left position 重复即更新
    left = map[v] >= left ? map[v] + 1 : left;

    // 2. update latest position
    map[v] = i;

    // 3. update the max value in each loop
    return Math.max(max, i - left + 1);
  }, 0);
};

// @lc code=end
