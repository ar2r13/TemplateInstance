import TemplateProcessor from './processor.js'
import { createTreeWalker } from './definition.js'

import { AttributeTemplatePart, NodeTemplatePart, InnerTemplatePart } from './part.js'
import { AttributeTemplateRule, NodeTemplateRule, InnerTemplateRule } from './rule.js'

export default class TemplateInstance extends DocumentFragment {
    
    #parts = []

    #processor = new TemplateProcessor

    #createdCallbackInvoked = false
    #previousState = null

    constructor (definition, processor, state) {
        super()

        this.#processor = processor

        this.append(definition.content)
        this.#generateParts(definition)
        this.update(state)
    }

    update (state) {
        if (!this.#createdCallbackInvoked) {
            this.#processor.createdCallback(this.#parts, state)
            this.#createdCallbackInvoked = true
        }

        this.#processor.processCallback(this.#parts, state)
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
            return new AttributeTemplatePart(this, rule, node)
        else 
        if (rule instanceof InnerTemplateRule) 
            return new InnerTemplatePart(this, rule, node)
        else 
        if (rule instanceof NodeTemplateRule) 
            return new NodeTemplatePart(this, rule, node)

        throw new Error('Unknown rule type.')
    }
}