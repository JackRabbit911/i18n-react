import { useTranslate } from "i18n/hooks"

const Page3 = () => {
  const __ = useTranslate()

  return (
    <div className="p-1 border border-zinc-600">
      <h1>
        {__('Page%', 3)}
      </h1>
    </div>
  )
}

export default Page3
