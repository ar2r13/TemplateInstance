export class TemplateRule {
  constructor (nodeIndex) {
    this.nodeIndex = nodeIndex
  }
}

export class NodeTemplateRule extends TemplateRule {
  constructor (nodeIndex, expression) {
    super(nodeIndex)
    this.expression = expression
  }
}

export class AttributeTemplateRule extends TemplateRule {
  constructor (nodeIndex, attirbute, strings, expressions) {
    super(nodeIndex)
    Object.assign(this, { attirbute, strings, expressions })
  }
}

export class InnerTemplateRule extends NodeTemplateRule {
  constructor(nodeIndex, template) {
    if (!(template instanceof HTMLTemplateElement)) 
      throw new TypeError('template should be an instance of HTMLTemplateElement')
      
    super(nodeIndex, template.getAttribute('expression') || '')

    this.template = template
    this.directive = template.getAttribute('directive') || ''
  }
}
