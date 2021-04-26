/*
 * @lc app=leetcode.cn id=56 lang=javascript
 *
 * [56] 合并区间
 */

// @lc code=start
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
  const ans = [];
  intervals.sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < intervals.length; i++) {
    if (i === 0) {
      ans.push(intervals[i]);
      continue;
    }

    const last = ans.pop();

    if (isIntersection(last, intervals[i])) {
      ans.push([Math.min(last[0], intervals[i][0]), Math.max(last[1], intervals[i][1])]);
    } else {
      ans.push(last);
      ans.push(intervals[i]);
    }
  }

  return ans;
};

function isIntersection(a, b) {
  return (b[0] >= a[0] && b[0] <= a[1]) || (b[1] >= a[0] && b[1] <= a[1]);
}
// @lc code=end

/**
 * 思路：
 * 1. 借助辅助函数判断两个数组是否有交集
 * 2. 对区间集合排序，按头排序
 * 3. 特别地，第一项形成独自区间，往后的每一项都对比结果最后一项，即代码中 last
 * 4. 如果当前项与结果尾项存在交集，则更新最后一项，否则新增一个独立的区间
 */
