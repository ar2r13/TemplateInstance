import { describe, expect } from '@jest/globals'
import { template } from './fixtures.js'

import TemplateInstance from '../src/instance.js'
import { RequiredError } from '../src/helpers.js'
import '../src/index.js'

const state = { content: 'Hello World' }

describe('HTMLTemplateElement', () => {
  
  describe(`'createInstance' method`, () => {

    it('defined', () => {
      expect(HTMLTemplateElement.prototype.createInstance).toBeDefined()
    })

    it(`throws Error if 'state' argument is not provided`, () => {
      expect(() => template().createInstance()).toThrowError(new RequiredError('createInstance', 'HTMLTemplateElement', 'state'))
    })

    it('returns a TemplateInstance', () => {
      expect(template().createInstance({})).toBeInstanceOf(TemplateInstance)
    })
    it('returns a DocumentFragment', () => {
      expect(template().createInstance({})).toBeInstanceOf(DocumentFragment)
    })
    
    it('provides state into the DOM', () => {
      const instanace = template(`<div>{{content}}</div>`).createInstance(state)
      expect(instanace.textContent).toBe(state.content)
    })

  })

  describe(`'update' method`, () => {

    it('defined', () => {
      expect(() => template().createInstance({}).update).toBeDefined()
    })

    it(`throws Error if 'state' argument is not provided`, () => {
      const instance = template().createInstance({})
      expect(() => instance.update()).toThrowError(new RequiredError('update', 'TemplateInstance', 'state'))
    })

    it('provides new state value into the DOM', () => {
      const instance = template(`<div>{{content}}</div>`).createInstance(state)
      const updated = { content: 'You are welcome!' }
      
      instance.update(updated)

      expect(instance.textContent).toBe(updated.content)
    })

  })

})