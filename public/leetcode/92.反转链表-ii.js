/*
 * @lc app=leetcode.cn id=92 lang=javascript
 *
 * [92] 反转链表 II
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
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {

  let start = head; // 开始的节点
  let curr = head;
  let i = 1;

  while (i < left) {
    start = curr;
    curr = curr.next;
    i++;
  }

  let prev = null;
  let tail = curr;

  while (i <= right) {
    let temp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = temp;
    i++;
  }

  start.next = prev;
  tail.next = curr;

  return left === 1 ? prev : head;
};
// @lc code=end

/**
 * 迭代解法：
 * 1. 先迭代快进到 left 指定的位置，保存相关节点，用于后续拼接链表
 * 2. 从 left 开始迭代反转链表
 * 3. 链表反转后首节点对应 prev 变量，尾节点对应 curr
 * 4. 将反转后的三段链表拼接并返回
 */