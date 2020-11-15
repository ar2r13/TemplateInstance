import { NodeTemplatePart, AttributeTemplatePart, InnerTemplatePart } from './part.js'
import { exec } from './helpers.js'

export default class TemplateTypeInit {

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