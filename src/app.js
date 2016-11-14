import choo from 'choo'
import requestCamera from './effects/request-camera'
import requestFullscreen from './effects/request-fullscreen'
import snap from './effects/snap'
import translate from './effects/translate'
import baseView from './views/base-view'

const app = choo()

app.model({
  state: {
    activeView:  'main',
    cameraReady: false,
    cameraError: false,
    streamUrl:   null,
    video:       null,
    ctx:         null,
    canvas:      null,
    isSnapping:  false,
    firstTime:   true,
    fullscreen:  false,
    label:       '',
    translation: '',
    activeLang:  'spanish',
    targetLang:  'english',
    guesses:     ''
  },
  subscriptions: [
    (send, done) => document.addEventListener('DOMContentLoaded', _ => send('requestCamera', done))
  ],
  reducers: {
    showList:      _ => ({activeView: 'list'}),
    showMain:      _ => ({activeView: 'main'}),
    cameraError:   _ => ({cameraError: true}),
    startSnap:     _ => ({isSnapping: true, firstTime: false}),
    endSnap:       _ => ({isSnapping: false}),
    setFullscreen: _ => ({fullscreen: true}),
    setLabelPair:  labels => labels,
    changeLang:    lang => ({
      activeView:  'main',
      activeLang:  lang,
      label:       '',
      translation: ''
    }),
    setStream:     payload => ({
      cameraReady: true,
      streamUrl:   payload.stream,
      video:       payload.video,
      ctx:         payload.ctx,
      canvas:      payload.canvas
    })
  },
  effects: {
    requestCamera,
    snap,
    translate,
    requestFullscreen
  }
})

app.router(route => [route('/', baseView)])
document.body.appendChild(app.start())
