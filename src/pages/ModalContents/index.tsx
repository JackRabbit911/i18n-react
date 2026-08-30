import { useTranslate } from "i18n/hooks"

const ModalContents = () => {
  const __ = useTranslate()

  return (
    <div>
      {__('modalContent')}
      <p className="text-sm text-accent">
        {__('use')} defaultTranslateKeys
      </p>
    </div>
  )
}

export default ModalContents
