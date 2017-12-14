<template>
  <div id="app">
    <!-- <l-table :columns="columns"
             :datasource="datasource.records"
             height="400px"
             editable
             with-filter
             multiSelect
             with-grouping>
        <td slot="id" slot-scope="props">{{ props.row.id }}</td>
        <td slot="name" slot-scope="props"><em>{{ props.row.name }}</em></td>
        <td slot="email" slot-scope="props">{{ props.row.email }}</td>
    </l-table> -->
    <l-table :columns="columns"
             :datasource="datasource.records"
             height="400px"
             with-filter
             multi-select
             @select-row="selectRow"
             @select-all="selectAll"
             with-grouping>
    </l-table>

    <button @click="someAction">Click me</button>
  </div>
</template>

<script>
import axios from 'axios'
import LTable from './Table/LunarTable'

export default {
  name: 'app',
  components: {
    LTable
  },
  data () {
    return {
      columns: [
        { id: 1, label: 'ID', value: 'id', title: 'Identification', active: true },
        { id: 2, label: 'Name', value: 'name', title: 'Name', active: true },
        { id: 3, label: 'Email', value: 'email', title: 'Email', active: true },
        { id: 4, label: 'PostID', value: 'postId', title: 'PostID', active: false }
      ],
      datasource: {
        records: []
      },
      items: [],
      anotherSetOfItemslol: []
    }
  },
  methods: {
    selectRow (payload) {
      this.items = payload
    },
    selectAll (payload) {
      this.anotherSetOfItemslol = payload
    },
    someAction () {
      alert(JSON.stringify(this.items))
    }
  },
  created () {
    axios.get('https://jsonplaceholder.typicode.com/comments?_limit=25')
      .then(response => {
        this.datasource.records = response.data
      })
  }
}
</script>

<style>
html, body {
  background: #fff;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #2D2B49;
  padding: 25px;
}
</style>
