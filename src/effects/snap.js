import xhr from 'xhr'
import {apiUrls} from '../config'

const breakPoint = 800
const canvSize = 640
const targetPct = 0.7
const targetTop = 0.4

export default function snap(state, _, send, done) {
  send('startSnap', done)

  const winW = window.innerWidth
  const winH = window.innerHeight
  const vidW = state.video.videoWidth
  const vidH = state.video.videoHeight

  if (winW >= breakPoint) {
    const cropSize = Math.min(winW, winH) * targetPct
    const sourceSize = (cropSize / Math.max(winW, winH)) * vidW

    state.canvas.width = state.canvas.height = canvSize

    state.ctx.drawImage(
      state.video,
      Math.round(((winW / 2 - cropSize / 2) / winW) * vidW),
      Math.round(((winH * targetTop - cropSize / 2) / winH) * vidH),
      sourceSize,
      sourceSize,
      0,
      0,
      canvSize,
      canvSize
    )
  } else {
    state.canvas.width = vidW
    state.canvas.height = vidH
    state.ctx.drawImage(state.video, 0, 0)
  }

  xhr.post(
    apiUrls.cloudVision,
    {
      json: {
        requests: [
          {
            image: {
              content: state.canvas
                .toDataURL('image/jpeg', 1)
                .replace('data:image/jpeg;base64,', '')
            },
            features: {type: 'LABEL_DETECTION', maxResults: 10}
          }
        ]
      }
    },
    (err, res, body) => {
      let labels
      if (
        err ||
        !body.responses ||
        !body.responses.length ||
        !body.responses[0].labelAnnotations
      ) {
        labels = []
      } else {
        labels = body.responses[0].labelAnnotations
      }
      send('translate', labels, done)
      setTimeout(send.bind(null, 'endSnap', done), 200)
    }
  )
}
