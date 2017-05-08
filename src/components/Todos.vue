<template>
    <section class="todoapp">
        <header class="header">
            <h1>Todos</h1>
            <input type="text" class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?"
                   v-model="newTodo" @keyup.enter="addTodo"/>
        </header>
        <section class="main" v-show="todos.length" v-cloak>
            <input type="checkbox" class="toggle-all" v-model="allDone">
            <ul class="todo-list">
                <li class="todo" v-for="todo in filteredTodos"
                    :class="{completed : todo.completed, editing : todo === editing }">
                    <div class="view">
                        <input type="checkbox" v-model="todo.completed" class="toggle">
                        <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
                        <button class="destroy" @click.prevent="deleteTodo(todo)"></button>
                    </div>
                    <input type="text" class="edit" v-model="todo.title" @keyup.enter="doneEdit" @blur="doneEdit"
                           v-todoFocus="todo === editing">
                </li>
            </ul>
        </section>
        <footer class="footer" v-show="todos.length > 0">
            <span class="todo-count">
            <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
            </span>
            <ul class="filters">
                <li><a href="#/all" :class="{selected: filter == 'all'}" @click="filter = 'all'">All</a></li>
                <li><a href="#/active" :class="{selected: filter == 'active'}" @click="filter = 'active'">Active</a>
                </li>
                <li><a href="#/completed" :class="{selected: filter == 'completed'}" @click="filter = 'completed'">Completed</a>
                </li>
            </ul>
            <button class="clear-completed" v-show="completed" @click.prevent="deleteCompleted">Clear Completed</button>
        </footer>
    </section>
</template>

<script>
    import Vue from 'vue'

    var todoStorage = {
        fetch: function () {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(function ({todos}) {
                    if (!todos) {
                        todos = [];
                    }
                    todos.forEach(function (todo, index) {
                        todo.id = index
                    })
                    todoStorage.uid = todos.length
                    resolve(todos)
                });
            });
        },
        save: function (todos) {
            let text = todos.filter(todo => !todo.completed).length.toString();
            if (text === '0') {
                text = ''
            }
            chrome.browserAction.setBadgeText({text});
            chrome.storage.sync.set({todos})
        }
    }

    export default {
        data () {
            return {
                todos: [],
                newTodo: '',
                filter: 'all',
                editing: null
            }
        },
        filters: {
            pluralize: function (n) {
                return n === 1 ? 'item' : 'items'
            }
        },
        directives: {
            todoFocus (el, value) {
                if (value) {
                    Vue.nextTick(_ => {
                        el.focus()
                    })
                }
            }
        },
        methods: {
            addTodo () {
                this.todos.push({
                    completed: false,
                    title: this.newTodo
                })
                this.newTodo = ''
            },
            deleteTodo (todo) {
                this.todos = this.todos.filter(t => t !== todo)
            },
            deleteCompleted () {
                this.todos = this.todos.filter(todo => !todo.completed)
            },
            editTodo (todo) {
                this.editing = todo
            },
            doneEdit () {
                this.editing = null
            }
        },
        watch: {
            todos: {
                handler: function (todos) {
                    todoStorage.save(todos)
                },
                deep: true
            }
        },
        computed: {
            remaining () {
                return this.todos.filter(todo => !todo.completed).length
            },
            completed () {
                return this.todos.filter(todo => todo.completed).length
            },
            filteredTodos () {
                if (this.filter === 'active') {
                    return this.todos.filter(todo => !todo.completed)
                } else if (this.filter === 'completed') {
                    return this.todos.filter(todo => todo.completed)
                }

                return this.todos
            },
            allDone: {
                get () {
                    return this.remaining === 0
                },
                set (value) {
                    this.todos.forEach(todo => {
                        todo.completed = value
                    })
                }
            }
        },
        created() {
            todoStorage.fetch().then((todos) => {
                this.todos = todos;
            });
        }
    }
</script>
