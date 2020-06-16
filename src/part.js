export class TemplatePart {
  
  #sourceValue

  get value () { return this.#sourceValue }

  set value (value) {
    if (value === this.#sourceValue) return
    this.#sourceValue = value
  }

  constructor(templateInstance, rule) {
    Object.assign(this, { templateInstance, rule })
  }
}

export class AttributeTemplatePart extends TemplatePart {

  set value (value) { 
    if (value === super.value) return
    
    super.value = value 
    this.#applyValue(super.value)
  }

  constructor(templateInstance, rule, element) {
    super(templateInstance, rule)
    
    this.element = element
    this.attributeName = rule.attributeName
  }

  #applyValue (value) {
    if (!value) value = []
    else if (!Array.isArray(value)) value = [value]

    const { strings } = this.rule
    const valueFragments = Array(strings.length * 2)

    for (let i = 0; i < valueFragments.length; i += 2) {
      valueFragments[i] = strings[i / 2]
      valueFragments[i + 1] = value[i / 2] || ''
    }

    const attributeValue = valueFragments.join('')

    if (attributeValue) this.element.setAttribute(this.attributeName, attributeValue)
    else this.element.removeAttribute(this.attributeName)
  }
}

export class NodeTemplatePart extends TemplatePart {

  parentNode
  previousSibling
  nextSibling

  #currentNodes = []

  set value (value) { 
    if (value === super.value) return

    super.value = value 
    this.#applyValue(super.value)
  }

  constructor (templateInstance, rule, startNode) {
    super(templateInstance, rule)

    this.#move(startNode)
  }

  replace (...nodes) {
    this.#clear()

    for (let i = 0; i < nodes.length; ++i) {
      let node = nodes[i]

      if (typeof node === 'string') node = document.createTextNode(node)
      
      else if (node instanceof NodeTemplatePart) {
        this.appendNode(node.startNode)
        node.move(node.startNode)
      }  

      else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.DOCUMENT_NODE)
        throw new DOMException('InvalidNodeTypeError')
      
      else this.appendNode(node)
    }
  }

  replaceHTML (html = '') {
    this.#clear()
    this.innerHTML = html
  }

  appendNode (node) {
    this.parentNode.insertBefore(node, this.nextSibling)
    this.#currentNodes.push(node)
  }

  #clear (startNode = this.previousSibling.nextSibling) {
    if (this.parentNode === null) return

    let node = startNode

    while (node !== this.nextSibling) {
      this.parentNode.removeChild(node.nextSibling)
      node = node.nextSibling
    }

    this.#currentNodes = []
  }

  #move (startNode) {
    if (this.startNode !== startNode && this.#currentNodes.length) this.#clear()

    this.parentNode = startNode.parentNode
    this.previousSibling = startNode
    this.nextSibling = startNode.nextSibling
    this.startNode = startNode

    if (this.#currentNodes?.length) this.replace(...currentNodes)
  }

  #applyValue (value) {
    if (this.#currentNodes.length === 1 && this.#currentNodes[0].nodeType === Node.TEXT_NODE)
      this.#currentNodes[0].nodeValue = value
    else
      this.replace(document.createTextNode(value))
  }
}

export class InnerTemplatePart extends NodeTemplatePart {
  get template () { return this.rule.template }
}

