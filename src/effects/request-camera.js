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

  const sourceEnumSupport  = navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
  const streamTrackSupport = MediaStreamTrack && MediaStreamTrack.getSources

  const initCameraRequest = sources => {
    let source
    const sourceSupport = sourceEnumSupport || streamTrackSupport

    if (sourceSupport && sources && sources.length) {

      if (sourceEnumSupport) {
        for (let i = 0; i < sources.length; i++) {
          const candidate = sources[i]

          if (candidate.kind === 'videoinput') {
            if (typeof candidate.getCapabilities === 'function') {
              const capabilities = candidate.getCapabilities()

              if (capabilities && capabilities.facingMode === 'environment') {
                source = candidate
                break
              }
            }

            if (/facing back/i.test(candidate.label)) {
              source = candidate
              break
            }
          }
        }
      } else {
        source = sources.find(s => s.facing === 'environment')
        if (!source) {
          source = sources.find(s => s.kind === 'video')
        }
      }
    }

    getUserMedia(
      {
        audio: false,
        video: source
          ? {optional: [{sourceId: sourceEnumSupport ? source.deviceId : source.id}]}
          : true
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

  if (sourceEnumSupport) {
    navigator.mediaDevices.enumerateDevices()
      .then(initCameraRequest)
      .catch(_ => initCameraRequest(null))
  } else if (streamTrackSupport) {
    MediaStreamTrack.getSources(initCameraRequest)
  } else {
    initCameraRequest(null)
  }
}
