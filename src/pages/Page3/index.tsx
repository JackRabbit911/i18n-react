import { useUnit } from "effector-react"
import Cond4 from "./Cond4"
import Cond5 from "./Cond5"
import Cond6 from "./Cond6"
import { useTranslate } from "i18n/hooks"
import { $subPageNum, subPageSetted } from "./store"

const Page3 = () => {
  const globalNum = useUnit($subPageNum)
  const __ = useTranslate()

  return (
    <div className="p-1 border border-zinc-600">
      <h1>
        {__('Page%', 3)}
      </h1>
      <div>
        {__('Conditional rendering')} (useUnit)
        <div>
          <button
            className="btn btn-outline m-1"
            onClick={() => subPageSetted(1)}
            disabled={globalNum === 1}
          >
            {__('Condition %', 1)}
          </button>
          <button
            className="btn btn-outline m-1"
            onClick={() => subPageSetted(2)}
            disabled={globalNum === 2}
          >
            {__('Condition %', 2)}
          </button>
          <button
            className="btn btn-outline m-1"
            onClick={() => subPageSetted(3)}
            disabled={globalNum === 3}
          >
            {__('Condition %', 3)}
          </button>
          <div className="p-1 border border-zinc-600">
            <Cond4 __={__} num={globalNum} />
            <Cond5 __={__} num={globalNum} />
            <Cond6 __={__} num={globalNum} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page3
