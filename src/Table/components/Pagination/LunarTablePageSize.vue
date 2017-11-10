<template>
  <div class="lunar-table__page-size">
    <div class="control">
      <label for="page-size" class="lunar-table__label">Rows Per Page:</label>
      <select name="page-size" id="page-size" class="lunar-table__select" v-model="selected" @change="update">
        <option v-for="size in pageSizes" :value="size === 'All' ? '' : size" :key="size">
          {{ size }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageSizes: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selected: this.pageSizes[0]
    }
  },
  methods: {
    update () {
      this.$emit('change', this.selected)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
