<template>
  <tbody v-if="groupable">
    <tr v-for="(rows, group, index) in groups" :key="group.id">
      <lunar-table-data
        :rows="data"
        :columns="columns"
        :editable="editable"
        :index="index + 1"
        :no-records="noRecords"
        :grouping-columns="groupingColumns">
      </lunar-table-data>
    </tr>
  </tbody>
  <tbody v-else>
    <tr v-if="rows.length < 1">
      <td>{{ noRecords }}</td>
    </tr>
    <tr v-for="(row, index) in rows" :key="row.id">
      <table-data-cell
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :row="row"
        :editable="editable">
      </table-data-cell>
    </tr>
  </tbody>
</template>

<script>
import TableDataCell from './TableDataCell'
import { _groupBy } from 'lodash'

export default {
  name: 'lunar-table-data',

  components: {
    TableDataCell
  },

  props: {
    columns: {
      type: Array,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    },
    grouping: {
      type: Array
    },
    groupingColumns: {
      type: Array
    },
    index: {
      type: Number,
      default: 0
    },
    rows: {
      type: Array,
      required: true
    }
  },

  computed: {
    slotted () {
      return this.$scopedSlots
    },
    groupable () {
      return this.index < this.grouping.length
    },
    groups () {
      const id = this.groupingColumn.id
      return _groupBy(this.rows, row => row[id])
    },
    groupingColumn () {
      const id = this.grouping[this.groupingIndex]
      return this.columns.find(column => column.id === id)
    }
  }
}
</script>
