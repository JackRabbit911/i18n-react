import { useUnit } from "effector-react"
import { $modalComponent, modalClosed } from "./store"

const Modal = () => {
  const component = useUnit($modalComponent)
  const isOpen = Boolean(component);

  return (
    <dialog id="my_modal" className="modal" open={isOpen}>
      <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {modalClosed()}}
          >
            ✕
          </button>
        {component}
      </div>
    </dialog>
  )
}

export default Modal
