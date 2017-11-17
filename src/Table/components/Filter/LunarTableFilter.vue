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
    color: inherit;
    max-width: 100%;
    height: 100%;
    background-color: transparent;
    padding: 0 12px;
    font-size: 1em;
    outline: 0;
    border: none;
    border-radius: 3px;
    transition: border 0.3 ease;

    &:focus {
      border: 1px solid #8C5BDC;
    }
  }
}
</style>
