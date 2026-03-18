import { createEvent, createStore } from "effector";

export const subPageSetted = createEvent<number>()
export const subPageReset = createEvent()

export const $subPageNum = createStore(1)
    .on(subPageSetted, (_, store) => store)
    .reset(subPageReset)

