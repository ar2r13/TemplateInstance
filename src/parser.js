const openRegExp = /{{/g
const closeRegExp = /}}/g

export default function parser (templateString) {
  
  const strings = []
  const expressions = []
  const boundaryIndex = templateString.length + 1

  let lastExpressionIndex = openRegExp.lastIndex = closeRegExp.lastIndex = 0

  while (lastExpressionIndex < boundaryIndex) {
    const openResults = openRegExp.exec(templateString)

    if (!openResults) {
      strings.push(templateString.substring(lastExpressionIndex, boundaryIndex))
      break
    }

    const openIndex = openResults.index

    closeRegExp.lastIndex = openRegExp.lastIndex = openIndex + 2
    const closeResults = closeRegExp.exec(templateString)

    if (!closeResults) strings.push(templateString.substring(lastExpressionIndex, boundaryIndex))
    else {
      strings.push(templateString.substring(lastExpressionIndex, openIndex))
      expressions.push(templateString.substring(openIndex + 2, closeResults.index))

      lastExpressionIndex = closeResults.index + 2
    }
  }

  return [strings, expressions]
}