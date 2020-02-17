### 项目结构

```
├── index.html
├── main.js
├── api
│   └── ... # 抽取出API请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── common.js          # 我们组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── getters.js        # 根级别的 getters
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── xx.js
        └── xxx.js
```
### 什么情况下使用 Vuex
*

### modules
* 使用 `namespaced` 来隔离modules

### State
* 控制 `State` 的颗粒度，要考虑清楚更新 `State` 情况

### Getter
* 尽量找到 `State` 的数据关联，使用 `Getter` 来派生状态

### Mutation
* 使用下划线加大写的命名方式，如：`SET_MAIL_SETTINGS`

### Action
* 使用首字母大写的命名方式，如：`GetMailConfig`

### 组件中使用
* components 通用业务组件级别因为复用的原因不应该使用Vuex
* 使用 `mapState` `mapGetters` `mapActions`来组织代码
* 不应该使用 `Mutations`来修改 `state`, 使用使用 `Action`
* 当你在拿不到 `$vm` 的场景下需要使用`store`，你可以 `import store from '@crm/store'`， 比如: `beforeRouteEnter`

### 在非Vue组件中使用
* `import store from '@crm/store'` 的方式来使用store

### 在new Vue的新实例中使用
* `import store from '@crm/store'` 的方式来使用store



