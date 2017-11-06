<template>
  <tbody>
    <tr v-for="row in rows" :key="row.id">

    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'lunar-table-data',

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
    groups () {
      // const id = this.groupingColumn.id
      let groups = {}
      console.log(this.rows)
      for (let row of this.rows) {
        console.log(row)
      }

      return groups
    },
    groupingColumn () {
      const id = this.grouping[this.index]
      return this.columns.find(column => column.id === id)
    }
  }
}
</script>
