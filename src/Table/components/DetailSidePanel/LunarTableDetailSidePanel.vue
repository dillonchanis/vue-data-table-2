<template>
  <transition name="lunar-slide-from-right" mode="out-in">
    <div class="lunar-table__side-panel" v-if="withDSP && hasRecordSelected">
      <header class="side-panel__header">
        Selected Item <span @click="selected.record = {}" class="l-close">&times;</span>
      </header>
      <div class="side-panel__body">
        <div v-for="(value, key) in selected.record" :key="key">
          <template v-if="key !== '_grouped'">
            <strong>{{ key }}</strong>: {{ value }}
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { isEmpty } from 'lodash'

  export default {
    name: 'lunar-table-dsp',
    props: {
      selected: {
        type: [Array, Object]
      },
      withDSP: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      hasRecordSelected () {
        return !isEmpty(this.selected.record)
      }
    }
  }
</script>
