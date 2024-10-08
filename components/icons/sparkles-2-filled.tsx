import type { Ref } from 'react'
import { forwardRef, memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'
import { useStyles } from 'react-native-unistyles'

function SvgSparkles2Filled(props: SvgProps, ref: Ref<Svg>) {
  const {
    theme,
  } = useStyles()
  return <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" color={theme.colors.gray12} ref={ref} {...props}><Path fill="currentColor" d="M11 3a1 1 0 1 0-2 0 1 1 0 1 0 0 2 1 1 0 1 0 2 0 1 1 0 1 0 0-2" /><Path fill="currentColor" fillRule="evenodd" d="M6.747 5.825c.149.183.238.39.34.601a3.7 3.7 0 0 0 1.399 1.552c.899.551.89 1.498 0 2.044a3.7 3.7 0 0 0-1.4 1.552c-.135.28-.245.583-.52.76-.315.202-.817.202-1.132 0-.265-.17-.39-.488-.52-.76a3.701 3.701 0 0 0-1.4-1.552c-.178-.11-.348-.213-.495-.367a1.081 1.081 0 0 1 .001-1.312c.15-.156.31-.252.495-.365a3.7 3.7 0 0 0 1.399-1.552c.104-.216.187-.414.34-.6a1.071 1.071 0 0 1 1.493 0M14 6.24c.335 0 .588.141.777.342.305.324.434.801.624 1.196a11.71 11.71 0 0 0 4.429 4.91c.533.327 1.169.58 1.17 1.31.001.732-.636.986-1.17 1.313a11.711 11.711 0 0 0-4.429 4.91c-.19.396-.32.873-.624 1.197-.188.201-.442.342-.777.342s-.589-.141-.777-.342c-.308-.328-.433-.8-.624-1.196a11.71 11.71 0 0 0-4.429-4.91c-.519-.319-1.172-.605-1.17-1.314.002-.73.637-.982 1.17-1.309a11.71 11.71 0 0 0 4.429-4.91c.19-.396.32-.873.624-1.197.188-.2.442-.342.777-.342" clipRule="evenodd" /></Svg>
}
const ForwardRef = forwardRef(SvgSparkles2Filled)
const Memo = memo(ForwardRef)
export default Memo
