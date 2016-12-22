const {MediaStreamTrack, URL} = window
const {mediaDevices}          = navigator
const sourceEnumSupport       = mediaDevices && mediaDevices.enumerateDevices
const streamTrackSupport      = MediaStreamTrack && MediaStreamTrack.getSources
const sourceSupport           = sourceEnumSupport || streamTrackSupport

let attemptedTwice = false

const getUserMedia = (() => {
  const fn = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
  return fn ? fn.bind(navigator) : null
})()


const findBestSource = sources => {
  let source = null

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

  return source
}


const activateCamera = (sources, send, done) => {
  const source = findBestSource(sources)

  getUserMedia(
    {
      audio: false,
      video: source
        ? {optional: [{sourceId: sourceEnumSupport ? source.deviceId : source.id}]}
        : true
    },
    stream => {
      if (sourceEnumSupport && !source && !attemptedTwice) {
        attemptedTwice = true
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop())
          enumerateDevices(send, done)
        }, 1)
        return
      }

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
    _ => send('cameraError', done)
  )
}


const enumerateDevices = (send, done) =>
  mediaDevices.enumerateDevices()
    .then(sources => activateCamera(sources, send, done))
    .catch(_ => activateCamera(null, send, done))


export default function requestCamera(state, _, send, done) {
  if (state.cameraReady) {
    return
  }

  if (!getUserMedia || !URL) {
    return send('cameraError', done)
  }

  if (sourceEnumSupport) {
    enumerateDevices(send, done)
  } else if (streamTrackSupport) {
    MediaStreamTrack.getSources(sources => activateCamera(sources, send, done))
  } else {
    activateCamera(null, send, done)
  }
}
