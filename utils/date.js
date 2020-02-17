import dayjs from 'dayjs'

// const DATES_INTO = {
//   second: '秒',
//   minute: '分钟',
//   hour: '小时',
//   day: '天',
//   month: '月',
//   year: '年',
// }

export const format = (time, format = 'MM-DD HH:mm') => {
  // time 取值范围 string, date, unix 时间
  return dayjs(Number(time)).format(format)
}

export const diffTime = (startTime, endTime, format = 'minute') => {
  // format 可选 [second, minute, hour, day, month, year]
  const start = dayjs(startTime)
  const end = dayjs(endTime)

  return start.diff(end, format)
}

export const unixTime = time => {
  return dayjs(time).unix()
}
