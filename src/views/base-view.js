import html from 'choo/html'
import errorView from './error-view'
import targetView from './target-view'
import mainView from './main-view'
import listView from './list-view'

export default (state, prev, send) =>
  html`
    <main
      class="app"
      ontouchstart="${!state.fullscreen
        ? send.bind(null, 'requestFullscreen')
        : null}"
    >
      <div id="shroud"></div>

      <svg
        id="spinner"
        class="${state.isSnapping ? 'active' : ''}"
        width="65px"
        height="65px"
        viewBox="0 0 66 66"
      >
        <circle />
      </svg>

      ${state.cameraError
        ? errorView()
        : html`
            <div>
              ${targetView(state, prev, send)}
              ${state.activeView === 'main'
                ? mainView(state, prev, send)
                : listView(state, prev, send)}
            </div>
          `}
    </main>
  `
