<template>
  <div id="app">
    <!-- <l-table :columns="columns" :datasource="datasource">
      <template slot-scope="props">
        <td>{{ props.row.id }}</td>
        <td>{{ props.row.name }}</td>
        <td>{{ props.row.email }}</td>
      </template>
    </l-table> -->
    <hr />
    <l-table :columns="columns" :datasource="datasource">
    </l-table>
  </div>
</template>

<script>
import axios from 'axios'
import LTable from './Table/Table'

export default {
  name: 'app',
  components: {
    LTable
  },
  data () {
    return {
      columns: [
        { id: 1, label: 'ID', value: 'id', title: 'Identification' },
        { id: 2, label: 'Name', value: 'name', title: 'Name' },
        { id: 3, label: 'Email', value: 'email', title: 'Email' }
      ],
      // datasource: {
      //   url: 'https://jsonplaceholder.typicode.com/comments'
      // }
      datasource: {
        records: []
      }
    }
  },
  mounted () {
    axios.get('https://jsonplaceholder.typicode.com/comments?_start=0&_limit=25')
      .then(response => {
        this.datasource.records = response.data
      })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 25px;
}
</style>
