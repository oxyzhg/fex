/*
 * @lc app=leetcode.cn id=151 lang=javascript
 *
 * [151] 翻转字符串里的单词
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  const queue = [];
  let word = '';

  for (let i = 0; i < s.length; i++) {
    let char = s.charAt(i);

    if (char === ' ' && word) {
      queue.unshift(word);
      word = '';
    } else if (char !== ' ') {
      word += char;
    }
  }

  word && queue.unshift(word);

  return queue.join(' ');
};
// @lc code=end
