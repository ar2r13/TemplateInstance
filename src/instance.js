import TemplateType from './type.js'
import { createTreeWalker, RequiredError } from './helpers.js'
import { AttributeTemplatePart, NodeTemplatePart, InnerTemplatePart } from './part.js'
import { AttributeTemplateRule, NodeTemplateRule, InnerTemplateRule } from './rule.js'

export default class TemplateInstance extends DocumentFragment {
    
    #parts = []

    #processor = new TemplateType

    #createdCallbackInvoked = false
    #previousState = null

    constructor (definition, processor, state) {
        super()

        this.#processor = processor

        this.append(document.importNode(definition.content, true))
        this.#generateParts(definition)
        this.update(state)
    }

    update (state) {
        if (!state) throw new RequiredError(this.update.name, this.constructor.name, 'state')
        
        const { createdCallback, processCallback } = this.#processor

        if (!this.#createdCallbackInvoked) {
            typeof createdCallback === typeof Function && createdCallback(this, this.#parts, state)
            this.#createdCallbackInvoked = true
        }

        typeof processCallback === typeof Function && processCallback(this, this.#parts, state)
        this.#previousState = state
    }

    #generateParts ({ rules }) {
        const parts = Array(rules.length)
        const walker = createTreeWalker(this)

        let walkerIndex = -1

        for (let i = 0; i < rules.length; ++i) {
            const rule = rules[i]

            while (walkerIndex < rule.nodeIndex) {
                walkerIndex++
                walker.nextNode()
            }

            const part = this.#createPart(rule, walker.currentNode)
            parts[i] = part
        }

        this.#parts = parts
    }

    #createPart (rule, node) {
        if (rule instanceof AttributeTemplateRule) 
            return new AttributeTemplatePart(rule, node)
        else 
        if (rule instanceof InnerTemplateRule) 
            return new InnerTemplatePart(rule, node)
        else 
        if (rule instanceof NodeTemplateRule) 
            return new NodeTemplatePart(rule, node)

        throw new Error('Unknown rule type.')
    }
}