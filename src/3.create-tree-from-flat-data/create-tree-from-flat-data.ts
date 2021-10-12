interface TreeNode {
  id: number
  name: string
  parentId?: number
  children?: TreeNode[]
}

function createTree(treeNodes: TreeNode[]) {
  const map: Record<number, TreeNode> = {}
  let root: TreeNode | null = null
  let node = treeNodes.shift()

  while (node) {
    if (node.parentId === undefined && root) {
      throw new Error(`Duplicate root: ${root.id}, ${node.id}`)
    }
    if (node.parentId === undefined) {
      root = node
      map[node.id] = node
      node = treeNodes.shift()
      continue
    }
    const parent = map[node.parentId!]
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(node)
    } else if (map[node.id]) {
      throw new Error(`Can not find parent node of ${node.id}`)
    } else {
      treeNodes.push(node)
    }
    map[node.id] = node
    node = treeNodes.shift()
  }

  return root
}

export default createTree
