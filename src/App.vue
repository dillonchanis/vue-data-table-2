<template>
  <div id="app">
    <!-- <l-table :columns="columns" :datasource="datasource">
      <template slot-scope="props">
        <td>{{ props.row.id }}</td>
        <td>{{ props.row.name }}</td>
        <td>{{ props.row.email }}</td>
      </template>
    </l-table> -->
    <l-table :columns="columns"
             :datasource="datasource"
             with-filter
             with-grouping>
    </l-table>
  </div>
</template>

<script>
// import axios from 'axios'
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
        { id: 4, label: 'PostID', value: 'postId', title: 'PostID', active: true }
      ],
      datasource: {
        url: 'https://jsonplaceholder.typicode.com/comments'
      }
    }
  },
  created () {
    // axios.get('https://jsonplaceholder.typicode.com/comments?_start=0&_limit=25')
    //   .then(response => {
    //     this.datasource.records = response.data
    //   })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #2c3e50;
  padding: 25px;
  background: #fefefe;
}
</style>
