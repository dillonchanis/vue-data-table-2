<template>
  <div class="lunar-table__drop-zone"
       :class="{ 'drop-zone-active': isActive }"
       @dragover.prevent
       @dragover="isActive = true"
       @dragleave="isActive = false"
       @drop="drop">

    <div class="lunar-table__group-indicator" v-for="group in groupingRows" :key="group.id">
      <button @click="remove(group.value)">&times; {{ group.label }}</button>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    groupingRows: {
      type: Array
    },
    dropzoneActive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    drop () {
      this.$emit('dropGroup')
    },
    remove (group) {
      this.$emit('removeGroup', group)
    }
  }
}
</script>

<style lang="scss" scoped>
.lunar-table {

  &__drop-zone {
    margin: 15px auto;
    border: 1px solid #333;
  }
}
  .drop-zone-active {
    border: 1px dotted #333;
    background-color: wheat;
  }
</style>
