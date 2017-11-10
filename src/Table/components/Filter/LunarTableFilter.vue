<template>
  <div class="lunar-table__filter">
    <label class="sr-only" for="filter">Filter</label>
    <div class="control">
      <input tabindex="0"
             aria-label="Search"
             placeholder="Filter..."
             id="filter"
             name="filter"
             class="lunar-table__input"
             type="text"
             :query="query"
             @input="updateQuery" />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      query: {
        type: String,
        required: true,
        default: ''
      }
    },
    methods: {
      updateQuery (e) {
        this.$emit('input', e.target.value)
      }
    }
  }
</script>
