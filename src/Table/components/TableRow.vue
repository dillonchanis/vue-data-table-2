<template>
  <tr>
    <table-data-cell
      v-for="column in columns"
      :key="column.id"
      :column="column"
      :rows="rows"
      :editable="editable">
    </table-data-cell>
  </tr>
</template>

<script>
import TableDataCell from './TableDataCell'

export default {
  name: 'lunar-table-row',

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
    groupingRows: {
      type: Array
    },
    index: {
      type: Number,
      default: 0
    },
    noRecords: {
      type: String,
      default: 'No records found.'
    },
    rows: {
      type: Array,
      required: true
    }
  }
}
</script>
