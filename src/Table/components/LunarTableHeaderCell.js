export default {
  name: 'lunar-header-cell',
  functional: true,
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  render (h, context) {
    return context.props.row.grouped.map(header => {
      return (
        <tr>
          <td class="grouped-row-header" colspan="100%">
            { header }
          </td>
        </tr>
      )
    })
  }
}
