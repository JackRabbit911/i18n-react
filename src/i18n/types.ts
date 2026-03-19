type StrNum = string|number;
export type Argv = StrNum[];
export type GetText = (value: string, ...argv: Argv) => string;

export type TranslateType = {
  [key: string]: string;
}

export type TranslateContextType = {
  gettext: GetText;
  setTranslate: React.Dispatch<React.SetStateAction<TranslateType>>;
  lang: string;
  setLang: React.Dispatch<React.SetStateAction<string>>;
}

export type GetTextProp = {
  __: GetText;
}

type SetLang = (lang: string) => void;
export type SetLangHookType = [lang: string, setLang: SetLang];

export type FetchTranslateType = (lang: string, keys: string[]) => Promise<TranslateType>
