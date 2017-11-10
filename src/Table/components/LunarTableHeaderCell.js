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
    return (
      <td class={context.props.row.class} colspan={context.props.row.colSpan}>
        {context.props.row.headerText }
      </td>
    )
  }
}
