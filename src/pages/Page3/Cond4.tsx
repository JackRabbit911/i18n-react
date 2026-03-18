import type { GetText } from "i18n/types"

type Props = {
  __: GetText;
  num: number;
}

const Cond4 = ({ __, num }: Props) => {
  return (
    <>
      {num === 1 && <p>
        {__('Cond1GlobKey')}
      </p>}
    </>
  )
}

export default Cond4
