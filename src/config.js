const cloudVisionKey = ''
const translateKey   = ''

export const apiUrls = {
  cloudVision: 'https://vision.googleapis.com/v1/images:annotate?key=' + cloudVisionKey,
  translate:   'https://www.googleapis.com/language/translate/v2?key=' + translateKey
}

export const langList = [
  'spanish', 'french', 'german', 'italian', 'chinese', 'japanese', 'korean',
  'hindi', 'dutch'
]
