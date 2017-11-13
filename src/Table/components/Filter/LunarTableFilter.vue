<template>
  <div class="lunar-table__filter">
    <label class="sr-only" for="filter">Filter</label>
    <input tabindex="0"
            aria-label="Search"
            placeholder="Search"
            id="filter"
            name="filter"
            class="lunar-table__input"
            type="text"
            :query="query"
            @input="updateQuery" />
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

<style lang="scss" scoped>
.lunar-table {
  &__filter {
    width: 100%;
    height: 100%;
  }

  &__input {
    width: 90%;
    max-width: 100%;
    height: 100%;
    background-color: transparent;
    padding: 0 12px;
    border: 0;
    outline: none;
    font-size: 1em;
    box-shadow: none;
  }
}
</style>
