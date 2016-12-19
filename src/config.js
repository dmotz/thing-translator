// Insert your own API key here:
const googleKey = '@@@@@'

export const apiUrls = {
  cloudVision: 'https://vision.googleapis.com/v1/images:annotate?key=' + googleKey,
  translate:   'https://www.googleapis.com/language/translate/v2?key=' + googleKey
}

export const langList = [
  'spanish', 'french', 'german', 'italian', 'chinese', 'japanese', 'korean',
  'hindi', 'dutch'
]
