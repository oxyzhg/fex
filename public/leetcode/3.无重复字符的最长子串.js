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
  let map = {};
  let ans = 0;
  let left = 0;

  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i);

    if (map[c] >= left) {
      left = map[c] + 1;
    }

    map[c] = i;

    ans = Math.max(ans, i - left + 1);
  }

  return ans;
};

// @lc code=end

/**
 * 思路：双指针，滑动窗口
 * 1. 利用hash表缓存已经遍历的字符索引，并标记无重复字符的起点
 * 2. 判重，如果再次遇到该值，且该值存储的索引大于等于左边界，则更新左边界至重复值索引后一位
 * 3. 更新当前值对应索引，此时左边界到当前索引范围内不重复
 * 4. 根据当前索引与左边界更新最大值
 */
