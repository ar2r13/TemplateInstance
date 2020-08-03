import parser from './parser.js'
import { NodeTemplateRule, AttributeTemplateRule, InnerTemplateRule } from './rule.js'

export function createTreeWalker(node) {
    return document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false)
}

export default class TemplateDefinition {

    #parsedTemplate = document.createElement('template')

    constructor (template = new HTMLTemplateElement) {
        this.template = template
        this.#parse()
    }

    get content () {
        return this.#parsedTemplate.content.cloneNode(true)
    }

    #parse () {
        const content = this.template.content.cloneNode(true)
        content.normalize()

        const rules = []
        const walker = createTreeWalker(content)

        let nodeIndex = -1

        while (walker.nextNode()) {
            const node = walker.currentNode
            nodeIndex++

            switch (node.nodeType) {
                case Node.ELEMENT_NODE :
                    if (node instanceof HTMLTemplateElement) {
                        rules.push(new InnerTemplateRule(nodeIndex, node))
                        continue
                    }

                    const { length } = node.attributes
                    for (let i = 0; i < length; i++) {
                        const attribute = node.attributes[i].cloneNode(true)
                        const [strings, values] = parser(attribute.value)

                        if (strings.length === 1) continue

                        rules.push(new AttributeTemplateRule(nodeIndex, attribute, strings, values))
                        setTimeout(() => node.removeAttribute(name))
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