import html from 'choo/html'

export default () =>
  html`
    <h1 id="cam-error">
      ${/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream
        ? 'On iOS, Safari is the only browser allowed to use the camera. Please try using Safari.'
        : 'Your browser or device doesn’t allow access to the camera. Please try using a modern browser.'}
    </h1>
  `
