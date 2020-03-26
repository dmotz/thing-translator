import html from 'choo/html'
import {langList} from '../config'

export default (state, prev, send) =>
  html`
    <section id="lang-list">
      <div class="x" onclick="${() => send('showMain')}">×</div>
      <ul>
        ${langList.map(
          lang =>
            html`
              <li
                class="${lang === state.activeLang ? 'active' : ''}"
                onclick="${() => send('changeLang', lang)}"
              >
                ${lang}
              </li>
            `
        )}
      </ul>
    </section>
  `
