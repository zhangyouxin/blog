---
title: 动态规划（一），菲波那切数列的 3 种写法
author: shinya
date: 2021-01-11
tags: ['算法', '动态规划']
---

茴香豆的茴字有 4 种写法，那么菲波那切数列的实现方式有几种？

没有标准答案，本文主要介绍 3 种实现方式和比较他们的优劣，以及用简单的方式引入动态规划。

## 菲波那切数列

斐波那契数列是这样一个数列：1，1，2，3，5，8，13，21 ......

定义为，第一个和第二个数字是 1， 从第 3 个到 n（n属于正无穷）个数字为前一个数和前前一个数的和。

若以 `f(n)` 来表示第 `n` 个数， 则 `f(n) = f(n - 1) + f(n + 1)`，那么由此公式可得出：

- `f(1) = 1`
- `f(2) = 1`
- `f(3) = 2`
- `f(4) = 3`
- ....

## 基础 JS 实现

```javascript
function fib(n){
  if (n === 1 || n ===2 ){
    return 1;
  }
  return fib(n-1) + fib(n-2);
}
```

这是一个时间复杂度为 `O(pow(2,n))` 的解法，并且会有很深的调用栈，随着 `n` 的增加，资源消耗成指数上涨。

## memoize

注意 memoize 不是 memorize， 前者更像是把上一次计算结果缓存起来。

```javascript
let memo = [];
function fib(n) {
  if(memo[n] !== undefined) {
    return memo[n]
  }
  if(n === 1 || n === 2){
    memo[n] = 1;
    return 1
  }
  memo[n] = fib(n-1) + fib(n-2)
  return memo[n]
}
```

这样的解法不用重复的调用已经算出的 `fib(n)`，节省了时间复杂度，现在的时间复杂度为 `O(n+1)`

## 自底向上

通过观察得出，很明显，需要计算 `fib(n)` 首先必须知道 `fib(n-1)` 和 `fib(n-2)` 的值，所以可以先从 `1` 开始计算 `fib(1), fib(2)...fib(n)`

```javascript
let memo = []
function fib(n) {
  memo[1] = 1;
  memo[2] = 1;
  for (let index = 3; index <= n; index++) {
    memo[index] = memo[index-1] + memo[index-2];
  }
  return memo[n]
}
```

自底向上的时间复杂度为 `O(n)`， 并且没有涉及到很深的函数调用栈。

## 动态规划

可是这根动态规划有什么关系呢？关系很大，下一期继续说。
