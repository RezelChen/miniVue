import Dep from './dep'
import { isDef, isUndef, def, isObject, hasOwn } from '../util'

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
export class Observer {

  constructor (value) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)
    this.walk(value)
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj) {
    const keys = Object.keys(obj)
    keys.forEach((key) => {
      defineReactive(obj, key, obj[key])
    })
  }
}


/**
 * Define a reactive property on an Object.
 */
export function defineReactive (obj, key, val) {
  const dep = new Dep()

  let childOb = observe(val)
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {

      if (isDef(Dep.target)) {
        dep.depend()
        if (isDef(childOb)) {
          childOb.dep.depend()
        }
      }

      return val
    },
    set: function reactiveSetter (newVal) {

      // console.log('set!', newVal)
      if (newVal === val || (newVal !== newVal && val !== val)) {
        return
      }

      val = newVal
      childOb = observe(newVal)  // reObserver for newVal
      dep.notify()
    }
  })
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value) {
  if (!isObject(value)) { return }

  const hasOb = hasOwn(value, '__ob__') && value.__ob__ instanceof Observer
  const ob = hasOb ? value.__ob__ : new Observer(value)

  return ob
}


/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target, key, val) {
  if (hasOwn(target, key)) {
    target[key] = val
    return val
  }

  const ob = target.__ob__
  if (isUndef(ob)) {
    target[key] = val
    return val
  }

  // ob.value is target
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
export function del (target, key) {
  const ob = target.__ob__
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (isUndef(ob)) {
    return
  }
  ob.dep.notify()
}

window.__set = set