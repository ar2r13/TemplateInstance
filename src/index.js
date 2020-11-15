import TemplateTypeInit from './type.js'
import TemplateInstance from './instance.js'
import TemplateDefinition from './definition.js'

import { RequiredError, ExecuteError } from './helpers.js'

const templateDefinitionCache = new Map()
const templateTypesCache = new Map()

function createInstance (state, overrideCache = false) {
    if (state == null) 
        throw new RequiredError(createInstance.name, this.constructor.name, 'state')
        
    if (overrideCache || !templateDefinitionCache.has(this)) 
        templateDefinitionCache.set(this, new TemplateDefinition(this))

    const definition = templateDefinitionCache.get(this)
    const processor = templateTypesCache.get(this.getAttribute('type')) || new TemplateTypeInit

    return new TemplateInstance(definition, processor, state)
}

function defineTemplateType (name, processor, overrideCache = false) {
    if (name == null) 
        throw new RequiredError(defineTemplateType.name, 'document', 'name')

    if (!/^\w+-[\w-]*\w$/.test(name)) 
        throw new ExecuteError(defineTemplateType.name, 'document', `"${name}" is not a valid template type name`)

    if (processor == null) 
        throw new RequiredError(defineTemplateType.name, 'document', 'processor')

    for (let callback of ['createdCallback', 'processCallback'])
        if (typeof processor[callback] === typeof Function) 
            continue
        else 
            throw new TypeError(`${defineTemplateType.name}: ${callback} is not a function`)

    if (overrideCache || !templateTypesCache.has(name)) 
        templateTypesCache.set(name, processor)
}

Object.defineProperty(HTMLTemplateElement.prototype, createInstance.name, { value: createInstance })
Object.defineProperty(document, defineTemplateType.name, { value: defineTemplateType })
