<template>
  <l-table-row
    :rows="rows"
    :columns="columns"
    :no-records="noRecords"
    :editable="editable"
    :groupingRows="groupingRows"
    :grouping="grouping"
  ></l-table-row>
</template>

<script>
import LTableRow from './TableRow'

export default {
  components: {
    LTableRow
  },
  props: ['rows', 'columns', 'noRecords', 'editable', 'index', 'groupingRows', 'grouping']
}
</script>
