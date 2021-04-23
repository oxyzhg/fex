/*
 * @lc app=leetcode.cn id=165 lang=javascript
 *
 * [165] 比较版本号
 */

// @lc code=start
/**
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
var compareVersion = function (version1, version2) {
  const list1 = version1.split('.');
  const list2 = version2.split('.');

  let index = 0;

  while (index < list1.length || index < list2.length) {
    let n1 = Number(list1[index]) || 0;
    let n2 = Number(list2[index]) || 0;

    if (n1 === n2) {
      index++;
      continue;
    }

    return n1 > n2 ? 1 : -1;
  }

  return 0;
};
// @lc code=end
