---
title: 推荐一种 VS Code 上的 ESlint 插件设置
author: shinya
date: 2021-01-21
tags: ["前端", "工具"]
---

> 如果你在工作中使用用 vscode 作为开发工具，并且习惯使用 vetur 或者 prettier 来格式化代码，在遇到 prettier 规则和项目的 eslint 规则不一致的问题时，看这个或许有用。

## VScode

VSCode 提供了两个快捷键来格式化代码：

- Format Document (⇧⌥F) - 格式化当前文件
- Format Selection (⌘K ⌘F) - 格式化选中的内容

你也可以使用 Command Palette (⇧⌘P) 来打开万能菜单调用上述功能。

当然，对于不同类型的文件有不同的格式化逻辑，所以需要安装 [格式化插件](https://marketplace.visualstudio.com/search?target=VSCode&category=Formatters&sortBy=Downloads) 来对代码进行格式化，你可以在 VS Code 的插件一栏搜索 `category:formatters` 来选择你喜欢的插件，这里我们前端一般用 Prettier 或者 ESLint。

## ESLint 插件

ESLint 插件是我推荐的一个 VS Code 格式化插件，原因是我们在多人协作的项目中肯定会用到 ESLint 来规定代码风格和样式，如果你用别的插件，比如 Prettier， 那就有可能你自己的 Prettier 规则会和团队的 ESLint 规则冲突，为了解决这个问题，你就需要一直维护你的 Prettier 规则，那又是何苦呢。

ESLint 插件默认会从当前打开文件夹里寻找 ESlint 库，如果没找到就会去找全局的，所以你要么在当前项目使用 `npm install eslint` 安装了 ESLint 或者使用 `npm install -g eslint` 在全局安装了 ESLint。

## 如何配置

推荐打开 VS Code 的 `settings.json` 配置文件，加入如下配置：

```json
{
  "eslint.format.enable": true,
  "eslint.codeActionsOnSave.mode": "problems",
  "[vue]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```

其中 `"eslint.format.enable": true` 这一项配置是必要的，这让 VS Code 在执行 format 操作的时候能找到 ESLint 插件。

`eslint.codeActionsOnSave` 这一项可以配置自动格式化，不过建议你关闭它，这样可以自动格式化所有格式化插件能格式化的东西：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

注意，老版本的插件是这样配置的：

```json
{
  "eslint.autoFixOnSave": true
}
```

很多博客推荐这样配置，可是这样的格式已经过期了，请使用前一种配置方式。

## 使用 Vetur

如果你使用 Vetur 作为格式化代码插件，那么加入以下代码禁用 Vetur 自带的 ESLinter：

```json
{
  "vetur.validation.template": false
}
```

## 参考链接

- [VS Code 官网文档](https://code.visualstudio.com/docs/editor/codebasics#_formatting)
- [ESLint 插件官方说明](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Vetur 使用说明](https://github.com/octref/veturpack)
