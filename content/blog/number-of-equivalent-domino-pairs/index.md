---
title: (每日一题)等价多米诺骨牌对的数量
author: shinya
date: 2021-01-26
description: LeetCode 1128. 等价多米诺骨牌对的数量
tags: ['LeetCode', '每日一题', '简单', '数组']
---

## 1128. 等价多米诺骨牌对的数量

给你一个由一些多米诺骨牌组成的列表 `dominoes`。

如果其中某一张多米诺骨牌可以通过旋转 `0` 度或 `180` 度得到另一张多米诺骨牌，我们就认为这两张牌是等价的。

形式上，`dominoes[i] = [a, b]` 和 `dominoes[j] = [c, d]` 等价的前提是 `a==c` 且 `b==d`，或是 `a==d` 且 `b==c`。

在 `0 <= i < j < dominoes.length` 的前提下，找出满足 `dominoes[i]` 和 `dominoes[j]` 等价的骨牌对 `(i, j)` 的数量。

示例：

输入：`dominoes = [[1,2],[2,1],[3,4],[5,6]]`
输出：`1`
提示：

```c
1 <= dominoes.length <= 40000
1 <= dominoes[i][j] <= 9
```

## 解答

```javascript
var numEquivDominoPairs = function(dominoes) {
  let sorted = dominoes.map(item => {
    return item.sort((a, b) => a - b)
  })
  let count = 0
  for (let i = 0; i < dominoes.length; i++) {
    const element = dominoes[i];
    const a = element[0]
    for (let j = i + 1; j < dominoes.length; j++) {
      const element2 = dominoes[j];
      const b = element2[0]
      let same = true 
      if (a === b) {
        for (let index = 1; index < element.length; index++) {
          if(element[index] !== element2[index]){
            same = false
          }
        }
      } else {
        same = false
      }
      if(same) {
        count++
      }
    }
  }
  return count
```
