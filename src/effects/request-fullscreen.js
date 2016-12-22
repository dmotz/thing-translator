export default function requestFullscreen(state, _, send, done) {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen()
  } else if (document.body.webkitRequestFullscreen) {
    document.body.webkitRequestFullscreen()
  } else if (document.body.mozRequestFullScreen) {
    document.body.mozRequestFullScreen()
  } else if (document.body.msRequestFullscreen) {
    document.body.msRequestFullscreen()
  }
  send('setFullscreen', done)
}
