const CHN_NUM_CHAR = {
  0: '零',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
  10: '十',
}
const CHN_UNIT_CHAR = {
  1: '',
  2: '十',
  3: '百',
  4: '千',
}

export default num => {
  const stringNum = String(num)
  const len = stringNum.length

  return stringNum
    .split('')
    .map((item, index) => {
      let textItem = CHN_NUM_CHAR[item]
      if (item === '0' || (len - index === 2 && item === '1')) {
        textItem = ''
      }
      const unit = item === '0' ? '' : CHN_UNIT_CHAR[len - index]

      return `${textItem}${unit}`
    })
    .join('')
}
