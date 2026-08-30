type StrNum = string|number;
export type Argv = StrNum[];
export type GetText = (value: string, ...argv: Argv) => string;

export type TranslateType = {
  [key: string]: string;
}

type SetLang = (lang: string) => void;
export type SetLangHookType = [lang: string, setLang: SetLang];
