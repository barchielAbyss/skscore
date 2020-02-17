const scrollEvent = binding => {
  const { load, disable, distance } = binding.value
  const windowY = window.scrollY || window.pageYOffset

  if (
    windowY + window.innerHeight + (distance || 200) >=
    document.body.clientHeight
  ) {
    if (!disable) {
      load()
    }
  }
}

export default {
  bind(el, binding) {
    window.addEventListener('scroll', scrollEvent.bind(this, binding))
  },
  unbind(el, binding) {
    window.removeEventListener('scroll', scrollEvent.bind(this, binding))
  },
}
