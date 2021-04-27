/*
 * @lc app=leetcode.cn id=26 lang=javascript
 *
 * [26] 删除排序数组中的重复项
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  if (nums.length === 0) return 0;

  let slow = 0;
  let fast = 0;

  while (fast < nums.length) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
    fast++;
  }

  return slow + 1;
};
// @lc code=end

/**
 * 思路：双指针
 * 1. 借用快慢指针，覆盖掉重复的值
 * 2. 快指针从0开始扫描，慢指针代表最后一个比对的不重复的值，慢指针的下一位是待填充位
 * 3. 最终慢指针的位置就是不重复字符的尾部
 */
