<template>
  <header class="lunar-table__header">
    <l-table-filter v-if="withFilter" :query="filter" @input="updateFilter" />

    <div class="lunar-table__options">
      <a class="options-link" href="#" @click.prevent="toggle">
        <fa-icon @click="toggle" name="cog"></fa-icon>
      </a>
    </div>
  </header>
</template>

<script>
  import LTableFilter from '../Filter/LunarTableFilter'

  export default {
    name: 'lunar-table-header',
    components: {
      LTableFilter
    },
    props: {
      filter: {
        type: String,
        default: ''
      },
      withFilter: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        open: false
      }
    },
    methods: {
      toggle () {
        this.open = !this.open
        this.$emit('toggle')
      },
      updateFilter (filter) {
        this.$emit('input', filter)
      }
    }
  }
</script>
