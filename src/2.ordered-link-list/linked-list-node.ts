export default class LinkedListNode<T> {
  value: T
  prev?: LinkedListNode<T>
  next?: LinkedListNode<T>

  constructor(value: T) {
    this.value = value
  }
}
