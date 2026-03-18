import type { GetText } from "i18n/types"

type Props = {
  __: GetText;
  num: number;
}

const Cond5 = ({ __, num }: Props) => {
  return (
    <>
      {num === 2 && <p>
        {__('Cond2GlobKey')}
      </p>}
    </>
  )
}

export default Cond5
