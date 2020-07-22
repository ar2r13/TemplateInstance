export class TemplatePart {

  #value
  set value (value) {
    if (value === this.#value) return
    this.#value = value
  }

  get value () { return this.#value }

  constructor (rule) {
    Object.defineProperty(this, 'expression', {
      get () { return rule.expression || '' }
    })
  }

}

export class AttributeTemplatePart extends TemplatePart {

  #strings = []

  set value (value) { 
    if (value === super.value) return
    
    super.value = value 
    this.#applyValue(super.value)
  }

  constructor (rule, element) {
    super(rule)
    this.#strings = rule.strings

    Object.defineProperties(this, {
      element: {
        get () { return element }
      },
      attributeName: {
        get () { return rule.attribute.name }
      },
      attributeNamespace: {
        get () { return rule.attribute.namespaceURI }
      }
    })
  }

  #applyValue (value) {
    if (!value) value = []
    else if (!Array.isArray(value)) value = [value]

    const valueFragments = Array(this.#strings.length * 2)

    for (let i = 0; i < valueFragments.length; i += 2) {
      valueFragments[i] = this.#strings[i / 2]
      valueFragments[i + 1] = value[i / 2] || ''
    }

    const attributeValue = valueFragments.join('')

    if (attributeValue) this.element.setAttribute(this.attributeName, attributeValue)
    else this.element.removeAttribute(this.attributeName)
  }
}

export class NodeTemplatePart extends TemplatePart {
  
  set value (value) { 
    if (value === super.value) return
    
    super.value = value 
    this.#applyValue(super.value)
  }
  
  #partNode
  
  get parentNode () { return this.#partNode.parentNode }
  get nextSibling () { return this.#partNode.nextSibling }
  get previousSibling () { return this.#partNode }
  
  #replacementNodes = []
  get replacementNodes () { return this.#replacementNodes }

  constructor (rule, partNode) {
    super(rule)
    this.#partNode = partNode
  }

  replace (...nodes) {
    const error = `Failed to execute 'replace' on ${this.constructor.name}: `

    if (nodes[0] == null) 
      throw new TypeError(error + '0 arguments presented.')

    this.#clear()

    for (let i = 0; i < nodes.length; ++i) {
      let node = nodes[i]

      if (node instanceof DocumentFragment || node instanceof Document) {
        if ( !(this instanceof InnerTemplatePart) ) 
          throw new DOMException('InvalidNodeTypeError')
      }

      else if (node instanceof NodeTemplatePart) node = node.startNode
      else if (!(node instanceof Node)) node = document.createTextNode(node) 
      
      try {
        this.#append(node)
      } catch ({ message }) { throw new TypeError(error + message) }
    }
  }

  replaceHTML (html = '') {
    this.#clear()
    this.innerHTML = html
  }

  #applyValue (value) {
    if (this.replacementNodes.length === 1 && this.replacementNodes[0].nodeType === Node.TEXT_NODE)
      this.replacementNodes[0].nodeValue = value
    else
      this.replace(document.createTextNode(value))
  }

  #clear () {
    for (let node of this.replacementNodes) node.remove()
    this.#replacementNodes = []
  }

  #append (node) {
    if (node instanceof DocumentFragment || node instanceof Document)
      this.replacementNodes.push(...node.children)
    
    else if (node instanceof Node) 
      this.replacementNodes.push(node)
    
    else throw new TypeError('argument is not a Node.')

    this.parentNode.insertBefore(node, this.previousSibling)
  }

}

export class InnerTemplatePart extends NodeTemplatePart {

  constructor (rule, partNode) { 
    super(rule, partNode)

    Object.defineProperties(this, {
      template: {
        get () { return rule.template }
      },
      directive: {
        get () { return rule.directive }
      }
    })
  }

}