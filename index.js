import consoleStyle from '@stzhu/console-style-tag'

const LEVELS = ['debug', 'info', 'warn', 'error']
const STYLES = {
  TIMESTAMP: 'color: gray; font-style: italic;',
  LEVELS: {
    debug: 'color: #7e57c2; text-transform: uppercase;',
    info: 'color: #66bb6a; text-transform: uppercase;',
    warn: 'text-transform: uppercase;',
    error: 'text-transform: uppercase;',
  },
  NAME: 'font-weight: bold',
}

function createLoggingMethod({ timestamp, level, name, styles }) {
  const tag = consoleStyle([styles.timestamp, styles.level, styles.name])

  const metadata = name
    ? tag`[${timestamp}][${level}][${name}]`
    : tag`[${timestamp}][${level}]`

  return console[level].bind(console, ...metadata)
}

function createTimestamp(format) {
  const timestamp = function() {}
  if (format === 'datetime') {
    timestamp.toString = () => new Date().toLocaleString()
  } else if (format === 'time') {
    timestamp.toString = () => new Date().toLocaleTimeString()
  } else if (format === 'offset') {
    timestamp.toString = function() {
      const time = Date.now()
      if (!this.prevTime) {
        this.prevTime = time
      }
      const diff = time - this.prevTime
      this.prevTime = time
      return `+${diff}ms`
    }
  }
  return timestamp
}

export class Logger {
  constructor(name, { timestampFormat = 'datetime' } = {}) {
    for (const level of LEVELS) {
      this[level] = createLoggingMethod({
        timestamp: createTimestamp(timestampFormat),
        level,
        name,
        styles: {
          timestamp: STYLES.TIMESTAMP,
          level: STYLES.LEVELS[level],
          name: STYLES.NAME,
        },
      })
    }
  }
}

export default new Logger()
