import { sortBy } from 'lodash'

const AH_KEYS = {
  0: 'h',
  1: 'g',
  2: 'l',
  3: 'hi',
  4: 'gi',
  5: 'li',
}

const HDA_KEYS = {
  0: 'w',
  1: 'd',
  2: 'l',
  3: 'wi',
  4: 'di',
  5: 'li',
}

const BASKETBALL_HDA_KEYS = {
  0: 'h',
  1: 'g',
  3: 'hi',
  4: 'gi',
}

const OU_KEYS = {
  0: 'b',
  1: 's',
  2: 't',
  3: 'bi',
  4: 'si',
  5: 'ti',
}

export const uniqByKey = (list = []) => {
  const uniqList = list.reduce((prev, item) => {
    const _item = prev.find(_ => _.value === item.value)
    if (!_item) {
      prev.push({
        ...item,
        total: 1,
        ids: [item.id],
      })
    } else {
      _item.total++
      _item.ids.push(item.id)
    }

    return prev
  }, [])

  return sortBy(uniqList, 'value')
}

export const exponentialArray2Object = (data = {}, type) => {
  let { ah, hda, ou } = data
  ah = ah || []
  hda = hda || []
  ou = ou || []

  const ahObj = {}
  const hdaObj = {}
  const ouObj = {}

  Object.entries(AH_KEYS).forEach(([index, key]) => {
    const value = Number(ah[index])
    ahObj[key] =
      Number.isNaN(value) || ah[index] === '' ? '' : Number(value).toFixed(2)
  })
  Object.entries(
    type === 'basketball' ? BASKETBALL_HDA_KEYS : HDA_KEYS
  ).forEach(([index, key]) => {
    const value = Number(hda[index])
    hdaObj[key] =
      Number.isNaN(value) || hda[index] === '' ? '' : Number(value).toFixed(2)
  })
  Object.entries(OU_KEYS).forEach(([index, key]) => {
    const value = Number(ou[index])
    ouObj[key] =
      Number.isNaN(value) || ou[index] === '' ? '' : Number(value).toFixed(2)
  })

  return {
    ah: ahObj,
    hda: hdaObj,
    ou: ouObj,
  }
}
