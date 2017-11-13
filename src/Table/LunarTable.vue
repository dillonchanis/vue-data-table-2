<template>
  <div class="lunar-table__container">
    <div class="lunar-table__options">
      <a href="#" @click.prevent="settings.open = !settings.open">
        <icon @click="settings.open = !settings.open" name="cog"></icon>
      </a>
      <div v-if="settings.open">
        <ul class="list list--inline">
          <li class="list-item" v-for="column in columns" :key="column.key">
            <label>
              <input type="checkbox" v-model="column.active" />
              {{ column.label }}
            </label>
          </li>
        </ul>
      </div>
    </div>

    <div class="lunar-table__filter-container" v-if="withFilter">
      <l-table-filter :query="filter" @input="updateFilter" />
    </div>

    <l-table-group v-if="withGrouping"
      :groupingRows="groupingRows"
      :dropzoneActive="grouping.dropzoneActive"
      @removeGroup="removeGroup"
      @dropGroup="addGrouping" />

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
              <icon v-if="sort.by === column.value"
                    :name="sort.order === 'asc' ? 'sort-asc' : 'sort-desc'"></icon>
              {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="rows.length" class="lunar-table__body">
        <template v-for="row in rows">
          <l-table-header-cell v-if="row.grouped.length" :row="row" :key="row.id" />
          <tr :key="row.id">
            <l-table-cell v-for="column in columns"
              :key="column.id"
              :column="column"
              :grouping="grouping.current"
              :row="row"
              :editable="editable" />
          </tr>
        </template>
      </tbody>
    </table>
    <div class="lunar-table__page-size-container">
      <l-table-page-size :pageSizes="pagination.pageSizes" @change="updatePageSize" />
      <l-table-pagination :pagination="pagination" @pageSwitch="updatePagination" />
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
import LTablePagination from './components/Pagination/LunarTablePagination'
import LTableGroup from './components/Grouper/LunarTableGrouper'

import 'vue-awesome/icons/sort-asc'
import 'vue-awesome/icons/sort-desc'
import 'vue-awesome/icons/cog'

export default {
  name: 'lunar-table',

  components: {
    LTableHeaderCell,
    LTableCell,
    LTableFilter,
    LTablePageSize,
    LTablePagination,
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
        pageSizes: [25, 50, 100, 'All'],
        current: 1,
        total: 100
      },
      response: {
        data: [],
        errors: []
      },
      settings: {
        open: false
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

      data = data.map(rows => {
        return Object.assign(rows, {
          grouped: []
        })
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

      if (this.grouping.current.length) {
        this.grouping.current.map(currentGrouping => {
          const groupedData = _.groupBy(data, item => item[currentGrouping])
          data = _.flattenDeep(Object.keys(groupedData).map(key => {
            const rows = groupedData[key]
            return rows.map((row, idx) => {
              if (!key.includes(this.groupTextSeparator)) {
                const title = `${currentGrouping} ${this.groupTextSeparator} ${key}`
                row.grouped.push(title)

                if (idx >= 1 && _.isEqual(rows[idx - 1].grouped.sort(), row.grouped.sort())) {
                  row.grouped = []
                }

                return [row]
              }

              return [row]
            })
          }))
        })
      }

      return this.paginate(data)
    }
  },

  methods: {
    addGrouping (e) {
      if (!this.grouping.current.includes(this.grouping.dragColumn.value)) {
        this.grouping.current.push(this.grouping.dragColumn.value)
      }
    },
    dragStart (column) {
      this.grouping.dragColumn = column
    },
    getRecords () {
      if (this.datasource.url) {
        return axios.get(`${this.datasource.url}?_start=0&_limit=${this.pagination.total}`)
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
    paginate (records) {
      const offset = (this.pagination.current - 1) * this.pagination.limit
      return records.slice(offset, offset + this.pagination.limit)
    },
    removeGroup (value) {
      const index = this.grouping.current.indexOf(value)
      this.grouping.current.splice(index, 1)
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
    },
    updatePagination (page) {
      this.pagination.current = page
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

.list {
  &--inline {
    list-style: none;
    padding: 0;
    margin: 0;

    .list-item {
      display: inline-block;
      margin-right: 15px;
    }
  }
}
</style>
