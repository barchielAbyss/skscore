export default ({ time = 2 * 60 * 1000, wakeUp }) => {
  let oldTime = new Date().getTime()
  function checkPageActive() {
    const newTime = new Date().getTime()

    if (newTime - oldTime > time) {
      wakeUp && wakeUp()
    }
    oldTime = newTime
  }
  return setInterval(checkPageActive, 1000)
}
