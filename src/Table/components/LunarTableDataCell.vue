<template>
  <td v-if="editable" class="lunar-table__editable-cell" :colspan="colSpan">
    <input type="text" class="lunar-table__input" v-model="row[column.value]">
  </td>
  <td v-else :colspan="colSpan">
    {{ row[column.value] }}
  </td>
</template>

<script>
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
    row: {
      type: Object
    },
    colSpan: {
      type: String
    }
  }
}
</script>
