require('jest-extended')
const { Logger } = require('./index')

describe('Logger', () => {
  beforeAll(() => {
    console.info = function(...args) {
      return args
    }
  })

  it('should create a method for each logging level', () => {
    const logger = new Logger()
    expect(logger).toContainKeys(['debug', 'info', 'warn', 'error'])
  })

  it('should output the correct arguments', () => {
    const logger = new Logger()
    const output = logger.info('Some text')

    const [timestampFn] = output.splice(2, 1)
    expect(timestampFn).toBeFunction()

    expect(output).toEqual([
      `[%c%s%c][%cinfo%c]`,
      'color: gray; font-style: italic;',
      '',
      'color: #66bb6a; text-transform: uppercase;',
      '',
      'Some text',
    ])
  })

  it('should output the logger name if given', () => {
    const logger = new Logger('test')
    const output = logger.info('Some text')

    const [timestampFn] = output.splice(2, 1)
    expect(timestampFn).toBeFunction()

    expect(output).toEqual([
      `[%c%s%c][%cinfo%c][%ctest%c]`,
      'color: gray; font-style: italic;',
      '',
      'color: #66bb6a; text-transform: uppercase;',
      '',
      'font-weight: bold',
      '',
      'Some text',
    ])
  })
})
