const formatToJson = value => {
  return (
    value &&
    (Object.prototype.toString.call(value) === '[object Object]' ||
      Array.isArray(value))
  )
}

const formatData = data => {
  const rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/

  if (+data + '' === data) {
    // number
    return +data
  } else if (rbrace.test(data)) {
    // json
    try {
      return JSON.parse(data)
    } catch (err) {
      return {}
    }
  } else {
    return data
  }
}

const getStorageFunc = (type = 'local') => {
  return {
    local: window.localStorage,
    session: window.sessionStorage,
  }[type]
}

export default {
  put(key, value, type) {
    const isJson = formatToJson(value)
    getStorageFunc(type).setItem(key, isJson ? JSON.stringify(value) : value)
  },

  get(key, type) {
    const ops = typeof key === 'object' ? key : { key, type }

    const data = getStorageFunc(ops.type).getItem(ops.key)

    if (data === null && ops.defaultValue !== undefined) {
      return ops.defaultValue
    }

    return formatData(data)
  },

  remove(key, type) {
    return getStorageFunc(type).removeItem(key)
  },

  clear(type) {
    getStorageFunc(type).clear()
  },

  type: {
    local: 'local',
    session: 'session',
  },
}
