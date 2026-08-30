import { createEvent, createStore } from "effector"

// a flag, not a component — content is picked in Modal,
// JSX in an effector store is fragile (stale closures, serialization)
export const modalOpened = createEvent()
export const modalClosed = createEvent()

export const $modalOpened = createStore(false)
    .on(modalOpened, () => true)
    .reset(modalClosed)
