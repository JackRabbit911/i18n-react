import { useTranslate } from "i18n/hooks"
import Child11 from "./Child11"
import { useState } from "react"
import Cond1 from "./Cond1"
import Cond2 from "./Cond2"
import Cond3 from "./Cond3"

const Page1 = () => {
  const [num, setNum] = useState(1)
  const __ = useTranslate()

  const onCondition = (num: number) => () => {
    setNum(num)
  }

  return (
    <div className="p-1 border border-zinc-600">
      <h1>{__('Page%', 1)}</h1>
      <Child11 __={__} />
      <div>
        {__('Conditional rendering')} (useState)
        <div>
          <button
            className="btn btn-outline m-1"
            onClick={onCondition(1)}
            disabled={num === 1}
          >
            {__('Condition %', 1)}
          </button>
          <button
            className="btn btn-outline m-1"
            onClick={onCondition(2)}
            disabled={num === 2}
          >
            {__('Condition %', 2)}
          </button>
          <button
            className="btn btn-outline m-1"
            onClick={onCondition(3)}
            disabled={num === 3}
          >
            {__('Condition %', 3)}
          </button>
          <div className="p-1 border border-zinc-600">
            <Cond1 __={__} num={num} />
            <Cond2 __={__} num={num} />
            <Cond3 __={__} num={num} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page1
