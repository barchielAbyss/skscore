export const countOfListByScreenHeight = (reduceValue, singleHeight, type) => {
  // 根据屏幕高度，获取当前页显示新闻、文章title等信息的条数
  const bodyHeight =
    document.body.clientHeight || document.documentElement.clientHeight

  const lastSpace = (bodyHeight - reduceValue) % singleHeight

  // 计算策略：可自定义类型
  if (type) {
    return Math[type]((bodyHeight - reduceValue) / singleHeight)
  } else if (lastSpace >= Math.round(singleHeight / 2)) {
    // 默认策略为通过留白大小计算
    return Math.ceil((bodyHeight - reduceValue) / singleHeight)
  } else {
    return Math.floor((bodyHeight - reduceValue) / singleHeight)
  }
}

export const getNumRandom = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

export const setShootValueByName = name => {
  switch (name) {
    case '无名小卒':
      return '100'

    case 'Mr赵先生':
      return '67'

    case 'inter珂爸':
      return '34'

    case '织田吉法师':
      return '67'

    default:
      return this.getNumRandom(70, 100)
  }
}

export default {
  countOfListByScreenHeight,
  getNumRandom,
  setShootValueByName,
}
