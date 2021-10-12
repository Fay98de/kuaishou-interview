import LinkedListNode from './linked-list-node'

export interface Item {
  id: number
  before?: number
  after?: number
  first?: true
  last?: true
}

function sort(arr: Item[]) {
  const l = arr.length
  const map: Record<number, LinkedListNode<Item>> = {}
  let result: Item[] = []
  let first: LinkedListNode<Item> | undefined = undefined
  let last: LinkedListNode<Item> | undefined = undefined
  let tail: LinkedListNode<Item> | undefined = undefined
  let count = 0
  let item = arr.shift()

  while (item) {
    count++
    map[item.id] = map[item.id] || new LinkedListNode(item)
    const node = map[item.id]
    if (item.before !== undefined) {
      const next = map[item.before]
      if (!next && count >= l) {
        throw `Can not find item ${item.before} referred by item ${item.id}.`
      }
      if (!next) {
        arr.push(item)
        item = arr.shift()
        continue
      }
      if (next.prev) {
        node.prev = next.prev
        next.prev.next = node
      } else {
        first = node
      }
      node.next = next
      next.prev = node
      if (next.value.first) {
        throw `Can not place item ${item.id} before first item ${item.before}.`
      }
    } else if (item.after !== undefined) {
      const prev = map[item.after]
      if (!prev && count >= l) {
        throw `Can not find item ${item.after} referred by item ${item.id}.`
      }
      if (!prev) {
        arr.push(item)
        item = arr.shift()
        continue
      }
      if (prev.next) {
        prev.next.prev = node
        node.next = prev.next
      } else {
        tail = node
      }
      node.prev = prev
      prev.next = node
      if (prev.value.last) {
        throw `Can not place item ${item.id} after last item ${item.after}.`
      }
    } else if (item.first && first) {
      node.next = first
      first.prev = node
      first = node
    } else if (item.first && !first) {
      first = node
      tail = node
    } else if (item.last) {
      last = node
    } else if (tail) {
      tail.next = node
      node.prev = tail
      tail = node
    } else {
      first = node
      tail = node
    }
    item = arr.shift()
  }

  if (tail) {
    tail.next = last
    last && (last.prev = tail)
  } else {
    first = last
  }

  let node = first

  while (node) {
    result.push(node.value)
    node = node.next
  }

  return result
}

export default sort
