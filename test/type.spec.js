import { describe, expect, jest } from '@jest/globals'
import Chance from 'chance'
import { template } from './fixtures.js'

import TemplateTypeInit from '../src/type.js'
import { NodeTemplatePart, AttributeTemplatePart } from '../src/part.js'
import { RequiredError, ExecuteError } from '../src/helpers.js'
import '../src/index.js'

describe('TemplateType', () => {

    describe(`'defineTemplateType' method`, () => {
        const invalidNames = ['', 'test', 'test-1-']
        const name = 'test-processor'

        it('defined', () => {
            expect(document.defineTemplateType).toBeDefined()
        })
        

        describe(`'name' argument`, () => {
            
            it(`throws Error if provided value is not string`, () => {
                const error = new RequiredError('defineTemplateType', 'document', 'name')
                expect(() => document.defineTemplateType()).toThrowError(error)
            })

            it(`throws Error if provided incorrect string`, () => {
                const processor = new TemplateTypeInit
                const error = name => new ExecuteError('defineTemplateType', 'document', `"${name}" is not a valid template type name`)
                
                for (let name of invalidNames)
                    expect(() => document.defineTemplateType(name, processor)).toThrowError(error(name))
            })
        })
        

        it(`throws Error if 'processor' argument is not provided`, () => {
            const error = new RequiredError('defineTemplateType', 'document', 'processor')
            expect(() => document.defineTemplateType(name)).toThrowError(error)
        })

        for (let callback of ['createdCallback', 'processCallback'])
            it(`throws Error if ${callback} argument is not a function`, () => {
                const processor = new TemplateTypeInit
                processor[callback] = null

                expect(() => document.defineTemplateType(name, processor)).toThrowError(`defineTemplateType: ${callback} is not a function`)
            })
    })
   
})

describe('TemplateProcessCallback', () => {

    class TestProcessor extends TemplateTypeInit {
        is = 'test-processor'
        createdCallback = jest.fn()
        processCallback = jest.fn()
    }

    const data = new Chance

    const processor = new TestProcessor
    document.defineTemplateType(processor.is, processor)
    

    it('createdCallback called once on .createInstance()', () => {  
        template('', processor.is).createInstance({}).update({})
        expect(processor.createdCallback).toBeCalledTimes(1)
    })

    it('processCallback called on .createInstance()', () => {        
        template('', processor.is).createInstance({})
        expect(processor.processCallback).toBeCalledTimes(1)
    })

    it('processCallback called every time when .update()', () => {        
        const count = 10
        const instance = template('', processor.is).createInstance({})

        for (let i of Array(count)) instance.update({})

        expect(processor.processCallback).toBeCalledTimes(count + 1)
    })

    describe('callbacks received correct arguments', () => {
        const state = { 
            firstname: data.first(),
            lastname: data.last(),
            email: data.email()
        }
        const instance = template(`
            <h1>Hello, {{firstname}} {{lastname}}</h1>
            <a href='mailto:{{email}}'>Send to {{firstname}}</a>
        `, processor.is).createInstance(state)

        const parts = [
            expect.any(NodeTemplatePart), 
            expect.any(NodeTemplatePart), 
            expect.any(AttributeTemplatePart),
            expect.any(NodeTemplatePart)
        ]

        for (let callback of [processor.createdCallback, processor.processCallback])
            expect(callback).toHaveBeenCalledWith(instance, parts, state)
    })

})