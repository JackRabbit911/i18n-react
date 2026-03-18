import type { GetText } from "i18n/types"

type Props = {
  __: GetText;
  num: number;
}

const Cond1 = ({ __, num }: Props) => {
  return (
    <>
      {num === 1 && <p>
        {__('Cond1Key')}
      </p>}
    </>
  )
}

export default Cond1
