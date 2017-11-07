import { groupBy } from 'lodash'
import LTableRow from './TableRow'
import LTableCell from './TableDataCell'

export default {
  name: 'lunar-row-c',

  components: {
    LTableRow,
    LTableCell
  },

  props: {
    columns: {
      type: Array,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    },
    grouping: {
      type: Array
    },
    index: {
      type: Number,
      default: 0
    },
    rows: {
      type: Array,
      required: true
    }
  },

  computed: {
    groupable () {
      return this.index < this.grouping.length
    },
    groups () {
      const value = this.groupingColumn.value
      return groupBy(this.rows, row => row[value])
    },
    groupingColumn () {
      const value = this.grouping[this.index]
      return this.columns.find(column => column.value === value)
    }
  },

  methods: {
    renderCells (h) {
      return (
        <tbody>
          {
            this.rows.length < 1
              ? this.renderEmptyCell(h)
              : this.mapRows(h)
          }
        </tbody>
      )
    },
    renderEmptyCell (h) {
      return (
        <tr>
          <td>{ this.noRecords }</td>
        </tr>
      )
    },
    renderCell (h, row) {
      return this.columns.map(column => {
        return <l-table-cell key={column.id} column={column} row={row} editable={this.editable} />
      })
    },
    mapRows (h) {
      return this.rows.map((row, index) => {
        return (
          <tr key={row.id}>
            {this.renderCell(h, row)}
          </tr>
        )
      })
    }
  },

  render (h) {
    return this.renderCells(h)
  }
}
