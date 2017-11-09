import { groupBy } from 'lodash'
import LTableCell from './TableDataCell'

// const needsTR = (row) => row.length && (row.find(r => r.tag === 'td'))

const createTableRow = (h, context) => {
  return (
    <tr>
      {context.props.rows.map(row => {
        return renderCell(h, context, row)
      })}
    </tr>
  )
}

const renderCell = (h, context, row) => {
  return context.props.columns.map(column => {
    return <l-table-cell key={column.id} column={column} row={row} editable={context.props.editable} />
  })
}

const renderEmptyCell = (h, context) => {
  return (
      <td>{ context.props.noRecords }</td>
  )
}

// const renderHeaderRow = (h, context, key) => {
//   return <tr><td>{ context.props.grouping[context.props.index] } : { key }</td></tr>
// }

const renderResultSet = (h, context) => {
  return context.props.rows.length < 1
    ? renderEmptyCell(h, context)
    : createTableRow(h, context)
}

const currentGrouping = (context) => {
  const value = context.props.grouping[context.props.index]
  return context.props.columns.find(column => column.value === value)
}

const getGroups = (context) => {
  const value = currentGrouping(context).value
  return groupBy(context.props.rows, row => row[value])
}

export default {
  name: 'LunarRecursive',

  functional: true,

  components: { LTableCell },

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

  render (h, context) {
    if (context.props.index < context.props.grouping.length) {
      const groups = getGroups(context)

      return Object.keys(groups).map((key, i) => {
        const data = groups[key]

        return (<lunar-recursive
              editable={context.props.editable}
              rows={data}
              index={context.props.index + 1}
              grouping={context.props.grouping}
              columns={context.props.columns} />)
      })
    } else {
      return renderResultSet(h, context)
    }
  }
}
// {renderHeaderRow(h, context, key)}
