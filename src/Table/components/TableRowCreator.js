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
      const value = this.currentGrouping.value
      return groupBy(this.rows, row => row[value])
    },
    currentGrouping () {
      const value = this.grouping[this.index]
      return this.columns.find(column => column.value === value)
    }
  },

  methods: {
    createTableRow (h) {
      return (
        <tr>
          {this.rows.map(row => {
            return this.renderCell(h, row)
          })}
        </tr>
      )
    },
    renderCells (h) {
      return Object.keys(this.groups).map((key, i) => {
        const data = this.groups[key]

        return (
          <l-table-cell col-span="100%"  />
          <lunar-row-c
            editable={this.editable}
            rows={data}
            index={this.index + 1}
            grouping={this.grouping}
            columns={this.columns} />
        )
      })
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
    renderResultSet (h) {
      return this.rows.length < 1
        ? this.renderEmptyCell(h)
        : this.createTableRow(h)
    }
  },

  render (h) {
    return this.groupable
            ? this.renderCells(h)
            : this.renderResultSet(h)
  }
}
