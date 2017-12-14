<template>
  <div class="lunar-table__container" :class="'theme-' + theme">
    <a href="#l-table-content" class="sr-only sr-only-focusable">Skip to Table's Content</a>
    <l-table-header
      :with-filter="withFilter"
      @input="updateFilter"
      @toggle="toggleSettings" />

    <l-table-column-select
      :columns="columns"
      :settings="settings" />

    <l-table-group v-if="withGrouping"
      :groupingRows="groupingRows"
      :dropzoneActive="grouping.dropzoneActive"
      @addGrouping="addGrouping"
      @removeGroup="removeGroup" />

    <figure class="lunar-table__wrapper" :style="{ height: height }">
      <table id="l-table-content"
             role="grid"
             tabindex="0"
             class="lunar-table" :class="{ 'overlay-active': grouping.dropzoneActive }"
             :aria-colcount="columns.length"
             :aria-rowcount="rows.length">

        <thead class="lunar-table__head">
          <tr class="lunar-table__row" role="row">
            <th class="lunar-table__checkbox-container" v-if="multiSelect">
              <label class="control control--checkbox">
                <input class="lunar-table__checkbox"
                       type="checkbox"
                       @change="toggleSelectAll"
                       :checked="rows.length === selected.records.length">
                <div class="control__indicator"></div>
              </label>
            </th>
            <th v-for="column in columns"
                v-if="column.active"
                :key="column.value"
                class="lunar-table__head-item"
                :class="{ 'head-item--active': sort.by === column.value }"
                role="columnheader"
                tabindex="0"
                :aria-sort="getAriaSort(column)"
                :draggable="withGrouping"
                @dragover="grouping.dropzoneActive = true"
                @dragleave="grouping.dropzoneActive = false"
                @dragstart="dragStart($event, column)"
                @click="sortTable(column)"
                @keyup.enter="sortTable(column)">
                <fa-icon v-if="sort.by === column.value"
                         scale="0.9"
                         :name="sort.order === 'asc' ? 'sort-asc' : 'sort-desc'"></fa-icon>
                {{ column.label }}
            </th>
            <th v-if="editable">&nbsp;</th>
          </tr>
        </thead>

        <tbody v-if="rows.length" class="lunar-table__body">
          <template v-for="row in rows">
            <l-table-header-cell
              v-if="row._grouped.length"
              :row="row"
              :key="row.id"
              :groups="groupingRows" />

            <tr class="lunar-table__row"
                role="row"
                :key="row.id"
                @click="selectRow(row)">

              <td class="lunar-table__checkbox-container center" v-if="multiSelect">
                <label class="control control--checkbox">
                  <input class="lunar-table__checkbox"
                         type="checkbox"
                         @click="checkRow(row)"
                         :value="row"
                         v-model="selected.records" />
                  <div class="control__indicator"></div>
                </label>
              </td>

              <template v-for="column in columns">
                <slot :name="column.value" :row="row">
                  <l-table-cell
                    :key="column.id"
                    :editable="editable"
                    :column="column"
                    :grouping="grouping.current"
                    :row="row"
                    :editID="edit.row"
                    @toggleEdit="editRow" />
                </slot>
              </template>

              <td v-if="editable && row.id !== edit.row">
                <a href="#" @click.prevent="editRow(row)">
                  <fa-icon name="edit" />
                </a>
              </td>
              <td v-else-if="editable">
                <a href="#" @click.prevent="saveEdit">
                  <fa-icon name="save" />
                </a>
                &nbsp;
                <a href="#" @click.prevent="cancelRowEdit">
                  &times;
                </a>
              </td>
            </tr>
          </template>
        </tbody>

      </table>
    </figure>

    <div class="lunar-table__page-size-container">
      <l-table-page-size :pageSizes="pagination.pageSizes" @change="updatePageSize" />
      <l-table-pagination :pagination="pagination" @pageSwitch="updatePagination" />
    </div>

    <l-table-detail-side-panel
      :withDSP="withDSP"
      :selected="selected" />
  </div>
</template>

<script>
// Libraries
import _ from 'lodash'

// Core
import LTableHeader from './components/Header/LunarTableHeader'
import LTableHeaderCell from './components/LunarTableHeaderCell.js'
import LTableCell from './components/LunarTableDataCell'

// Addons
import LTableColumnSelect from './components/Options/LunarTableColumnSelect'
import LTablePageSize from './components/Pagination/LunarTablePageSize'
import LTablePagination from './components/Pagination/LunarTablePagination'
import LTableGroup from './components/Grouper/LunarTableGrouper'
import LTableDetailSidePanel from './components/DetailSidePanel/LunarTableDetailSidePanel'

// Iconography
import 'vue-awesome/icons/sort-asc'
import 'vue-awesome/icons/sort-desc'
import 'vue-awesome/icons/cog'
import 'vue-awesome/icons/plus-square'
import 'vue-awesome/icons/edit'
import 'vue-awesome/icons/save'

export default {
  name: 'lunar-table',

  components: {
    LTableHeader,
    LTableColumnSelect,
    LTableHeaderCell,
    LTableCell,
    LTablePageSize,
    LTablePagination,
    LTableGroup,
    LTableDetailSidePanel
  },

  props: {
    columns: {
      type: Array,
      required: false
    },
    datasource: {
      type: [Object, Array],
      required: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    groupTextSeparator: {
      type: String,
      default: '-'
    },
    height: {
      type: String,
      default: '450px'
    },
    limit: {
      type: Number,
      default: 25
    },
    index: {
      type: Number,
      default: 0
    },
    noRecords: {
      type: String,
      default: 'No records found.'
    },
    noResults: {
      type: String,
      default: 'No results found.'
    },
    singleSelect: {
      type: Boolean,
      default: false
    },
    multiSelect: {
      type: Boolean,
      default: false
    },
    sortBy: {
      type: String,
      default: 'id'
    },
    theme: {
      type: String,
      default: 'default'
    },
    withDSP: {
      type: Boolean,
      default: false
    },
    withFilter: {
      type: Boolean,
      default: false
    },
    withGrouping: {
      type: Boolean,
      default: false
    },
    withPageSize: {
      type: Boolean,
      default: true
    },
    withPagination: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      edit: {
        row: null,
        form: {}
      },
      filter: '',
      grouping: {
        current: [],
        dragColumn: {},
        dropzoneActive: false
      },
      pagination: {
        limit: this.limit,
        pageSizes: [25, 50, 100, 'All'],
        current: 1,
        total: 10
      },
      response: {
        data: [],
        errors: []
      },
      settings: {
        open: false
      },
      selected: {
        records: [],
        record: {}
      },
      sort: {
        by: this.sortBy,
        order: 'asc'
      }
    }
  },

  computed: {
    groupingRows () {
      return this.grouping.current.map(columnVal => this.columns.find(column => column.value === columnVal))
    },
    rows () {
      let data = this.response.data.length ? this.response.data : this.datasource

      if (this.withGrouping) {
        data = data.map(rows => {
          return Object.assign(rows, {
            _grouped: []
          })
        })
      }

      data = data.filter(row => {
        return Object.keys(row).some(key => {
          return String(row[key]).toLowerCase().indexOf(this.filter.toLowerCase()) > -1
        })
      })

      if (this.sort.by) {
        data = _.orderBy(data, item => {
          let value = item[this.sort.by]
          if (!isNaN(Number(value))) {
            return Number(value)
          }
          return String(value).toLowerCase()
        }, this.sort.order)
      }

      if (this.withGrouping && this.grouping.current.length) {
        this.grouping.current.map(currentGrouping => {
          const groupedData = _.groupBy(data, item => item[currentGrouping])
          data = _.flattenDeep(Object.keys(groupedData).map(key => {
            const rows = groupedData[key]
            return rows.map((row, idx) => {
              if (!key.includes(this.groupTextSeparator)) {
                const title = `${currentGrouping} ${this.groupTextSeparator} ${key}`
                row._grouped.push(title)

                if (idx >= 1 && !_.isEmpty(rows[0])) {
                  row._grouped = []
                }

                return [row]
              }

              return [row]
            })
          }))
        })
      }

      return this.paginate(data)
    }
  },

  methods: {
    addGrouping (e) {
      if (!this.grouping.current.includes(this.grouping.dragColumn.value)) {
        this.grouping.current.push(this.grouping.dragColumn.value)
      }

      this.grouping.dropzoneActive = false
      this.$emit('add-grouping', this.grouping.current)
    },
    cancelRowEdit () {
      this.edit.form = {}
      this.edit.row = null
      this.$emit('edit-cancel')
    },
    checkRow (row) {
      const index = this.selected.records.indexOf(row)
      if (~index) {
        this.selected.records.splice(index, 1)
      } else {
        this.selected.records.push(row)
      }

      this.$emit('select-row', this.selected.records)
    },
    dragStart (e, column) {
      this.grouping.dragColumn = column
      e.dataTransfer.setData('text/plain', JSON.stringify(column))
    },
    editRow (row) {
      this.edit.row = row.id
      this.edit.form = row
      this.$emit('edit-row', row)
    },
    getAriaSort (column) {
      return this.sort.by === column.value ? this.sort.order : 'none'
    },
    getRecords () {
      this.response.data = this.datasource
    },
    paginate (records) {
      const offset = (this.pagination.current - 1) * this.pagination.limit
      return records.slice(offset, offset + this.pagination.limit)
    },
    removeGroup (value) {
      const index = this.grouping.current.indexOf(value)
      this.grouping.current.splice(index, 1)
      this.$emit('remove-grouping', this.grouping.current)
    },
    saveEdit () {
      this.$emit('saveEdit', this.edit.form)
      this.cancelRowEdit()
    },
    selectRow (row) {
      if (!this.multiSelect) {
        if (_.isEqual(this.selected.record, row)) {
          this.selected.record = {}
          this.$emit('select-row', this.selected.record)
          return
        }

        this.selected.record = {}
        this.selected.record = row
        this.$emit('select-row', this.selected.record)
      }
    },
    sortTable (column) {
      this.sort.by = column.value
      this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc'
      this.$emit('sorted', {
        column: column.value,
        order: this.sort.order
      })
    },
    toggleSelectAll () {
      if (this.selected.records.length) {
        this.selected.records = []
      } else {
        this.selected.records = _.map(this.rows)
      }

      this.$emit('select-all', this.selected.records)
    },
    toggleSettings () {
      this.settings.open = !this.settings.open
    },
    updateFilter (filter) {
      this.filter = filter
      this.$emit('update-filter', filter)
    },
    updatePageSize (limit) {
      this.pagination.limit = limit
      this.getRecords()
    },
    updatePagination (page) {
      this.pagination.current = page
      this.getRecords()
    }
  },

  created () {
    this.getRecords()
  }
}
</script>

<style lang="scss">
.theme-default {
  box-sizing: border-box;
  position: relative;
  background-color: #FCFCFC;
  border-radius: 4px;
  border: 1px solid rgba(221, 221, 221, 0.55);
  box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);
  overflow: hidden;

  .lunar-table {
    width: 100%;
    border-collapse: collapse;
    border-bottom: 2px solid #eff0f0;

    &__wrapper {
      position: relative;
      width: 100%;
      max-width: 100%;
      margin: 0;
      padding: 0;
      overflow-x: auto;
      overflow-y: auto;
    }

    &__side-panel {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      border-left: 1px solid rgba(44, 62, 80, 0.15);
      background-color: #F7F7F7;
      width: 400px;
      border-radius: 4px;
      box-shadow: -6px 0 15px 0 rgba(50, 44, 105, 0.11);
      z-index: 10;

      .side-panel {
        &__header {
          background-color: #FCFCFC;
          border-bottom: 1px solid #E7E7E7;
          padding: 1em;
          font-weight: bold;
        }

        &__body {
          padding: 1em;
        }
      }
    }

    &__checkbox-container {
      width: 50px;
    }

    &.overlay-active {
      filter: blur(3px);
    }

    &__head {
      background-color: #F9FAFC;
      border-top: 2px solid #EFF0F0;
      border-bottom: 2px solid #EFF0F0;

      &-item {
        color: lighten(#333, 35%);
        text-align: left;
        font-size: 0.95em;
        text-transform: uppercase;
        padding: 0.9em 0.5em 0.9em 1em;

        &.head-item--active {
          color: #333;
        }
      }
    }

    &__row {
      border-bottom: 1px solid #e7e7e7;
    }

    &__page-size-container {
      border-top: 1px solid #eff0f0;
    }

    &__header,
    &__page-size-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    &__header {
      height: 50px;
    }

    &__options {
      margin-right: 15px;

      .options-link {
        color: #2D2B49;
      }
    }

    .grouped-row-header {
      background: #F4F4F6;
    }

    &__cell,
    .grouped-row-header {
      padding: 0.5em 0.5em 0.5em 1em;
      line-height: 1.5
    }

  }

  .list {
    &--inline {
      list-style: none;
      padding: 0;
      margin: 0;

      .list-item {
        display: inline-block;
        margin-right: 15px;
      }
    }
  }

  .column__select {
    padding: 0.25em 0.5em 0.25em 1em;
  }

  @media all and (max-width: 37em) {
    .lunar-table {
      display: block;

      &__row,
      &__cell {
        display: block;
      }

      &__row {
        padding: 0.7em 2vw;
      }

      &__head {
        .lunar-table__row {
          display: none;
        }
      }
    }
  }
}

.center {
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
}

.l-close {
  float: right;
  color: #aaa;
  font-size: 1.3em;
  cursor: pointer;
  line-height: 1;
  transition: color 0.15s ease;

  &:hover {
    color: #8C5BDC;
  }
}

.l-btn {
  background: transparent;
  border: 2px solid #ccc;
  border-radius: 4px;
  color: #333;
  cursor: pointer;
  box-shadow: none;
  outline: none;
  padding: 6px 12px;
}

.control {
  display: block;
  min-width: 25px;
  position: relative;
  cursor: pointer;
  font-size: 1.1em;

  input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  &__indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 15px;
    height: 15px;
    border-radius: 2px;
    background: #fff;
    border: 1px solid #8C5BDC;
  }
}

.control:hover input ~ .control__indicator,
.control input:focus ~ .control__indicator {
	background: #8C5BDC;
}

.control input:checked ~ .control__indicator {
	background: #8C5BDC;
}

.control input:disabled ~ .control__indicator {
	pointer-events: none;
	opacity: .6;
	background: #e6e6e6;
}

.control__indicator:after {
	position: absolute;
	display: none;
	content: '';
}

/* Show check mark */
.control input:checked ~ .control__indicator:after {
	display: block;
}

/* Checkbox tick */
.control--checkbox .control__indicator:after {
  top: 1.5px;
  left: 4.55px;
  width: 2px;
  height: 6px;
  transform: rotate(42deg);
  border: solid lighten(#8C5BDC, 35%);
  border-width: 0px 2px 2px 0;
}

/* Disabled tick colour */
.control--checkbox input:disabled ~ .control__indicator:after {
	border-color: #7b7b7b;
}

.lunar-slide-from-right-enter-active {
  animation: slide-in 250ms ease-out;
}

.lunar-slide-from-right-leave-active {
  animation: slide-out 250ms ease-out;
}

@keyframes slide-in {
    from {
      transform: translateX(400px);
      opacity: 0
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
}

@keyframes slide-out {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
}

@media print {
  body {
    font-size: 6pt;
    color: #333;
    background-color: #fff;
    background-image: none;
    margin: 0;
    padding: 0;
  }
  table {
    page-break-inside: avoid;
  }
}
@media print and (max-width: 5in) {
  table {
    page-break-inside: auto;
  }
  tr {
    page-break-inside: avoid;
  }
}
</style>
