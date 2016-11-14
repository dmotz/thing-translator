# [Thing Translator](https://oxism.com/thing-translator/)
### An AI Experiment
---

Thing Translator is a web app that lets you point your phone (or laptop) at
stuff to hear to say it in a different language. It was developed as part of
Google's [AI Experiments](https://aiexperiments.withgoogle.com/) project. You
can try a live demo [here](https://oxism.com/thing-translator/).

Behind the scenes Thing Translator is using Google's
[Cloud Vision](https://cloud.google.com/vision/) and
[Translate](https://cloud.google.com/translate/) APIs.


### Development

To start a development server on `9966` that will watch for code changes simply run:
```
$ npm run dev
```

To optimize the output for production run:
```
$ npm run bundle
```

### Caveats

Unfortunately this experiment does not work on iOS or desktop Safari (at least
until Apple allows camera access from the web).

If you'd like to create a fork or a similar project, you'll need to setup some
API keys on [Google Cloud Platform](https://cloud.google.com/).
