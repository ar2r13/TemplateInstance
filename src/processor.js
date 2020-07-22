import { NodeTemplatePart, AttributeTemplatePart, InnerTemplatePart } from './part.js'

export default class TemplateProcessor {

  createdCallback (instance, parts, state) {}

  processCallback (instance, parts, state) {

    for (const part of parts) switch (part.constructor) {
      case InnerTemplatePart :
        break
        
      case NodeTemplatePart :
        part.value = exec(part.expression, state)
        break

      case AttributeTemplatePart :
        part.value = part.expression?.map(expression => exec(expression, state))
        break
    }
    
  }

}

export function exec (expression, context) { 
  try {
    return new Function('ctx', `with (ctx) {return ${expression}}`)(context)
  } catch (error) { 
    // console.error(error) 
  }
}