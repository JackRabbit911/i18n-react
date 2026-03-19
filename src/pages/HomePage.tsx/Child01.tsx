import type { Type__ } from "i18n/config"

const Child01 = ({ __ }: Type__) => {
  return (
    <div className="ms-4 p-1 border border-zinc-600">
      <h2>{__('Page%', '01')}</h2>
      <p>{__('first')} {__('child')} {__('from')} {__('Homepage')}</p>
    </div>
  )
}

export default Child01
