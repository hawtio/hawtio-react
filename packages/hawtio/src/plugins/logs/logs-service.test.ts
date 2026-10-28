import { LogEntry } from './log-entry'
import { DEFAULT_OPTIONS, STORAGE_KEY_PREFERENCES, logsService } from './logs-service'

function createEntries(start: number, count: number): LogEntry[] {
  return Array.from(
    { length: count },
    (_, i) =>
      new LogEntry({
        seq: start + i,
        timestamp: new Date(start + i).toISOString(),
        level: 'INFO',
        logger: 'test',
        message: `message-${start + i}`,
        properties: {},
        className: null,
        containerName: null,
        exception: null,
        fileName: null,
        host: null,
        lineNumber: null,
        methodName: null,
        thread: null,
      }),
  )
}

describe('LogsService', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY_PREFERENCES)
  })

  test('loadOptions/saveOptions', () => {
    let options = logsService.loadOptions()
    expect(options).toEqual(DEFAULT_OPTIONS)

    logsService.saveOptions({ sortAscending: false, batchSize: 50 })
    options = logsService.loadOptions()
    expect(options).toEqual({ ...DEFAULT_OPTIONS, sortAscending: false, batchSize: 50 })
  })

  describe('append', () => {
    test('keeps all logs when under cache size', () => {
      logsService.saveOptions({ cacheSize: 10 })
      const result = logsService.append(createEntries(0, 3), createEntries(3, 3))
      expect(result.map(e => e.event.seq)).toEqual([0, 1, 2, 3, 4, 5])
    })

    test('drops oldest logs when exceeding cache size', () => {
      logsService.saveOptions({ cacheSize: 4 })
      const result = logsService.append(createEntries(0, 3), createEntries(3, 3))
      expect(result.map(e => e.event.seq)).toEqual([2, 3, 4, 5])
    })

    test('keeps cache size when batch size is smaller than cache size', () => {
      logsService.saveOptions({ cacheSize: 6, batchSize: 3 })
      let logs = createEntries(0, 6)
      for (let i = 0; i < 3; i++) {
        logs = logsService.append(logs, createEntries(6 + i * 3, 3))
        expect(logs).toHaveLength(6)
      }
      expect(logs.map(e => e.event.seq)).toEqual([9, 10, 11, 12, 13, 14])
    })

    test('keeps cache size when batch size is larger than cache size', () => {
      logsService.saveOptions({ cacheSize: 2, batchSize: 6 })
      let logs = createEntries(0, 2)
      for (let i = 0; i < 3; i++) {
        logs = logsService.append(logs, createEntries(2 + i * 6, 6))
        expect(logs).toHaveLength(2)
      }
      expect(logs.map(e => e.event.seq)).toEqual([18, 19])
    })
  })
})
