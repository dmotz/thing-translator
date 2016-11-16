const getUserMedia = (() => {
  const fn = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
  return fn ? fn.bind(navigator) : null
})()

export default function requestCamera(_, state, send, done) {
  if (state.cameraReady) {
    return
  }

  if (!getUserMedia) {
    return send('cameraError', done)
  }

  const sourceSupport = MediaStreamTrack && MediaStreamTrack.getSources

  const initCameraRequest = sources => {
    let source

    if (sourceSupport) {
      source = sources.find(s => s.facing === 'environment')

      if (!source) {
        source = sources.find(s => s.kind === 'video')
      }
    }

    getUserMedia(
      {
        audio: false,
        video: sourceSupport && source ? {optional: [{sourceId: source.id}]} : true
      },
      stream => {
        const canvas    = document.getElementById('canvas')
        const videoEl   = document.getElementById('video')
        const streamUrl = URL.createObjectURL(stream)

        videoEl.src = streamUrl

        send(
          'setStream',
          {
            stream: streamUrl,
            video:  videoEl,
            ctx:    canvas.getContext('2d'),
            canvas
          },
          done
        )
      },
      send.bind(null, 'cameraError', done)
    )
  }

  if (sourceSupport) {
    MediaStreamTrack.getSources(initCameraRequest)
  } else {
    initCameraRequest()
  }
}
