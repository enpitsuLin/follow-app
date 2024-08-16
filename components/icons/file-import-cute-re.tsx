import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgFileImportCuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Path fill="#10161F" d="M10.5 1.5a1 1 0 0 0 0 2zm8 10a1 1 0 1 0 2 0zm-4.975-4.687-.988.156zm1.662 1.662-.156.988zm-2.181-5.893-.165.987zm2.492 1.033.58-.814zm3.094 16.423.773.634zm-.554.554.634.773zm1.38-11.598-.987.165zm-1.033-2.492.814-.58zM4.857 4.848l.91.413zm1.991-1.991.413.91zM3 17a1 1 0 1 0 0 2zm6.328 2a1 1 0 1 0 0-2zm-1.844-4.703a1 1 0 0 0-.968 1.75zm-.968 5.657a1 1 0 0 0 .968 1.75zM9.756 18h1zm8.744-6.964V14h2v-2.964zM10.668 3.5h.297v-2h-.297zm1.832 2v.6h2v-.6zm3.4 4h.6v-2h-.6zm.6 0a2 2 0 0 1 2 2h2a4 4 0 0 0-4-4zm-4-3.4c0 .333-.003.617.037.87l1.975-.314c-.009-.058-.012-.146-.012-.556zm3.4 1.4c-.41 0-.498-.003-.556-.012l-.313 1.975c.252.04.536.037.869.037zm-3.363-.53a3 3 0 0 0 2.494 2.493l.313-1.975a1 1 0 0 1-.832-.832zM14.5 5.5a4 4 0 0 0-4-4v2a2 2 0 0 1 2 2zm-3.536-2c1.067 0 1.486.003 1.877.069l.33-1.973c-.593-.1-1.207-.096-2.206-.096zm6.743.793C17 3.586 16.57 3.15 16.08 2.8l-1.161 1.628c.323.23.621.524 1.375 1.278zm-4.866-.724a5 5 0 0 1 2.077.86l1.16-1.628a7 7 0 0 0-2.907-1.205zM18.5 14c0 1.668-.002 2.831-.107 3.72-.102.865-.29 1.338-.574 1.683l1.546 1.269c.625-.76.89-1.663 1.015-2.718.122-1.032.12-2.335.12-3.954zM12 22.5c1.62 0 2.922.002 3.954-.12 1.055-.125 1.957-.39 2.718-1.015l-1.269-1.546c-.345.284-.818.472-1.684.574-.887.105-2.05.107-3.719.107zm5.819-3.097a2.993 2.993 0 0 1-.416.416l1.269 1.546c.253-.208.485-.44.693-.693zm2.681-8.367c0-1 .003-1.614-.096-2.207l-1.973.33c.066.391.069.81.069 1.877zm-4.207-5.329c.754.754 1.048 1.053 1.278 1.375l1.628-1.16c-.349-.49-.785-.922-1.492-1.63zm4.11 3.122A7 7 0 0 0 19.2 5.921l-1.628 1.161a5 5 0 0 1 .86 2.077zM5.5 8.668c0-1.026 0-1.74.042-2.299.04-.548.116-.866.226-1.108l-1.822-.826c-.247.546-.35 1.127-.399 1.787C3.5 6.87 3.5 7.672 3.5 8.668zM10.668 1.5c-.996 0-1.797 0-2.446.047-.66.05-1.241.152-1.787.4l.826 1.82c.242-.109.56-.185 1.108-.225.558-.041 1.273-.042 2.299-.042zm-4.9 3.761A3 3 0 0 1 7.26 3.768l-.826-1.822a5 5 0 0 0-2.489 2.49zM5.5 12V8.668h-2V12zM3 19h6.328v-2H3zm5.704-1.066c-.553.86-1.239 1.495-2.188 2.02l.968 1.75c1.224-.677 2.16-1.536 2.902-2.687zm-2.188-1.887c.95.525 1.635 1.16 2.188 2.02l1.682-1.083c-.741-1.152-1.678-2.01-2.902-2.687zm3.87 2.97c.089-.138.37-.515.37-1.017h-2a.571.571 0 0 1 .047-.223c.002-.006-.001.002-.02.032l-.032.052-.047.073zm-1.682-.95.047.072.033.053.019.032a.45.45 0 0 1-.042-.153.572.572 0 0 1-.005-.07h2c0-.503-.281-.879-.37-1.017z" /></Svg>
}
const Memo = memo(SvgFileImportCuteRe)
export default Memo
