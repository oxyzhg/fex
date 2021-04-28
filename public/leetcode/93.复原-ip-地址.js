/*
 * @lc app=leetcode.cn id=93 lang=javascript
 *
 * [93] 复原 IP 地址
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function (s) {
  const result = [];

  const backtrack = (arr, str) => {
    if (arr.length === 3) {
      if (isValid(str)) result.push([...arr, str]);
      return;
    }

    for (let i = 1; i <= 3; i++) {
      let substr = str.slice(0, i);
      if (!isValid(substr)) continue;
      backtrack([...arr, substr], str.slice(i));
    }
  };

  backtrack([], s);

  return result.map((el) => el.join('.'));
};

function isValid(str) {
  if (+str > 255 || !str.length) return false;
  if (str.length > 1 && str[0] === '0') return false;
  return true;
}
// @lc code=end
