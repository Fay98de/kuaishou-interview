type Callback = (...args: any[]) => any | Promise<any>

interface LogStack {
  event: string
  stacks: (LogStack | null)[]
}

export default class {
  private callbacks: Record<string, Callback[]> = {}
  private eventStack: string[] = []
  private logStacks: LogStack[] = []

  getCallbacks() {
    return this.callbacks
  }

  on(event: string, callback: Callback) {
    const { callbacks } = this
    callbacks[event] = callbacks[event] || []
    callbacks[event].push(callback)
    return callbacks
  }

  off(event: string, callback?: Callback) {
    const { callbacks } = this
    if (!callback) {
      callbacks[event] = []
      return callbacks
    }
    const queue = (callbacks[event] = callbacks[event] || [])
    let i = 0
    while (i < queue.length) {
      if (queue[i] === callback) {
        queue.splice(i, 1)
      } else {
        i++
      }
    }
    return callbacks
  }

  emit(event: string, ...args: any[]) {
    const { callbacks, eventStack } = this
    // stop circularly emitting
    if (eventStack.includes(event)) {
      this.log()
      return
    }
    if (eventStack.length === 0) {
      this.logStacks = []
    }
    const { logStacks } = this
    eventStack.push(event)
    const prevLogStack = logStacks[logStacks.length - 1]
    const currentLogStack: LogStack = { event, stacks: [] }
    if (prevLogStack) {
      prevLogStack.stacks[prevLogStack.stacks.length - 1] = currentLogStack
    }
    logStacks.push(currentLogStack)

    const queue = (callbacks[event] = callbacks[event] || [])
    for (let callback of queue) {
      currentLogStack.stacks.push(null)
      callback(...args)
    }
    eventStack.pop()
    if (logStacks.length > 1) {
      logStacks.pop()
    }
    if (eventStack.length === 0) {
      this.log()
    }
  }

  log() {
    const { callbacks, logStacks } = this
    const logStrings: string[] = []
    let stackDepth = 0

    ;(function generateLog(logStack: LogStack) {
      const { event, stacks = [] } = logStack
      logStrings.push(`${'-'.repeat(stackDepth * 4)}event: ${event}`)
      stackDepth++
      const queue = callbacks[event!]
      stacks.forEach((logStack, i) => {
        logStrings.push(`${'-'.repeat(stackDepth * 4 - 2)}callback: ${queue[i].name}`)
        if (!logStack) return
        generateLog(logStack)
      })
      stackDepth--
    })(logStacks[0])

    const log = logStrings.join('\n')
    console.log(log)
    return logStrings
  }
}
