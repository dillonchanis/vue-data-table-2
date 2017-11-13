<template>
  <div class="lunar-table__grouping">
    <div class="lunar-table__group-indicator" v-for="group in groupingRows" :key="group.id">
      <button class="l-btn" @click="remove(group.value)">&times; {{ group.label }}</button>
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
    remove (group) {
      this.$emit('removeGroup', group)
    }
  }
}
</script>

<style lang="scss" scoped>
.lunar-table {
  &__grouping {
    background-color: #e8e8e8;
    box-shadow: inset 0 0 8px 0px rgba(112, 97, 97, 0.15)
  }

  &__group-indicator {
    display: inline-block;
    margin-right: 10px;
    padding: 10px 0;
    padding-left: 1em;

    .l-btn {
      height: 32px;
      background: #FCFCFC;
      border-radius: 0;
      border: none;
      border-left: 3px solid #007bff;
      box-shadow: 0 2px 6px 0 rgba(62,57,107,0.2);
    }
  }
}
</style>
