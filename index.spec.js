require('jest-extended')
const { Logger } = require('./index')

describe('Logger', () => {
  beforeAll(() => {
    console.info = function(...args) {
      return args
    }

    const _Date = Date
    Date = function() {
      const date = new _Date('2000')

      const toLocaleString = date.toLocaleString.bind(date)
      date.toLocaleString = function() {
        return toLocaleString('en-US', { timeZone: 'UTC' })
      }

      const toLocaleTimeString = date.toLocaleTimeString.bind(date)
      date.toLocaleTimeString = function() {
        return toLocaleTimeString('en-US', { timeZone: 'UTC' })
      }

      return date
    }
    Date.now = _Date.now
  })

  it('should create a method for each logging level', () => {
    const logger = new Logger()
    expect(logger).toContainKeys(['debug', 'info', 'warn', 'error'])
  })

  it('should output the correct arguments', () => {
    const logger = new Logger()
    const output = logger.info('Some text')

    const [timestamp] = output.splice(2, 1)
    expect(timestamp).toBeFunction()

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

    const [timestamp] = output.splice(2, 1)
    expect(timestamp).toBeFunction()

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

  describe('should output the right timestamp for format', () => {
    it.each([
      ['datetime', '1/1/2000, 12:00:00 AM'],
      ['time', '12:00:00 AM'],
      ['offset', '+0ms'], // TODO needs more testing
    ])('%s', (timestampFormat, expected) => {
      const logger = new Logger('test', { timestampFormat })
      const output = logger.info('Some text')
      const timestamp = output[2]
      expect(timestamp.toString()).toEqual(expected)
    })
  })
})
