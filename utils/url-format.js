export const urlParams2Path = (url, params) => {
  let realUrl = url
  const hasUrlParams = url.match(/\{(.+?)\}/g)
  if (hasUrlParams) {
    realUrl = url.replace(/\{(.+?)\}/g, item => {
      const value = item.replace(/[{}]/g, '')
      if (params[value]) {
        return `${params[value]}`
      }
      return value
    })
  }

  return realUrl
}
