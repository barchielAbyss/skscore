[`vue-guide`](https://cn.vuejs.org/v2/style-guide/index.html)

1. vue模板语法排序规则

  native > slot > v- (指令) > : (动态属性) > @ (事件) > other (杂项)

  ```
  <div id="example" class="example"
    v-if="example"
    :example="example"
    @click="example"
    transition="channel"
      transition-mode="out-in">
  </idv>
  ```
2. 使用 `v-for of` 而不要使用 `v-for in`
3. 不要使用 `dispatch` 和 `broadcast`
4. 父组件往子组件传递事件使用 `props` 特殊情况可以使用 `v-on`

  ```
  <child :handle-it="handleIt"></child>
  ```
  ```
  <child v-on:child-msg="handleIt"></child>
  ```
5: 组件中引入其他组件统一声明

  ```
  import component from 'crm'

  {
    components: {
      component
    }
  }
  ```

6: 组件内属性声明顺序

  ```
  {
    name,
    components,
    props,
    data,
    route,
    ...Misc,
    ...Lifecycle Hooks,
    methods
  }
  ```

6: Vue模块的书写顺序

  ```
  <template></template>
  <script></script>
  <style></style>
  ```

