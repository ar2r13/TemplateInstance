import parser from './parser.js'
import { NodeTemplateRule, AttributeTemplateRule, InnerTemplateRule } from './rule.js'

export function createTreeWalker(node) {
    return document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false)
}

export default class TemplateDefinition {

    #parsedTemplate = document.createElement('template')

    constructor (template) {
        this.template = template
        this.#parse()
    }

    get content () {
        return this.#parsedTemplate.content.cloneNode(true)
    }

    #parse () {
        const content = this.template.content.cloneNode(true)
        const rules = []
        const walker = createTreeWalker(content)

        let nodeIndex = -1

        while (walker.nextNode()) {
            const node = walker.currentNode
            nodeIndex++

            switch (node.nodeType) {
                case Node.ELEMENT_NODE :
                    if (!node.hasAttributes()) continue
                    if (node instanceof HTMLTemplateElement) {
                        const partNode = document.createTextNode('')
    
                        node.parentNode.replaceChild(partNode, node)
                        rules.push(new InnerTemplateRule(nodeIndex, node))

                        continue
                    }
                    
                    const { length } = node.attributes
                    for (let i = 0; i < length; ++i){
                        const { name, value } = node.attributes[0]
                        const [strings, values] = parser(value)

                        if (strings.length === 1) continue
                        
                        rules.push(new AttributeTemplateRule(nodeIndex, name, strings, values))
                        node.removeAttribute(name)
                    }
                    break
                
                case Node.TEXT_NODE :
                    const [strings, values] = parser(node.nodeValue || '')
                    if (strings.length === 1) continue

                    for (let i = 0; i < values.length; ++i) {
                        const partNode = node.ownerDocument.createTextNode(strings[i])

                        node.parentNode.insertBefore(partNode, node)
                        rules.push(new NodeTemplateRule(nodeIndex++, values[i]))
                    }

                    node.nodeValue = strings[strings.length - 1]
                    break
            }
        }

        this.rules = rules
        this.#parsedTemplate.content.appendChild(content)
    }
}