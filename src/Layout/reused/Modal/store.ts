import { createEvent, createStore } from "effector"

export const modalOpened = createEvent<React.ReactNode| string>()
export const modalClosed = createEvent()

export const $modalComponent = createStore<React.ReactNode | string | null>(null)
    .on(modalOpened, (_, data) => data)
    .reset(modalClosed)
