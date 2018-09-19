var Partials = {/*
    partialName: "partialString"
*/}

export function returnPartial (partialName) {
  var result = Partials[partialName]
  return result
}

export function definePartial (name, str) {
  Partials[name] = str
}

export default Partials
