import html from 'choo/html'

const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream

export default () =>
  html`
    <h1 id="cam-error">
      ${isIos
        ? `On iOS, Safari is the only browser allowed to use the camera.
           <br />
           Please try using Safari.`
        : `Your browser or device doesn’t allow access to the camera.
           <br />
           Please try using a modern browser.`}
    </h1>
  `
