<template>
  <div class="lunar-table__container">
    <div class="lunar-table__filter-container" v-if="withFilter">
      <l-table-filter :query="filter" @input="updateFilter" />
    </div>

    <l-table-group v-if="withGrouping"
      :groupingRows="groupingRows"
      :dropzoneActive="grouping.dropzoneActive"
      @removeGroup="removeGroup"
      @dropGroup="drop" />

    <table role="grid" class="lunar-table" :aria-colcount="columns.length" :aria-rowcount="rows.length">
      <thead class="lunar-table__head">
        <tr role="row">
          <th v-for="column in columns"
              v-if="column.active"
              :key="column.value"
              class="lunar-table__head-item"
              role="columnheader"
              :draggable="withGrouping"
              @dragover="grouping.dropzoneActive = true"
              @dragleave="grouping.dropzoneActive = false"
              @dragstart="dragStart(column)"
              @click="sortTable(column)">
              {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="lunar-table__body">
        <tr v-for="row in rows" :key="row.id">
          <l-table-header-cell v-if="isHeaderCell(row)" :row="row" />
          <l-table-cell v-else v-for="column in columns"
            :key="column.id"
            :column="column"
            :row="row"
            :editable="editable" />
        </tr>
      </tbody>
    </table>
    <div class="lunar-table__page-size-container">
      <l-table-page-size :pageSizes="pagination.pageSizes" @change="updatePageSize" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'

// Core
import LTableHeaderCell from './components/LunarTableHeaderCell.js'
import LTableCell from './components/LunarTableDataCell'

// Addons
import LTableFilter from './components/Filter/LunarTableFilter'
import LTablePageSize from './components/Pagination/LunarTablePageSize'
import LTableGroup from './components/Grouper/LunarTableGrouper'

export default {
  name: 'lunar-table',

  components: {
    LTableHeaderCell,
    LTableCell,
    LTableFilter,
    LTablePageSize,
    LTableGroup
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
    groupTextSeparator: {
      type: String,
      default: '-'
    },
    limit: {
      type: Number,
      default: 25
    },
    index: {
      type: Number,
      default: 0
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
    },
    withFilter: {
      type: Boolean,
      default: false
    },
    withGrouping: {
      type: Boolean,
      default: false
    },
    withPageSize: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      filter: '',
      grouping: {
        current: [],
        dragColumn: {},
        dropzoneActive: false
      },
      pagination: {
        limit: this.limit,
        pageSizes: [10, 25, 50, 'All']
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
    groupingRows () {
      return this.grouping.current.map(columnVal => this.columns.find(column => column.value === columnVal))
    },
    rows () {
      let data = this.response.data

      if (this.grouping.current.length) {
        let index = 0
        let header

        for (index; index < this.grouping.current.length; index++) {
          const currentGrouping = this.grouping.current[index]
          const groupedData = _.groupBy(data, item => {
            if (_.isObject(item)) {
              return item[currentGrouping]
            } else {
              return item
            }
          })

          data = _.flattenDeep(Object.keys(groupedData).map((key, i) => {
            if (!key.includes(this.groupTextSeparator)) {
              header = `${currentGrouping} ${this.groupTextSeparator} ${key}`
              return [header, groupedData[key][0]]
            }

            return [groupedData[key][0]]
          }))
        }
      }

      data = data.map(row => {
        if (!_.isObject(row)) {
          return {
            headerText: row,
            colSpan: '100%',
            class: 'grouped-row-header'
          }
        }
        return row
      })

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
    drop (e) {
      this.grouping.current.push(this.grouping.dragColumn.value)
    },
    dragStart (column) {
      this.grouping.dragColumn = column
    },
    isHeaderCell (row) {
      return row.hasOwnProperty('headerText')
    },
    getRecords () {
      // Placeholder for grouping
      // this.grouping.current.push(this.columns[1].value)
      // this.grouping.current.push(this.columns[2].value)
      // this.grouping.current.push(this.columns[3].value)

      if (this.datasource.url) {
        return axios.get(`${this.datasource.url}?_start=0&_limit=${this.pagination.limit}`)
          .then((response) => {
            this.response.data = response.data
          })
          .catch((error) => {
            this.response.errors = error
          })
      } else if (this.datasource.records.length && !this.datasource.url) {
        this.response.records = this.datasource.records
        return
      }

      console.warn('You must provide a datasource URL or an array of records.')
    },
    removeGroup (value) {
      this.grouping.current = _.remove(this.grouping.current, g => g.value === value)
    },
    sortTable (column) {
      this.sort.by = column.value
      this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc'
    },
    updateFilter (filter) {
      this.filter = filter
    },
    updatePageSize (limit) {
      this.pagination.limit = limit
      this.getRecords()
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

  &__drop-zone {
    height: 90px;
    width: 100%;
    background: cornflowerblue;
  }

  &__page-size-container {
    margin: 15px auto;
  }

  .grouped-row-header {
    background: #ddd;
  }

}
</style>