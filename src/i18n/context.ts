import { createContext } from "react";

import type { TranslateContextType } from "./types";

export const TranslateContext = createContext<TranslateContextType | undefined>(undefined)
