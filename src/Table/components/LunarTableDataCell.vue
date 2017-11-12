<template>
  <td v-if="editable" class="lunar-table__editable-cell" :colspan="colSpan">
    <input type="text" class="lunar-table__input" v-model="row[column.value]">
  </td>
  <td v-else-if="column.active" :colspan="colSpan">
    {{ value(row, column.value) }}
  </td>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'lunar-table-cell',

  props: {
    column: {
      type: Object
    },
    editable: {
      type: Boolean,
      default: false
    },
    grouping: {
      type: Array
    },
    row: {
      type: Object
    },
    colSpan: {
      type: String
    }
  },

  methods: {
    value (row, column) {
      return _.get(row, column)
    }
  }
}
</script>
