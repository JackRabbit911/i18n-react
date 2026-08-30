import { useEffect } from "react"
import { useUnit } from "effector-react"
import { $modalOpened, modalClosed } from "./store"
import ModalContents from "pages/ModalContents"

const Modal = () => {
  const isOpen = useUnit($modalOpened)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modalClosed()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <dialog className="modal" open>
      <div className="modal-backdrop" onClick={() => {modalClosed()}} />
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {modalClosed()}}
        >
          ✕
        </button>
        <ModalContents />
      </div>
    </dialog>
  )
}

export default Modal
