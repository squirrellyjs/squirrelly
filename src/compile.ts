import compileToString from './compile-string'
import { getConfig } from './config'
import { asyncFunc, isValidJSIdentifier } from './utils'
import SqrlErr from './err'

/* TYPES */

import { SqrlConfig, PartialConfig } from './config'
import { CallbackFn } from './file-handlers'
export type TemplateFunction = (data: object, config: SqrlConfig, cb?: CallbackFn) => string

/* END TYPES */

export default function compile (str: string, env?: PartialConfig): TemplateFunction {
  var options: SqrlConfig = getConfig(env || {})
  var ctor = Function // constructor

  /* ASYNC HANDLING */
  // The below code is modified from mde/ejs. All credit should go to them.
  if (options.async) {
    // Have to use generated function for this, since in envs without support,
    // it breaks in parsing
    if (asyncFunc) {
      ctor = asyncFunc
    } else {
      throw SqrlErr("This environment doesn't support async/await")
    }
  }
  if (options.varName && isValidJSIdentifier(options.varName) === false) {
    throw SqrlErr("options.varName must be a valid JS identifier")
  }

  /* END ASYNC HANDLING */
  try {
    return new ctor(
      options.varName,
      'c', // SqrlConfig
      'cb', // optional callback
      compileToString(str, options)
    ) as TemplateFunction // eslint-disable-line no-new-func
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw SqrlErr(
        'Bad template syntax\n\n' +
          e.message +
          '\n' +
          Array(e.message.length + 1).join('=') +
          '\n' +
          compileToString(str, options)
      )
    } else {
      throw e
    }
  }
}
