import xhr from 'xhr'
import he from 'he'
import {apiUrls} from '../config'

const {speechSynthesis, SpeechSynthesisUtterance} = window

const speechSupport = speechSynthesis && SpeechSynthesisUtterance
const filterLong = true
const lengthLimit = 8

const speak = (text, lang, cb) => {
  if (!speechSupport) {
    cb && cb()
    return
  }

  const msg = new SpeechSynthesisUtterance()
  msg.text = text
  msg.lang = voices[voiceMap[lang]].lang
  msg.voiceURI = voices[voiceMap[lang]].voiceURI
  cb && msg.addEventListener('end', cb)

  if (text) {
    speechSynthesis.speak(msg)
  } else {
    cb && cb()
  }
}

let voices = speechSupport ? speechSynthesis.getVoices() : []
let voiceMap = null

const setVoiceMap = voiceList => {
  voices = voiceList

  const voiceRxs = {
    english: /en(-|_)gb/i,
    spanish: /es(-|_)(mx|es)/i,
    german: /de(-|_)de/i,
    french: /fr(-|_)fr/i,
    chinese: /zh(-|_)cn/i,
    italian: /it(-|_)it/i,
    korean: /ko(-|_)kr/i,
    japanese: /ja(-|_)jp/i,
    dutch: /nl(-|_)nl/i,
    hindi: /hi(-|_)in/i
  }

  voiceMap = Object.keys(voiceRxs).reduce((a, k) => {
    a[k] = voices.findIndex(v => voiceRxs[k].test(v.lang))
    return a
  }, {})
}

if (voices.length) {
  setVoiceMap(voices)
} else if (speechSupport) {
  speechSynthesis.onvoiceschanged = () =>
    setVoiceMap(speechSynthesis.getVoices())
}

const langMap = {
  english: 'en',
  spanish: 'es',
  german: 'de',
  french: 'fr',
  chinese: 'zh',
  italian: 'it',
  korean: 'ko',
  japanese: 'ja',
  dutch: 'nl',
  hindi: 'hi'
}

const cache = {}

export default function translate(state, raw, send, done) {
  const failureState = () =>
    send('setLabelPair', {label: '?', translation: '?', guesses: ''}, done)

  if (!raw.length) {
    return failureState()
  }

  const labels = raw.map(l => l.description)
  let filtered = filterLong
    ? labels.filter(t => t.length <= lengthLimit)
    : labels

  if (!filtered.length) {
    filtered = labels
  }

  const guesses = raw
    .slice(0, 3)
    .map(o => `${o.description}: ${Math.round(o.score * 100)}%`)
    .join(', ')

  let term = filtered[0]

  if (state.rotateTerms && term === state.label && filtered.length > 1) {
    term = filtered.slice(1)[Math.floor(Math.random() * (filtered.length - 1))]
  }

  if (!cache[state.activeLang]) {
    cache[state.activeLang] = {}
  }

  const cacheHit = cache[state.activeLang][term]
  if (cacheHit) {
    send(
      'setLabelPair',
      {label: he.decode(term), translation: cacheHit, guesses},
      done
    )
    speak(cacheHit, state.activeLang, speak.bind(null, term, state.targetLang))
    return
  }

  xhr.get(
    `${apiUrls.translate}&q=${term}&source=en&target=${
      langMap[state.activeLang]
    }`,
    (err, res, body) => {
      if (err) {
        return failureState()
      }

      const translation = he.decode(
        JSON.parse(body).data.translations[0].translatedText
      )
      send('setLabelPair', {label: he.decode(term), translation, guesses}, done)
      speak(
        translation,
        state.activeLang,
        speak.bind(null, term, state.targetLang)
      )
      cache[state.activeLang][term] = translation
    }
  )
}
