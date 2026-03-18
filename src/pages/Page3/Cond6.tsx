import type { GetText } from "i18n/types"

type Props = {
  __: GetText;
  num: number;
}

const Cond6 = ({ __, num }: Props) => {
  return (
    <>
      {num === 3 && <p>
        {__('Cond3GlobKey')}
      </p>}
    </>
  )
}

export default Cond6
