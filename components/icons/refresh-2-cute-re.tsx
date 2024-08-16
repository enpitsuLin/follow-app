import { memo } from 'react'
import type { SvgProps } from 'react-native-svg'
import Svg, { Path } from 'react-native-svg'

function SvgRefresh2CuteRe(props: SvgProps) {
  return <Svg width={24} height={24} fill="none" {...props}><Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" /><Path fill="#10161F" d="m14.33 3.307-.26.966zM2.9 7.85a1 1 0 1 0 1.821.828zm16.886 3.537a1 1 0 1 0 .428-1.954zM9.67 20.693l.26-.966zm11.43-4.542a1 1 0 0 0-1.821-.828zM4.213 12.613a1 1 0 1 0-.428 1.954zm1.616 1.18.558-.828zm-.078.181-.214.977zm12.418-3.767.56-.83zm.078-.181.214-.977zm1.987 1.572-.56.829zm.731-.408-.996.09zm-.172-.422-2.065-1.39-1.117 1.658 2.064 1.39zM4.72 8.678a8.002 8.002 0 0 1 9.35-4.405l.517-1.932c-4.79-1.284-9.7 1.138-11.687 5.509zm13.312 2.325 1.753.384.428-1.954-1.752-.384zm-14.826 2.23 2.064 1.39 1.117-1.658-2.064-1.391zm16.072 2.09a8.002 8.002 0 0 1-9.35 4.404l-.517 1.932c4.79 1.284 9.7-1.138 11.687-5.508zM5.967 12.998l-1.753-.385-.428 1.954 1.752.384zm8.104-8.725a8.004 8.004 0 0 1 5.9 7.007l1.991-.18c-.367-4.056-3.208-7.643-7.374-8.759zM9.929 19.728a8.004 8.004 0 0 1-5.9-7.008l-1.991.18c.367 4.056 3.208 7.643 7.374 8.76zm-4.658-5.105c-.823-.555-.274-1.838.696-1.625l-.429 1.953c1.185.26 1.857-1.309.85-1.987zm13.458-5.246c.823.555.274 1.838-.696 1.626l.429-1.954c-1.185-.26-1.857 1.309-.85 1.987zM4.324 11.574c-.943-.636-2.407-.009-2.286 1.326l1.992-.18a.56.56 0 0 1-.287.532.52.52 0 0 1-.536-.02zm15.352.853c.943.635 2.407.008 2.286-1.327l-1.992.18a.56.56 0 0 1 .287-.531.52.52 0 0 1 .537.02z" /></Svg>
}
const Memo = memo(SvgRefresh2CuteRe)
export default Memo
