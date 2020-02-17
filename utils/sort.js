import { chineseToPinYin } from './pinyin'

const EN_KEYS = [
  {
    id: 'A~E',
    value: ['A', 'B', 'C', 'D', 'E'],
  },
  {
    id: 'F~J',
    value: ['F', 'G', 'H', 'I', 'J'],
  },
  {
    id: 'K~O',
    value: ['K', 'L', 'M', 'N', 'O'],
  },
  {
    id: 'P~T',
    value: ['P', 'Q', 'R', 'S', 'T'],
  },
  {
    id: 'U~Z',
    value: ['U', 'V', 'W', 'X', 'Y', 'Z'],
  },
]

export const pinyinSort = (list = [], key = 'value') => {
  const enMap = list.reduce((prev, item) => {
    const itemKey = EN_KEYS.find(keyItem => {
      const itemPinyin = chineseToPinYin((item[key] || '-').slice(0, 1))
      const first = itemPinyin.slice(0, 1)
      return keyItem.value.includes(first ? first.toUpperCase() : '')
    })
    const keyId = itemKey ? itemKey.id : '*'
    if (!prev[keyId]) {
      prev[keyId] = [item]
    } else {
      prev[keyId].push(item)
    }

    return prev
  }, {})

  const enKeys = Object.keys(enMap).sort()

  const res = {}
  enKeys.forEach(key => {
    res[key] = enMap[key]
  })

  return res
}
