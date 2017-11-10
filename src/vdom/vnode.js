import nodeOps from './node-ops'
import { isPrimitive } from '../util'

export default class VNode {
  constructor (
    tag,
    data,
    children,         // 非textVNode 会有 children，而没有 text
    text,             // textVNode 会有 text，而没有 children
    elm,
    componentOptions, // 为 component 做准备，暂时没什么用处
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.key = data && data.key
    this.componentOptions = componentOptions
  }
}

/**
 * 创建 vnode 都需要通过下面三个函数来完成，
 * 从而保证所有 vnode 分为两种:
 * - 普通 vnode: 有 tag, children, 而没有 text
 * - textVNode: 没有 tag, children, 而有 text
 * 这一假设会在 patch.js 中的 patchVnode, createElm 函数中用到
 */
export function emptyNodeAt (elm) {
  return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
}

export function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}


function normalizeChildren (children) {
  return isPrimitive(children) ?
    [createTextVNode(children)] :
    children
}


export function createVNode (tag, data, children = []) {
  children = normalizeChildren(children)

  if (typeof tag === 'string') {
    return new VNode(tag, data, children, undefined, undefined)
  } else {
    return createCompVNode(tag, data, children)
  }
  
}

export function createCompVNode (Ctor, data, children) {
  const name = Ctor.options.name
  const vnode = new VNode(
    `vue-component-${name}`,
    data, [], undefined, undefined,
    { Ctor, children },
  )
  return vnode
}
