import type { GetText } from "i18n/types"

type Props = {
  __: GetText;
  num: number;
}

const Cond2 = ({ __, num }: Props) => {
  return (
    <>
      {num === 2 && <p>
        {__('Cond2Key')}
      </p>}
    </>
  )
}

export default Cond2
