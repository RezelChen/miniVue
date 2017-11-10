import nodeOps from './node-ops'
import {
  isDef,
  isUndef,
  isTrue,
  isPrimitive,
} from '../util'

function sameVnode (a, b) {
  return a.key === b.key &&
    a.tag === b.tag &&
    isDef(a.data) === isDef(b.data) &&
    isDef(a.text) === isDef(b.text) &&
    isDef(a.children) === isDef(b.children)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}

function createElm (vnode) {
  if (createComp(vnode)) { return vnode.elm }

  const { tag, children, text } = vnode
  if (isDef(text)) {
    vnode.elm = nodeOps.createTextNode(vnode.text)
  } else {
    vnode.elm = nodeOps.createElement(tag)
    children.forEach((child) => {
      nodeOps.appendChild(vnode.elm, createElm(child))
    })
  }
  return vnode.elm
}

function createComp (vnode) {
  createComponentInstance(vnode)
  if (isUndef(vnode.componentInstance)) { return false }
  else {
    vnode.elm = vnode.componentInstance.$el
    window._instance = vnode.componentInstance
    return true
  }
}

function createComponentInstance (vnode) {
  if (isUndef(vnode.componentOptions)) { return }
  else {
    const Ctor = vnode.componentOptions.Ctor
    const options = { data: vnode.data  }
    const child = vnode.componentInstance = new Ctor(options)
  }
}


function addVnodes (parentElm, before, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (ch != null) {
      nodeOps.insertBefore(parentElm, createElm(ch), before)
    }
  }
}

function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      nodeOps.removeChild(parentElm, ch.elm)
    }
  }
}

function updateChildren (parentElm, oldCh, newCh) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1

  let oldStartVnode = oldCh[oldStartIdx]
  let oldEndVnode = oldCh[oldEndIdx]
  let newStartVnode = newCh[newStartIdx]
  let newEndVnode = newCh[newEndIdx]

  let oldKeyToIdx

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]  // Vnode has been moved left
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    }  else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {  // Vnode moved right
      patchVnode(oldStartVnode, newEndVnode)
      const oldEndNext = nodeOps.nextSibling(oldEndVnode.elm)
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, oldEndNext)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      patchVnode(oldEndVnode, newStartVnode)
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {

      // create oldKeyToIdx
      if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) }
      
      const idxInOld = oldKeyToIdx[newStartVnode.key]
      if (isDef(idxInOld) && sameVnode(newStartVnode, oldCh[idxInOld])) {
        const vnodeToMove = oldCh[idxInOld]
        patchVnode(vnodeToMove, newStartVnode)
        oldCh[idxInOld] = undefined
        nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        newStartVnode = newCh[++newStartIdx]
      } else {  // New element
        const elm = createElm(newStartVnode)
        nodeOps.insertBefore(parentElm, elm, oldStartVnode.elm)
        newStartVnode = newCh[++newStartIdx]
      }

    }
  }
  
  if (oldStartIdx > oldEndIdx) {
    const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }

}

/**
 * patchVnode 假设了 sameVnode(oldVnode, vnode) === true
 * 事实上也是如此
 */
function patchVnode (oldVnode, vnode) {
  if (oldVnode === vnode) { return }
  
  const elm = vnode.elm = oldVnode.elm
  
  if (isUndef(vnode.text)) {
    const oldCh = oldVnode.children
    const ch = vnode.children
    updateChildren(elm, oldCh, ch)
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text)
  }
}

export default function patch (oldVnode, vnode) {
  
  if (isUndef(oldVnode) && isUndef(vnode)) { return }
  if (isUndef(oldVnode)) { createElm(vnode); return }

  const oldElm = oldVnode.elm
  const parent = nodeOps.parentNode(oldElm)

  if (isUndef(vnode)) { removeVnodes(parent, [oldVnode], 0, 0); return }
  if (sameVnode(oldVnode, vnode)) { patchVnode(oldVnode, vnode); return }
  else {
    const newElm = createElm(vnode)
    nodeOps.insertBefore(parent, newElm, nodeOps.nextSibling(oldElm))
    removeVnodes(parent, [oldVnode], 0, 0)
    return
  }
}
