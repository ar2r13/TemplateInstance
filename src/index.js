import TemplateProcessor from './processor.js'
import TemplateInstance from './instance.js'
import TemplateDefinition from './definition.js'

const templateDefinitionCache = new Map()
const templateTypesCache = new Map()

function createInstance (state, overrideCache = false) {
    if (state == null) throw new TypeError(`Failed to execute 'createInstance' on ${this.constructor.name}: state is not provided.`)
    if (overrideCache || !templateDefinitionCache.has(this)) 
        templateDefinitionCache.set(this, new TemplateDefinition(this))

    const definition = templateDefinitionCache.get(this)
    const processor = templateTypesCache.get(this.getAttribute('type')) || new TemplateProcessor

    return new TemplateInstance(definition, processor, state)
}

function defineTemplateType (name, processor, overrideCache = false) {
    if (overrideCache || !templateTypesCache.has(name)) 
        templateTypesCache.set(name, processor)
}

Object.defineProperty(HTMLTemplateElement.prototype, 'createInstance', { value: createInstance })
Object.defineProperty(document, 'defineTemplateType', { value: defineTemplateType })
