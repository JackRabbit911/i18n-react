# samples — примеры использования i18n-зеркал

## mirrors-outside-react.ts

Использование i18n **вне React** — 4 сценария:

1. **Прямой импорт сервиса** (BR-1) — `i18n.t()` как обычный вызов функции в
   effector-эффекте, без стейт-менеджера.
2. **Effector-зеркало** — `combine`/`sample` над `$lang`/`$dict`: производные
   сторы и реакции пересчитываются сами при смене языка/приходе переводов.
3. **Redux-зеркало** — слушатели стора и селекторы (`selectLang`/`selectDict`).
4. **Единый источник истины** — одно изменение сервиса обновляет effector-мост,
   redux-стор и прямые вызовы одновременно.

### Запуск

```bash
npm run samples:mirrors
```

### Ожидаемый вывод

```
  [logFx] friend
  [notifyFx] Hello Andrei
  [$statusLine] [en] How are You?
--- setLang("ru") на сервисе:
  [$statusLine] [ru] How are You?
  [sample] язык сменился на ru
  [redux] lang=ru, ключей в dict=0
--- t("How are You?") → конвейер ядра (debounce → fetch → merge → notify):
  [redux] lang=ru, ключей в dict=3
--- после мержа:
  i18n.getLang()=ru, t=⟨How are You?⟩
  $statusLine=[ru] How are You?
  redux: lang=ru, dict[How are You?]=⟨How are You?⟩
--- (слушатель redux отписан, demo завершена)
```

### Примечания

- **Сервис для node-прогона.** Образец собирает свой `I18nService` фабрикой с
  фейковым транспортом — в браузерном бандле то же самое делается над
  синглтоном: `import { i18n } from 'i18n/singleton'`.
- **Шум в конце вывода.** Импорт дефолтных зеркал (`effector.ts`/`redux.ts`)
  строит их над синглтоном, чьи `preloadKeys` в node пытаются уйти в
  `localhost:8080` (ECONNREFUSED) — ядро честно логирует ошибку в консоль и
  живёт (remont.md §2.7). В браузере этого шума нет.
- **browser-only синглтон снят**: `detectLangByUri` теперь возвращает
  `DEFAULT_LANG` без `window` (remont.md §7.7c закрыт).
