<template>
  <div class="column__select" v-if="settings.open">
    <ul class="list list--inline">
      <li class="list-item" v-for="column in columns" :key="column.key">
        <label>
          <input type="checkbox" v-model="column.active" />
          {{ column.label }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      columns: {
        type: Array,
        required: true
      },
      settings: {
        type: Object,
        required: true
      }
    }
  }
</script>
