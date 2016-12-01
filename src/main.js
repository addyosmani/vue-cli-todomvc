// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

/* eslint-disable no-new */
window.VueApp = new Vue({
    el: '#app',
    render: h => h(App)
})


// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}

// handle routing
function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '')
  if (filters[visibility]) {
    window.VueApp.filter = visibility;
  } else {
    window.location.hash = ''
    window.VueApp.filter = 'all'
  }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()