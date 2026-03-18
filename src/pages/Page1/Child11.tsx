import type { GetTextProp } from "i18n/types"

const Child11 = ({ __ }: GetTextProp) => {
  return (
    <div className="p-1 ms-4 border border-zinc-600">
      <h2>{__('Page%', '11')}</h2>
      <p>{__('first')} {__('child')} {__('from')} {__('Page%', 1)}</p>
    </div>
  )
}

export default Child11
