import type { GetTextProp } from "i18n/types"

const Child01 = ({ __ }: GetTextProp) => {
  return (
    <div className="ms-4">
      <h2>{__('Page%', '01')}</h2>
      <p>{__('first')} {__('child')} {__('from')} {__('Homepage')}</p>
    </div>
  )
}

export default Child01
