import dayjs from 'dayjs'

const WEEK_LIST = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
}

export default ({ list, key, serverTime, format = 'YYYY年M月D日' } = {}) => {
  return list.reduce((prev, item) => {
    const itemTime = dayjs(Number(item[key]))
    const timeName = `周${WEEK_LIST[itemTime.get('day')]} ${itemTime.format(
      format
    )}`
    const timeId = itemTime.format('YYYY M D')
    return {
      ...prev,
      [timeId]: {
        name: timeName,
        isToday: serverTime.isSame(itemTime, 'day'),
        list: timeId in prev ? [...prev[timeId].list, item] : [item],
      },
    }
  }, {})
}
