const {MediaStreamTrack} = window
const {mediaDevices} = navigator
const sourceEnumSupport = mediaDevices && mediaDevices.enumerateDevices
const streamTrackSupport = MediaStreamTrack && MediaStreamTrack.getSources
const sourceSupport = sourceEnumSupport || streamTrackSupport

let attemptedTwice = false

const getUserMedia = (() => {
  const fn =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia
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

const activateCamera = (send, done, noConstraint) => {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: noConstraint || {facingMode: 'environment'}
    })
    .then(stream => cameraSuccess(stream, send, done))
    .catch(err => {
      if (!noConstraint && err.name === 'ConstraintNotSatisfiedError') {
        return activateCamera(send, done, true)
      }
      console.error(err)
      send('cameraError', done)
    })
}

const activateCameraLegacy = (sources, send, done) => {
  const source = findBestSource(sources)

  getUserMedia(
    {
      audio: false,
      video: source
        ? {
            optional: [
              {sourceId: sourceEnumSupport ? source.deviceId : source.id}
            ]
          }
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
      cameraSuccess(stream, send, done)
    },
    err => {
      console.error(err)
      send('cameraError', done)
    }
  )
}

const cameraSuccess = (stream, send, done) => {
  const canvas = window.document.getElementById('canvas')
  const videoEl = window.document.getElementById('video')

  videoEl.srcObject = stream

  send(
    'setStream',
    {
      video: videoEl,
      ctx: canvas.getContext('2d'),
      stream,
      canvas
    },
    done
  )
}

const enumerateDevices = (send, done) =>
  mediaDevices
    .enumerateDevices()
    .then(sources => activateCameraLegacy(sources, send, done))
    .catch(() => activateCameraLegacy(null, send, done))

export default function requestCamera(state, _, send, done) {
  if (state.cameraReady) {
    return
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return activateCamera(send, done)
  }

  if (!getUserMedia) {
    return send('cameraError', done)
  }

  if (sourceEnumSupport) {
    enumerateDevices(send, done)
  } else if (streamTrackSupport) {
    MediaStreamTrack.getSources(sources =>
      activateCameraLegacy(sources, send, done)
    )
  } else {
    activateCameraLegacy(null, send, done)
  }
}
