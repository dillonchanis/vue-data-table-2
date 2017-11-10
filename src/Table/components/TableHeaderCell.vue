<template>
  <td :colspan="row.colSpan">
    {{ row.headerText }}
  </td>
</template>

<script>
export default {
  name: 'lunar-header-cell',
  props: {
    row: {
      type: Object,
      required: true
    }
  }
}
</script>

