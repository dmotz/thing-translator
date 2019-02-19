require('array.prototype.find').shim()
require('array.prototype.findindex').shim()

import choo from 'choo'
import requestCamera from './effects/request-camera'
import requestFullscreen from './effects/request-fullscreen'
import snap from './effects/snap'
import translate from './effects/translate'
import baseView from './views/base-view'
import {langList} from './config'

const app = choo()

app.model({
  state: {
    activeView: 'main',
    cameraReady: false,
    cameraError: false,
    stream: null,
    video: null,
    ctx: null,
    canvas: null,
    isSnapping: false,
    firstTime: true,
    fullscreen: false,
    label: '',
    translation: '',
    activeLang: langList[0],
    targetLang: 'english',
    guesses: '',
    rotateTerms: true
  },
  subscriptions: [
    (send, done) =>
      window.document.addEventListener('DOMContentLoaded', () =>
        send('requestCamera', done)
      )
  ],
  reducers: {
    showList: () => ({activeView: 'list'}),
    showMain: () => ({activeView: 'main'}),
    cameraError: () => ({cameraError: true}),
    startSnap: () => ({isSnapping: true, firstTime: false}),
    endSnap: () => ({isSnapping: false}),
    setFullscreen: () => ({fullscreen: true}),
    setLabelPair: (_, labels) => labels,
    changeLang: (_, lang) => ({
      activeView: 'main',
      activeLang: lang,
      label: '',
      translation: ''
    }),
    setStream: (_, {stream, video, ctx, canvas}) => ({
      cameraReady: true,
      stream,
      video,
      ctx,
      canvas
    })
  },
  effects: {
    requestCamera,
    snap,
    translate,
    requestFullscreen
  }
})

app.router({default: '/'}, [['/', baseView]])
window.document.body.appendChild(app.start())
