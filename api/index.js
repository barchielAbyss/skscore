import get from './get'
import post from './post'

const reduceApiPatch = list => {
  return Object.entries(list).reduce((blockPrev, [blockId, blockValue]) => {
    const apiPath = blockId === 'article' ? '/node' : '/api'

    blockPrev[blockId] = Object.entries(blockValue).reduce(
      (prev, [key, url]) => {
        prev[key] = `${apiPath}${url}`
        return prev
      },
      {}
    )

    return blockPrev
  }, {})
}

export default {
  get: reduceApiPatch(get),
  post: reduceApiPatch(post),
}
