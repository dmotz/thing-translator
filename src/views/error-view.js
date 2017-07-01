import html from 'choo/html'

export default _ =>
  html`
    <h1 id="cam-error">
      Your device doesn’t allow access to the camera.
      <br>
      <br>
      Please try it on your desktop, Android, or iOS (${'>'}=11) device.
    </h1>
  `
