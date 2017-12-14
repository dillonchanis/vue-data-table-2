<template>
  <tr class="lunar-table__row" role="row" @click="open = !open">
    <slot></slot>
  </tr>
</template>

<script>
export default {
  name: 'lunar-table-row',

  data () {
    return {
      open: false
    }
  }
}
</script>
