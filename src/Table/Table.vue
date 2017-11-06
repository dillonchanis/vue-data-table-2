<template>
  <div class="lunar-table__container">
    <div class="lunar-table__drop-zone">
      <div class="lunar-table__group-indicator" v-for="group in groupingRows" :key="group.id">
        &times; {{ group.label }}
      </div>
    </div>
    <table role="grid" class="lunar-table">
      <thead class="lunar-table__head">
        <tr role="row">
          <template v-for="(group, index) in groupingRows">
            <th :key="group.id">&nbsp;</th>
          </template>
          <th v-for="column in columns"
              :key="column.value"
              class="lunar-table__head-item"
              role="columnheader"
              @click="sortTable(column)">
              {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="lunar-table__body">

        <tr v-for="(group, index) in groupingRows" role="row" class="lunar-grouping__row" :key="group.id">
          <td v-for="i in index" :key="i">&nbsp;</td>
          <td :colspan="columns.length">
            {{ group.label }}
          </td>
        </tr>

        <template v-if="hasBodySlot">
          <tr v-for="row in rows" :key="row.id">
            <template v-for="(group, index) in groupingRows">
              <td :key="group.id">&nbsp;</td>
            </template>
            <slot :row="row"></slot>
          </tr>
        </template>

        <template v-else>
          <l-table-data
            :rows="rows"
            :columns="columns"
            :no-records="noRecords"
            :editable="editable"
            :grouping="grouping">
          </l-table-data>
        </template>

      </tbody>
    </table>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'

import LTableData from './components/TableData'

export default {
  name: 'LunarTable',

  components: {
    LTableData
  },

  props: {
    columns: {
      type: Array
    },
    datasource: {
      type: [Object, Array],
      required: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    groupingIndex: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 25
    },
    noRecords: {
      type: String,
      default: 'No records found.'
    },
    noResults: {
      type: String,
      default: 'No results found.'
    },
    sortBy: {
      type: String,
      default: 'id'
    }
  },

  data () {
    return {
      filter: '',
      grouping: [],
      pagination: {
        limit: this.limit
      },
      response: {
        data: [],
        errors: []
      },
      sort: {
        by: this.sortBy,
        order: 'asc'
      }
    }
  },

  computed: {
    hasBodySlot () {
      return _.isEmpty(this.$scopedSlots)
    },
    groupingColumn () {
      let id = this.grouping[this.groupingIndex]
      return this.columns.find(column => column.id === id)
    },
    groups () {
      let id = this.groupingColumn.id
      return _.groupBy(this.rows, row => row[id])
    },
    groupingRows () {
      return this.grouping.map(columnId => this.columns.find(column => column.id === columnId))
    },
    rows () {
      let data = this.response.data

      data = data.filter(row => {
        return Object.keys(row).some(key => {
          return String(row[key]).toLowerCase().indexOf(this.filter.toLowerCase()) > -1
        })
      })

      if (this.sort.by) {
        data = _.orderBy(data, item => {
          let value = item[this.sort.by]
          if (!isNaN(Number(value))) {
            return Number(value)
          }
          return String(value).toLowerCase()
        }, this.sort.order)
      }

      return data
    }
  },

  methods: {
    getRecords () {
      // Placeholder for grouping
      this.grouping.push(this.columns[1].id)
      this.grouping.push(this.columns[0].id)

      if (this.datasource.url) {
        return axios.get(`${this.datasource.url}?_start=0&_limit=${this.pagination.limit}`)
          .then((response) => {
            this.response.data = response.data
          })
          .catch((error) => {
            this.response.errors = error
          })
      }

      this.response.data = this.datasource.records
    },
    sortTable (column) {
      this.sort.by = column.value
      this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc'
    }
  },

  mounted () {
    this.getRecords()
  }
}
</script>

<style lang="scss" scoped>
.lunar-table {

  &__head {

    &-item {
      text-align: left;
    }

  }

  &__group-indicator {
    display: inline-block;
    border: 1px solid #333;
    padding: 6px 12px;
    margin-right: 15px;
  }

}
</style>
