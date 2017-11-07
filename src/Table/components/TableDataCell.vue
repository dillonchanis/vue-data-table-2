<template>
  <td v-if="editable" class="lunar-table__editable-cell">
    <input type="text" class="lunar-table__input" v-model="row[column.id]">
  </td>
  <td v-else>
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
