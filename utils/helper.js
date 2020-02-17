/* eslint-disable no-void */
import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'
import isString from 'lodash/isString'
import isNaN from 'lodash/isNaN'

/**
 * 判断组件实例是否是某个类型
 *
 * @param {Vue} vm 组件实例
 * @param {string} type 类型
 * @returns {boolean} 组件实例是否是指定的类型
 */
export function isType(vm, type) {
  return get(vm, '$options.uiTypes', []).includes(type)
}

/**
 * 检查组件是否是指定type或根的顶级type类型
 *
 * @param {Vue} vm 组件实例
 * @param {string} type 组件uiType
 * @param {string=} scopeType 指定查找的父组件uiTypes范围
 * @return {boolean} 检查结果
 */
export function isTopMostOfType(vm, type, scopeType) {
  let parent = vm.$parent
  while (parent && !isType(parent, type)) {
    if (scopeType && isType(parent, scopeType)) {
      parent = null
      break
    }

    parent = parent.$parent
  }
  return !parent
}

export function getListeners(events, vm) {
  return events.reduce((listeners, type) => {
    listeners[type] = (...args) => {
      vm.$emit(type, ...args)
    }
    return listeners
  }, {})
}

export function toArray(value, supportEmptyString = true) {
  if (isUndefined(value) || isNull(value)) {
    return []
  }

  const result = Array.isArray(value) ? value : [value]

  if (!supportEmptyString) {
    return result.filter(r => r !== '')
  }

  return result
}

export function unit(num, unit) {
  if (isString(num) && isNaN(Number(num))) {
    return num
  }
  return num + unit
}

export const getTarget = node => {
  if ([null, false].includes(node)) {
    return false
  }
  if (node instanceof window.Node) {
    return node
  }
  if ([void 0, true].includes(node)) {
    return document.body
  }
  return document.querySelector(node)
}

export const getNumberArg = (modifiers, defaultTime) => {
  let timing
  Object.keys(modifiers).find(key => {
    const keyNum = Number(key)
    if (!isNaN(keyNum) && keyNum >= 0 && modifiers[key]) {
      timing = keyNum
      return true
    }
  })
  return timing != null ? timing : defaultTime
}
