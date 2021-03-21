/*
 * @lc app=leetcode.cn id=2 lang=javascript
 *
 * [2] 两数相加
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  let list = new ListNode(0);
  let head = list;

  let cur1 = l1;
  let cur2 = l2;

  let sum;
  let cover = 0;

  while (cur1 || cur2 || cover) {
    sum = cover;

    if (cur1) {
      sum += cur1.val;
      cur1 = cur1.next;
    }

    if (cur2) {
      sum += cur2.val;
      cur2 = cur2.next;
    }

    cover = Number(sum > 9); // 更新进位

    head.next = new ListNode(sum % 10);
    head = head.next;
  }

  return list.next;
};
// @lc code=enda
