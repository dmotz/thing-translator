import xhr from 'xhr'
import {apiUrls} from '../config'

const breakPoint = 800
const canvSize   = 640
const targetPct  = 0.7
const targetTop  = 0.4


function check_local_storage(){
var num = 0
  for(var i in localStorage)
{
    num = num + 1;
}
return num
}

export default function snap(state, _, send, done) {
  send('startSnap', done)

  const winW = window.innerWidth
  const winH = window.innerHeight
  const vidW = state.video.videoWidth
  const vidH = state.video.videoHeight

  if (winW >= breakPoint) {
    const cropSize   = Math.min(winW, winH) * targetPct
    const sourceSize = (cropSize / Math.max(winW, winH)) * vidW

    state.ctx.drawImage(
      state.video,
      Math.round(((winW / 2 - (cropSize / 2)) / winW) * vidW),
      Math.round(((winH * targetTop - (cropSize / 2)) / winH) * vidH),
      sourceSize,
      sourceSize,
      0,
      0,
      canvSize,
      canvSize
    )
  } else {
    state.ctx.drawImage(
      state.video,
      (vidW - vidH) / 2,
      0,
      vidH,
      vidH,
      0,
      0,
      canvSize,
      canvSize
    )
  }

  xhr.post(
    apiUrls.cloudVision,
    {
      json: {
        requests: [
          {
            image: {
              content: state.canvas.toDataURL('image/jpeg', 1).replace('data:image/jpeg;base64,', '')
            },
            features: {type: 'LABEL_DETECTION', maxResults: 10}
          }
        ]
      }
    },
    (err, res, body) => {
      let labels
      if (err || !body.responses || !body.responses.length || !body.responses[0].labelAnnotations) {
        labels = []
      } 

      else {
        labels = body.responses[0].labelAnnotations
      }
      var i = 0;
      console.log("things in local storage = " + check_local_storage())
      
      var json_row = {};
      for (i = 0; i < JSON.stringify(labels).length; i++) {

      if (JSON.stringify(labels[i]) != undefined){
      var description = JSON.parse(JSON.stringify(labels[i]))['description']
      var score = JSON.parse(JSON.stringify(labels[i]))['score']
      json_row[score] = description

      // console.log("I got some stuff " + JSON.parse(JSON.stringify(labels[i]))['description'])
      // console.log("It scored at " + JSON.parse(JSON.stringify(labels[i]))['score'])
      }

      }
      var key = check_local_storage() + 1
      console.log("setting " + key + " to " + JSON.stringify(json_row))
      localStorage.setItem(key, JSON.stringify(json_row));

      send('translate', labels, done)
      setTimeout(send.bind(null, 'endSnap', done), 200)
    }
  )
}
