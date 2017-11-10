import { emptyNodeAt, createVNode } from '../vdom/vnode'
import patch from '../vdom/patch'

import Watcher from '../observer/watcher'
import { observe } from '../observer'

import { isUndef, isDef, mergeOptions, noop } from '../util'

import { updateComponentListeners } from './events'


class Vue {

  constructor (options) {
    const vm = this

    const classOptions = vm.constructor.options
    vm.$options = mergeOptions(classOptions, options)

    // init data
    vm.$data = vm.$options.data
    observe(vm.$data)

    vm.$mount(vm.$options.el)

    const { listeners } = vm.$options
    if (listeners) {
      updateComponentListeners(vm, listeners)
    }
  }

  $mount (el) {
    const vm = this
    vm.$el = el

    const updateComponent = () => {
      // console.log('~~~~')
      // create new vnode by options.render
      const newVnode = vm.$options.render.call(vm, createVNode)
      vm._update(newVnode)
    }

    vm._watcher = new Watcher(vm, updateComponent, noop)
  }

  _update (newVnode) {
    const vm = this

    const isInitial = isUndef(vm._vnode)
    // sync!!
    if (isInitial && isDef(vm.$el)) { vm._vnode = emptyNodeAt(vm.$el) }

    const prevVnode = vm._vnode
    vm._vnode = newVnode
    vm.__patch__(prevVnode, newVnode)
    // sync!!
    vm.$el = newVnode.elm
  }

  __patch__ (...args) { return patch(...args) }

}

Vue.options = {}

Vue.component = function (name, definition = {}) {
  definition.name = name
  
  class VueComponent extends Vue {}
  VueComponent.options = mergeOptions(Vue.options, definition)
  return VueComponent
}

export default Vue