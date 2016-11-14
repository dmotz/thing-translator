import http from 'choo/http'
import {apiUrls} from '../config'

export default function snap(_, state, send, done) {
  send('startSnap', done)
  const canvSize = 640
  const cropSize = 700

  if (window.innerWidth >= 800) {
    state.ctx.drawImage(
      state.video,
      Math.round(((window.innerWidth / 2 - (cropSize / 2)) / window.innerWidth) * state.video.videoWidth),
      Math.round(((window.innerHeight / 2 - (cropSize * 0.6)) / window.innerHeight) * state.video.videoHeight),
      (cropSize / window.innerWidth) * state.video.videoWidth,
      (cropSize / window.innerWidth) * state.video.videoWidth,
      0,
      0,
      canvSize,
      canvSize
    )
  } else {
    state.ctx.drawImage(
      state.video,
      (state.video.videoWidth - state.video.videoHeight) / 2,
      0,
      state.video.videoHeight,
      state.video.videoHeight,
      0,
      0,
      canvSize,
      canvSize
    )
  }

  http.post(
    apiUrls.cloudVision,
    {
      json: {
        requests: [
          {
            image: {
              content: state.canvas.toDataURL('image/jpeg', 1).replace('data:image/jpeg;base64,', '')
            },
            features: {
              type: 'LABEL_DETECTION',
              maxResults: 50
            }
          }
        ]
      }
    },
    (err, res, body) => {
      let labels
      if (!body.responses || !body.responses.length || !body.responses[0].labelAnnotations) {
        labels = []
      } else {
        labels = body.responses[0].labelAnnotations
      }
      send('translate', labels, done)
      setTimeout(send.bind(null, 'endSnap', done), 200)
    }
  )
}
