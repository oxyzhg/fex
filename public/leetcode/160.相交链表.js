/*
 * @lc app=leetcode.cn id=160 lang=javascript
 *
 * [160] 相交链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  let a = headA;
  let b = headB;

  while (a !== b) {
    a = !a ? headB : a.next;
    b = !b ? headA : b.next;
  }

  return a;
};
// @lc code=end

/**
 * 思路：
 * 1. 利用 ListA+ListB 长度一致，并且其中某段必定重合
 * 2. 注意处理两个链表在相交前，长度不相同的问题
 */
