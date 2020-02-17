import Vue from 'vue'

export default function createPortal(options) {
  const {
    context,
    component,
    config = { autoDestroy: true },
    children,
    ...data
  } = options
  const container = document.createElement('div')

  if (context) {
    if (!context._isVue) {
      throw new TypeError('context is not a Vue instance')
    }
    context.$el.appendChild(container)
  }

  let instance = new Vue({
    el: container,
    name: 'PortalContainer',
    parent: context,
    components: {
      PortalComponent: component,
    },
    data() {
      return {
        payload: data,
      }
    },
    methods: {
      update(payload) {
        Object.keys(payload).forEach(key => {
          this.$set(this.payload, key, payload[key])
        })
      },
    },
    render(h) {
      return h(
        'portal-component',
        {
          ref: 'component',
          ...this.payload,
        },
        children
      )
    },
  })

  if (config.autoDestroy && context) {
    context.$on('hook:beforeDestroy', () => {
      instance.$destroy()
      instance.$el && instance.$el.remove()
      instance = null
    })
  }

  return instance
}
