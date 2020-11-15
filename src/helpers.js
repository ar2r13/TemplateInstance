export function exec (expression, context) { 
    try {
      return new Function('ctx', `with (ctx) {return ${expression}}`)(context)
    } catch (error) { 
        if (window.env === 'development') console.error(error) 
    }
}

export function createTreeWalker(node) {
  return document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false)
}

export class ExecuteError extends Error {
  constructor (method, context, message) {
    super(message)
    this.message = `Failed to execute ${method} on ${context}: ${message}`
  }
}

export class RequiredError extends ExecuteError {
  constructor (method, context, argument) {
    super(method, context, `${argument} is not provided.`)
  }
}