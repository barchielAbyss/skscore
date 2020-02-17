import dayjs from 'dayjs'
import { diffTime } from '@/utils/date'

// 比赛事件列表
export const MATCH_EVENT_LIST = {
  0: '进球',
  1: '点球',
  2: '乌龙球',
  3: '黄牌',
  4: '红牌',
  5: '两黄变一红',
  8: '点球射失',
  300: '换人事件',
  101: '比赛开始',
  102: '中场',
  104: '完场',
  107: '加时开始',
  110: '加时结束',
}

export const MATCH_STATUS_LIST = () => {
  // （0、13、15、17 同为未开始，7、8、9 为加时，4、10、12 完场）
  return {
    0: '未开始',
    1: '上半场',
    2: '中场',
    3: '下半场',
    4: '完场',
    5: '中断',
    6: '取消',
    7: '45+’',
    8: '90+’',
    9: '加时',
    10: '完场',
    11: '点球大战',
    12: '完场',
    13: '延期',
    14: '腰斩',
    15: '待定',
    16: '金球',
    17: '未开始',
  }
}

export const BASKETBALL_MATCH_STATUS_LIST = () => {
  return {
    0: '未开始',
    1: '第一节',
    2: '第一节完',
    3: '第二节',
    4: '第二节完',
    5: '第三节',
    6: '第三节完',
    7: '第四节',
    8: '第四节完',
    9: '完场',
    10: '加时',
    11: '完场(加)',
    12: '中断',
    13: '取消',
    14: '延期',
    15: '腰斩',
    16: '待定',
  }
}

// 亚盘 、 大小球 计算器
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

const number2chn = num => {
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

export const footballMatchId2Status = id => {
  const status = MATCH_STATUS_LIST()[id]
  return status || '未知'
}

export const footballOngoing = id => {
  return [1, 2, 3, 7, 8, 9, 11, 16].includes(Number(id))
}

export const footballMatchEnd = id => {
  return [4, 6, 10, 12, 14].includes(Number(id))
}

export const fetchFootballMatchTime = (status, startTime, serverTime) => {
  const runTime = Number(startTime)
    ? diffTime(serverTime, dayjs(Number(startTime)), 'minute')
    : ''

  if ([1, 9].includes(Number(status))) {
    return runTime
  } else if ([3].includes(Number(status))) {
    return runTime + 45
  }

  if ([5, 6, 7, 8, 14, 16].includes(Number(status))) {
    return footballMatchId2Status(status)
  } else {
    return footballMatchId2Status(status).slice(0, 1)
  }
}

export const footballAhYield = ah => {
  if (!ah && String(ah) !== '0') {
    return '-'
  }
  if (Number(ah) === 1) {
    return '一球'
  }

  const yieldAh = String(Number(ah))

  const stringYield = ~yieldAh.indexOf('-') ? yieldAh : `+${yieldAh}`
  const [pm, integer, decimal] = stringYield.match(/[+-]|[^.]+/g)
  const minusText = pm === '-' ? `<span style="color: #E1243B;">*</span>` : ''

  let res = `${minusText}${number2chn(integer)}`

  if (integer === '0') {
    res = '平'
  }

  if (decimal === '25') {
    if (integer === '0') {
      res = `${minusText}平/半`
    } else {
      res += `/${res}半`
    }
  }

  if (decimal === '5') {
    if (integer === '0') {
      res = `${minusText}半`
    } else {
      res += '半'
    }
  }

  if (decimal === '75') {
    res = integer === '0' ? `${minusText}半` : `${res}半`
    res = `${res}/${number2chn(Number(integer) + 1)}`
  }

  return res
}

export const footballOuYield = ou => {
  if (!ou) {
    return '-'
  }

  const stringYield = String(Number(ou))
  const [integer, decimal] = stringYield.split('.')

  let res = stringYield
  if (decimal === '25') {
    res = `${integer}/${integer}.5`
  }

  if (decimal === '75') {
    res = `${integer}.5/${Number(integer) + 1}`
  }

  return res
}

export const fetchTeamIsWin = (homeTeamId, curTeamId, result) => {
  const isHomeTeam = Number(homeTeamId) === Number(curTeamId)

  // winType -  1 胜利 , 2平局, 3失败, 0 未知
  let winType = 0
  if (Number(result) !== 0) {
    if (Number(result) === 2) {
      winType = 2
    } else if (isHomeTeam) {
      winType = Number(result)
    } else {
      winType = Number(result) === 1 ? 3 : 1
    }
  }

  return {
    isHomeTeam,
    result: winType,
  }
}

export const basketballMatchId2Status = (id, type) => {
  const status = BASKETBALL_MATCH_STATUS_LIST()[id] || '未知'
  if (type === 'short' && [0, 9, 10, 11, 14, 16].includes(Number(id))) {
    return status.slice(0, 1)
  } else {
    return status
  }
}

export const basketballOngoing = id => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 10].includes(Number(id))
}

export const basketballMatchEnd = id => {
  return [9, 11, 13, 15].includes(Number(id))
}

export const fetchBasketBallTeamIsWin = (homeTeamId, curTeamId, result) => {
  const isHomeTeam = Number(homeTeamId) === Number(curTeamId)
  // winType -  1 胜利 , 2失败, 0 未知
  let winType = 0
  if (Number(result) !== winType) {
    if (isHomeTeam) {
      winType = Number(result)
    } else {
      winType = Number(result) === 1 ? 2 : 1
    }
  }

  return {
    isHomeTeam,
    result: winType,
  }
}
