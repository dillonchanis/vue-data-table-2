<template>
  <td v-if="edit" class="lunar-table__editable-cell lunar-table__cell" :colspan="colSpan" @keyup.enter="edit = false">
    <input type="text" class="lunar-table__input" v-model="row[column.value]">
  </td>
  <td class="lunar-table__cell" v-else-if="column.active" :colspan="colSpan" @dblclick="edit = !edit">
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

  data () {
    return {
      edit: false
    }
  },

  methods: {
    value (row, column) {
      return _.get(row, column)
    }
  },

  created () {
    this.edit = this.editable
  }
}
</script>

<style lang="scss" scoped>
.lunar-table__cell {
  height: 100%;

  &.lunar-table__editable-cell {
    padding: 0;
    padding-left: 1em;
    margin: 0;

    .lunar-table__input {
      width: 100%;
      height: 100%;
      color: #2c3e50;
      border: 0;
    }
  }
}
</style>
