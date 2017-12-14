<template>
  <td v-if="editID === row.id && column.active && editable"
      class="lunar-table__cell--editable lunar-table__cell"
      :colspan="colSpan">
    <input type="text"
           class="lunar-table__input"
           v-model="row[column.value]">
  </td>
  <td v-else-if="column.active"
      class="lunar-table__cell"
      :colspan="colSpan"
      @dblclick="editRow(row)">
    {{ value(row, column.value) }}
  </td>
</template>

<script>
import { get } from 'lodash'

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
    editID: {
      type: Number,
      default: null
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
    editRow (row) {
      this.$emit('toggleEdit', row)
    },
    value (row, column) {
      return get(row, column)
    }
  },

  created () {
    this.edit = this.editable
  }
}
</script>

<style lang="scss" scoped>
.theme-default {
  .lunar-table__cell {
    height: 100%;

    &--editable {
      padding: 0;
      margin: 0;
      padding-left: 1em;

      .lunar-table__input {
        display: block;
        width: 100%;
        height: 100%;
        padding: 0.5em 0.25em;
        background-color: transparent;
        color: #2D2B49;
        border: 1px solid #8C5BDC;
        border-radius: 3px;

        &:focus {
          outline: 0;
          border-color: #8C5BDC;
          box-shadow: 0 0 0 0.2em rgba(148, 68, 218, 0.25);
        }
      }
    }
  }
}
</style>
