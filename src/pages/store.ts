import { createEvent, createStore } from "effector";

export const pageSetted = createEvent<number>()
export const subPageSetted = createEvent<number>()
export const subPageReset = createEvent()

export const $subPageNum = createStore(1)
    .on(subPageSetted, (_, store) => store)
    .reset(subPageReset)

export const $page = createStore<number>(0)
    .on(pageSetted, (_, store) => store)
