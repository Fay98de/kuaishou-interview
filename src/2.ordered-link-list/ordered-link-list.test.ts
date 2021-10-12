import sort, { Item } from './ordered-link-list'

describe('ordered-link-list', () => {
  test('valid example input.', () => {
    const input: Item[] = [
      { id: 1 },
      { id: 2, before: 1 },
      { id: 3, after: 1 },
      { id: 5, first: true },
      { id: 6, last: true },
      { id: 7, after: 8 },
      { id: 8 },
      { id: 9 },
    ]
    const output = sort(input)
    expect(output).toEqual([
      { id: 5, first: true },
      { id: 2, before: 1 },
      { id: 1 },
      { id: 3, after: 1 },
      { id: 8 },
      { id: 7, after: 8 },
      { id: 9 },
      { id: 6, last: true },
    ])
  })

  test('invalid item before first.', () => {
    const input: Item[] = [
      { id: 1 },
      { id: 2, before: 5 },
      { id: 3, after: 1 },
      { id: 5, first: true },
      { id: 6, last: true },
      { id: 7, after: 8 },
      { id: 8 },
      { id: 9 },
    ]
    expect(() => sort(input)).toThrow(`Can not place item 2 before first item 5.`)
  })

  test('invalid item after last.', () => {
    const input: Item[] = [
      { id: 1 },
      { id: 2, before: 1 },
      { id: 3, after: 6 },
      { id: 5, first: true },
      { id: 6, last: true },
      { id: 7, after: 8 },
      { id: 8 },
      { id: 9 },
    ]
    expect(() => sort(input)).toThrow(`Can not place item 3 after last item 6.`)
  })

  test('item.before is not exist.', () => {
    const input: Item[] = [
      { id: 1 },
      { id: 2, before: 10 },
      { id: 3, after: 1 },
      { id: 5, first: true },
      { id: 6, last: true },
      { id: 7, after: 8 },
      { id: 8 },
      { id: 9 },
    ]
    expect(() => sort(input)).toThrow(`Can not find item 10 referred by item 2.`)
  })

  test('item.after is not exist.', () => {
    const input: Item[] = [
      { id: 1 },
      { id: 2, before: 1 },
      { id: 3, after: 10 },
      { id: 5, first: true },
      { id: 6, last: true },
      { id: 7, after: 8 },
      { id: 8 },
      { id: 9 },
    ]
    expect(() => sort(input)).toThrow(`Can not find item 10 referred by item 3.`)
  })
})
