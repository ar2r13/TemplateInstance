import { NodeTemplatePart, AttributeTemplatePart, InnerTemplatePart } from './part.js'

export default class TemplateProcessor {

  createdCallback (parts, state) {}

  processCallback (parts, state) {
    for (const part of parts)
      switch (part.constructor.name) {
        case 'InnerTemplatePart' :
          break
        
        case 'NodeTemplatePart' :
          part.value = exec(part.rule.expression, state)
          break

        case 'AttributeTemplatePart' :
          part.value = part.rule.expressions?.map(expression => exec(expression, state))
          break
      }
  }

}

export function exec (expression, context) { 
  try {
    return new Function('ctx', `with (ctx) {return ${expression}}`)(context)
  } catch (error) { 
    console.warn(error)
    return '' 
  }
}