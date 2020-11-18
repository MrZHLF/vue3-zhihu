import { onUnmounted } from 'vue'

function useDOMCreate(nodeID: string) {
  const node = document.createElement('div')
  node.id = nodeID
  document.body.append(node)
  onUnmounted (() => {
    document.body.removeChild(node)
  })
}

export default useDOMCreate