require('jest-extended')
const { Logger } = require('browser-logger')

describe('logger', () => {
  it('should create a method for each logging level', () => {
    const logger = new Logger()
    expect(logger).toContainAllKeys(['debug', 'info', 'warn', 'error'])
  })

  it('should output the correct arguments', done => {
    console.info = function(...args) {
      const [timestampFn] = args.splice(2, 1)
      expect(timestampFn).toBeFunction()

      expect(args).toEqual([
        `[%c%s%c][%cinfo%c]`,
        'color: gray; font-style: italic;',
        '',
        'color: #66bb6a; text-transform: uppercase;',
        '',
        'Some text',
      ])

      done()
    }

    const logger = new Logger()
    logger.info('Some text')
  })

  it('should output the logger name if given', done => {
    console.info = (...args) => {
      const [timestampFn] = args.splice(2, 1)
      expect(timestampFn).toBeFunction()

      expect(args).toEqual([
        `[%c%s%c][%cinfo%c][%ctest%c]`,
        'color: gray; font-style: italic;',
        '',
        'color: #66bb6a; text-transform: uppercase;',
        '',
        'font-weight: bold',
        '',
        'Some text',
      ])

      done()
    }

    const logger = new Logger('test')
    logger.info('Some text')
  })
})
