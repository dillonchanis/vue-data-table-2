<template>
  <button v-if="editable && !editing" @click="editing = !editing">
    Edit Row
  </button>
  <div v-else>
    <button @click="alert('updated'), editing = !editing">Save</button>
    <button @click="editing = !editing">Cancel</button>
  </div>
</template>

<script>
export default {
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    }
  }
}
</script>
