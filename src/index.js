import TemplateProcessor from './processor.js'
import TemplateInstance from './instance.js'
import TemplateDefinition from './definition.js'

const templateDefinitionCache = new Map()

function createInstance (state, processor = new TemplateProcessor, overrideCache = false) {
    if (overrideCache || !templateDefinitionCache.has(this)) 
        templateDefinitionCache.set(this, new TemplateDefinition(this))
    
    const definition = templateDefinitionCache.get(this)

    return new TemplateInstance(definition, processor, state)
}

Object.defineProperty(HTMLTemplateElement.prototype, 'createInstance', { value: createInstance })
