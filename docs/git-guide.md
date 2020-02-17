# Git Commit Message Style Guide

### Commit Messages
Commit Messages由三个不同的部分组成:标题、可选的主体和可选的页脚

```
type: subject

body

footer
```
##### The Type
* **feat**: 一个新的功能
* **fix**: 一次bug的修复
* **docs**: 更改了文档
* **style**: 格式化或者处理了分号等
* **refactor**: 重构了代码
* **test**: 修改、添加测试代码
* **chore**: 修改了配置文件或者编译文件

##### The Subject
主题不要超过50个字，不要用句号结尾。 描述这次提交做了什么

##### The Body
主体是可选的。 因为不是每次提交都足够复杂到需要详细的描述
主体作为描述这次提交的一些解释和上下文
用于解释为什么提交

##### The Footer
页脚是可选的。 用于引用问题跟踪ID


##### Example Commit Message
```
fix: 用户无法正常注册

密码强度校验规则里需要用户输入密码含有特殊字符，但是没有特殊字符也有错误提示。导致用户不知道自己输入的密码不符合要求。
已经通过增加错误提示的方式来告知用户密码格式的问题

TAPD: #1120036241001012201

```

