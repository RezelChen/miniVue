import $ from 'jquery'

import { isUndef } from '../util'

export function updateComponentListeners (vm, listeners, oldListeners = {}) {
  const add = (event, fn) => { $(vm.$el).on(event, fn) }
  const remove = (event, fn) => { $(vm.$el).off(event, fn) }

  for (name in listeners) {
    const cur = listeners[name]
    const old = oldListeners[name]

    if (isUndef(old)) {
      add(name, cur)
    } else if (cur !== old) {
      remove(name, old)
      add(name, cur)
    }
  }

  for (name in oldListeners) {
    if (isUndef(listeners[name])) {
      remove(name, old)
    }
  }
}