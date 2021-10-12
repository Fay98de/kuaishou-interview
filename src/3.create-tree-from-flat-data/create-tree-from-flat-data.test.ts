import createTree from './create-tree-from-flat-data'

describe('3.create-tree-from-flat-data', () => {
  test('Valid input.', () => {
    const treeNodes = [
      { id: 1, name: 'i1' },
      { id: 2, name: 'i2', parentId: 1 },
      { id: 5, name: 'i5', parentId: 3 },
      { id: 3, name: 'i3', parentId: 2 },
      { id: 4, name: 'i4', parentId: 2 },
    ]
    const root = createTree(treeNodes)

    expect(root).toEqual({
      id: 1,
      name: 'i1',
      children: [
        {
          id: 2,
          name: 'i2',
          parentId: 1,
          children: [
            {
              id: 3,
              name: 'i3',
              parentId: 2,
              children: [
                {
                  id: 5,
                  name: 'i5',
                  parentId: 3,
                },
              ],
            },
            {
              id: 4,
              name: 'i4',
              parentId: 2,
            },
          ],
        },
      ],
    })
  })

  test('Invalid input: duplicate root.', () => {
    const treeNodes = [
      { id: 1, name: 'i1' },
      { id: 2, name: 'i2', parentId: 1 },
      { id: 4, name: 'i4', parentId: 3 },
      { id: 3, name: 'i3', parentId: 2 },
      { id: 9, name: 'i9' },
    ]

    expect(function () {
      createTree(treeNodes)
    }).toThrow('Duplicate root: 1, 9')
  })

  test('Invalid input: some node does not have parent.', () => {
    const treeNodes = [
      { id: 1, name: 'i1' },
      { id: 2, name: 'i2', parentId: 1 },
      { id: 4, name: 'i4', parentId: 3 },
      { id: 3, name: 'i3', parentId: 2 },
      { id: 8, name: 'i8', parentId: 7 },
    ]

    expect(function () {
      createTree(treeNodes)
    }).toThrow('Can not find parent node of 8')
  })
})
