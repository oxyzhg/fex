/*
 * @lc app=leetcode.cn id=206 lang=javascript
 *
 * [206] 反转链表
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
 * @return {ListNode}
 */
var reverseList = function (head) {
  if (head === null || head.next === null) return head;

  const last = reverseList(head.next);

  head.next.next = head;
  head.next = null;

  return last;
};
// @lc code=end

/**
 * 思路：递归
 * 1. 递归终止条件，是链表只有一项的时候
 * 2. 递归处理，把当前节点之后的链表看作是已反转链表，且返回值是反转后的链表 head
 * 3. 此时，当前节点的下一项指向反转后链表的末尾，开始处理反转后的链表和当前项的关系
 * 4. 将反转后链表尾项的下一项指向当前项，当前项的下一项指向 null
 *
 * 思路：迭代
 * 1. prev=null, 同时也是反转后的链表头
 * 2. curr.next, prev, curr 重新向后转换，这中间完成前后调换
 */
