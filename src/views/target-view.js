import html from 'choo/html'

export default (state, prev, send) =>
  state.activeView === 'list' || state.firstTime
  ? null
  : html`
    <div id="target" class=${state.isSnapping ? 'flashing' : ''}></div>
  `
