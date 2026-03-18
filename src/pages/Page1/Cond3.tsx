import type { GetText } from "i18n/types"

type Props = {
  __: GetText;
  num: number;
}

const Cond3 = ({ __, num }: Props) => {
  return (
    <>
      {num === 3 && <p>
        {__('Cond3Key')}
      </p>}
    </>
  )
}

export default Cond3
