import EventBus from './event-bus'

describe(`Test EventBus`, () => {
  test('on one callback.', () => {
    const bus = new EventBus()
    const fn = jest.fn()
    bus.on('event', fn)
    const callbacks = bus.getCallbacks()
    expect(callbacks['event']).toEqual([fn])
    bus.emit('event')
    expect(fn).toBeCalled()
  })

  test('on multiple callback.', () => {
    const bus = new EventBus()
    const fn = jest.fn()
    bus.on('event', fn)
    bus.on('event', fn)
    const callbacks = bus.getCallbacks()
    expect(callbacks['event']).toEqual([fn, fn])
    bus.emit('event')
    expect(fn).toBeCalledTimes(2)
  })

  test('on different event.', () => {
    const bus = new EventBus()
    const fn1 = jest.fn()
    const fn2 = jest.fn()
    bus.on('event1', fn1)
    bus.on('event2', fn2)
    const callbacks = bus.getCallbacks()
    expect(callbacks['event1']).toEqual([fn1])
    expect(callbacks['event2']).toEqual([fn2])
    bus.emit('event1')
    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(0)
  })

  test('off callback.', () => {
    const bus = new EventBus()
    const fn = jest.fn()
    bus.on('event', fn)
    bus.off('event', fn)
    const callbacks = bus.getCallbacks()
    expect(callbacks['event']).toEqual([])
    bus.emit('event')
    expect(fn).toBeCalledTimes(0)
  })

  test('off all callback.', () => {
    const bus = new EventBus()
    const fn1 = jest.fn()
    const fn2 = jest.fn()
    bus.on('event', fn1)
    bus.on('event', fn2)
    bus.off('event')
    const callbacks = bus.getCallbacks()
    expect(callbacks['event']).toEqual([])
    bus.emit('event')
    expect(fn1).toBeCalledTimes(0)
    expect(fn2).toBeCalledTimes(0)
  })

  test('off multiple callback.', () => {
    const bus = new EventBus()
    const fn1 = jest.fn()
    const fn2 = jest.fn()
    bus.on('event', fn1)
    bus.on('event', fn1)
    bus.on('event', fn2)
    bus.off('event', fn1)
    const callbacks = bus.getCallbacks()
    expect(callbacks['event']).toEqual([fn2])
    bus.emit('event')
    expect(fn1).toBeCalledTimes(0)
    expect(fn2).toBeCalledTimes(1)
  })

  test('off different event.', () => {
    const bus = new EventBus()
    const fn1 = jest.fn()
    const fn2 = jest.fn()
    bus.on('event1', fn1)
    bus.on('event2', fn2)
    bus.off('event1', fn1)
    const callbacks = bus.getCallbacks()
    expect(callbacks['event1']).toEqual([])
    expect(callbacks['event2']).toEqual([fn2])
  })

  test('emit event.', () => {
    const bus = new EventBus()
    const fn = jest.fn()
    bus.on('event', fn)
    bus.emit('event')
    expect(fn).toBeCalled()
    bus.emit('event')
    expect(fn).toBeCalledTimes(2)
  })

  test('emit event with arguments.', () => {
    const bus = new EventBus()
    const fn = jest.fn()
    bus.on('event', fn)
    bus.emit('event', 'a', '1')
    expect(fn).toBeCalledWith('a', '1')
  })

  /**
   * event: event_1
   * --callback: event_1_fn1
   * --callback: event_1_fn2
   * ----event: event_11
   * ------callback: event_11_fn1
   * ------callback: event_11_fn2
   * ------callback: event_11_fn3
   * --------event: event_111
   * ----------callback: event_111_fn1
   * --callback: event_1_fn3
   * ----event: event_12
   * ------callback: event_12_fn1
   * ------callback: event_12_fn2
   * --callback: event_1_fn4
   * event: event_2
   * --callback: event_2_fn1
   */
  test('event stack.', () => {
    const bus = new EventBus()
    bus.on('event_1', function event_1_fn1() {})
    bus.on('event_1', function event_1_fn2() {
      bus.emit('event_11')
    })
    bus.on('event_1', function event_1_fn3() {
      bus.emit('event_12')
    })
    bus.on('event_1', function event_1_fn4() {})
    bus.on('event_2', function event_2_fn1() {})
    bus.on('event_11', function event_11_fn1() {})
    bus.on('event_11', function event_11_fn2() {})
    bus.on('event_11', function event_11_fn3() {
      bus.emit('event_111')
    })
    bus.on('event_12', function event_12_fn1() {})
    bus.on('event_12', function event_12_fn2() {})
    bus.on('event_111', function event_111_fn1() {})

    bus.emit('event_1')
    expect(bus.log()).toEqual([
      'event: event_1',
      '--callback: event_1_fn1',
      '--callback: event_1_fn2',
      '----event: event_11',
      '------callback: event_11_fn1',
      '------callback: event_11_fn2',
      '------callback: event_11_fn3',
      '--------event: event_111',
      '----------callback: event_111_fn1',
      '--callback: event_1_fn3',
      '----event: event_12',
      '------callback: event_12_fn1',
      '------callback: event_12_fn2',
      '--callback: event_1_fn4',
    ])

    bus.emit('event_2')
    expect(bus.log()).toEqual(['event: event_2', '--callback: event_2_fn1'])
  })

  test('event stack.', () => {
    const bus = new EventBus()
    bus.on('event_1', async function event_1_fn1() {})
    bus.on('event_1', async function event_1_fn2() {
      bus.emit('event_11')
    })
    bus.on('event_1', async function event_1_fn3() {
      bus.emit('event_12')
    })
    bus.on('event_1', async function event_1_fn4() {})
    bus.on('event_11', async function event_11_fn1() {})
    bus.on('event_11', async function event_11_fn2() {})
    bus.on('event_11', async function event_11_fn3() {
      bus.emit('event_111')
    })
    bus.on('event_12', async function event_12_fn1() {})
    bus.on('event_12', async function event_12_fn2() {})
    bus.on('event_111', async function event_111_fn1() {})

    bus.emit('event_1')
    expect(bus.log()).toEqual([
      'event: event_1',
      '--callback: event_1_fn1',
      '--callback: event_1_fn2',
      '----event: event_11',
      '------callback: event_11_fn1',
      '------callback: event_11_fn2',
      '------callback: event_11_fn3',
      '--------event: event_111',
      '----------callback: event_111_fn1',
      '--callback: event_1_fn3',
      '----event: event_12',
      '------callback: event_12_fn1',
      '------callback: event_12_fn2',
      '--callback: event_1_fn4',
    ])
  })

  test('emit circularly', () => {
    const bus = new EventBus()
    const fn1 = jest.fn().mockImplementation(function () {
      bus.emit('event2')
    })
    const fn2 = jest.fn().mockImplementation(function () {
      bus.emit('event1')
    })
    bus.on('event1', fn1)
    bus.on('event2', fn2)
    bus.emit('event1')
    expect(fn1).toBeCalledTimes(1)
    expect(fn1).toBeCalledTimes(1)
  })
})
