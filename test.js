import Vue from './src/instance'

const testDom = document.getElementById('test')
const helloComp = Vue.component('hello', {
  render: function (c) {
    const { hello } = this.$data
    return c('div', {}, [
      c('p', {}, `I'm miniVue. ${hello.value}`),
    ])
  }
})


const vm = new Vue({
  el: testDom,
  data: { text: { value: 'hello world!' } },
  render: function (c) {
    const { text } = this.$data
    return c('div', {}, [
      c(helloComp, { hello: text }, []),
      c('button', {}, `clice me`),
    ])
  },
  listeners: {
    'click': function (e) { alert('hello again!') }
  }
})

setTimeout(() => {
  vm.$data.text.value = '1s passed!'
}, 1000)
