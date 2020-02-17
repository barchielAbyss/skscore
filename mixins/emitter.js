function broadcast(eventName, ...params) {
  this.$children.forEach(child => {
    const events = child._events[eventName]

    if (events) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      broadcast.apply(child, [eventName].concat(params))
    }
  })
}

export default {
  methods: {
    $dispatch(eventName, ...params) {
      let target = this
      let events = target._events[eventName]
      while (target && !events) {
        target = target.$parent

        if (target) {
          events = target._events[eventName]
        }
      }

      if (target && events) {
        target.$emit.apply(target, [eventName].concat(params))
      }
    },
    $broadcast(eventName, ...params) {
      broadcast.call(this, eventName, ...params)
    },
  },
}
