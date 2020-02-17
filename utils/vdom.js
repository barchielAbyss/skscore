export function isVNode(node) {
  return (
    node !== null &&
    typeof node === 'object' &&
    hasOwnProperty.call(node, 'componentOptions')
  )
}
