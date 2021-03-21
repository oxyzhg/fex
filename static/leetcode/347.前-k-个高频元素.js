/*
 * @lc app=leetcode.cn id=347 lang=javascript
 *
 * [347] 前 K 个高频元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
  // 遍历计数+排序
  const numMap = nums.sort().reduce((map, v) => {
    map[v] = (map[v] || 0) + 1;
    return map;
  }, {});

  return Object.entries(numMap)
    .sort((a, b) => (a[1] < b[1] ? 1 : -1))
    .slice(0, k)
    .map((el) => el[0]);
};
// @lc code=end
