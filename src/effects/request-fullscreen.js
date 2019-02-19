const {body} = window.document

export default function requestFullscreen(state, _, send, done) {
  if (body.requestFullscreen) {
    body.requestFullscreen()
  } else if (body.webkitRequestFullscreen) {
    body.webkitRequestFullscreen()
  } else if (body.mozRequestFullScreen) {
    body.mozRequestFullScreen()
  } else if (body.msRequestFullscreen) {
    body.msRequestFullscreen()
  }
  send('setFullscreen', done)
}
