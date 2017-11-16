<template>
  <div class="lunar-table__page-size">
    <div class="control">
      <label for="page-size" class="lunar-table__label">Rows Per Page:</label>
      <div class="select">
        <select name="page-size" id="page-size" class="lunar-table__select" v-model="selected" @change="update">
          <option v-for="size in pageSizes" :value="size === 'All' ? '' : size" :key="size">
            {{ size }}
          </option>
        </select>
      </div>
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
.lunar-table__label {
  font-size: 0.75em;
}
.lunar-table__page-size {
  padding: 0 18px;
  display: inline-flex;

  .lunar-table__select {
    appearance: none;
    align-items: center;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    color: #2c3e50;
    box-shadow: none;
    justify-content: flex-start;
    padding-right: 2.5em;
    line-height: 1.5;
    padding-top: 0.05em;
    padding-bottom: 0.05em;
    padding-left: calc(0.625em - 1px);
    position: relative;
    background-color: #fff;
    display: block;
    font-size: 0.9em;
    max-width: 100%;
    outline: none;
  }
}

.select {
  display: inline-block;
  max-width: 100%;
  position: relative;
  vertical-align: sub;
}

.select::after {
  border: 1px solid #2c3e50;
  border-right: 0;
  border-top: 0;
  content: " ";
  display: block;
  height: 0.4em;
  pointer-events: none;
  position: absolute;
  transform: rotate(-45deg);
  transform-origin: center;
  width: 0.4em;
  margin-top: -0.375em;
  right: 1.125em;
  top: 50%;
  z-index: 4;
}
</style>
