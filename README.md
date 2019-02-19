# [Thing Translator](https://thing-translator.appspot.com/)

### [An AI Experiment](https://aiexperiments.withgoogle.com/)

✨ [Try the live demo here.](https://thing-translator.appspot.com/) ✨

![](https://oxism.com/thing-translator/thing-translator.gif)

![](https://oxism.com/thing-translator/img/1.jpg)

## ![](https://oxism.com/thing-translator/img/2.jpg)

Thing Translator is a web app that lets you point your phone (or laptop) at
stuff to hear to say it in a different language. It was developed as part of
Google's [AI Experiments](https://aiexperiments.withgoogle.com/) project. You
can try the app [here](https://thing-translator.appspot.com/).

Behind the scenes Thing Translator is using Google's
[Cloud Vision](https://cloud.google.com/vision/) and
[Translate](https://cloud.google.com/translate/) APIs.

### Development

To start a development server on `9966` that will watch for code changes simply run:

```
$ npm start
```

You will need to set your API key in `src/config.js`.

To optimize the output for production, run:

```
$ npm run build
```

For production builds, replace the contents of the `api_key` file with your
production key.

If you'd like to create a fork or a similar project, you'll need to setup some
API keys on [Google Cloud Platform](https://cloud.google.com/).
