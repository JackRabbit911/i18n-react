// src/i18n/service.ts
import type { Argv, TranslateType } from "./types"
import { sprintf } from "./utils"

// транспорт — единственная внешняя зависимость ядра; инъекция делает
// сервис тестируемым в чистом node без DOM и без сети
export type Transport = (lang: string, keys: string[]) => Promise<TranslateType>

export type I18nServiceOptions = {
  transport?: Transport
  lang?: string
  delay?: number
  limit?: number | null
  preloadKeys?: readonly string[]
}

const EMPTY_DICT: ReadonlyMap<string, string> = new Map()

// фреймворк-агностичное ядро i18n: demand-driven сбор ключей, debounce-батчинг,
// per-lang словари с copy-on-write мержем, подписки для адаптеров (React/effector).
// Все методы — стрелочные поля: стабильные ссылки и привязка без .bind()
export class I18nService {
  private readonly transport: Transport
  private readonly delay: number
  private readonly limit: number | null

  private lang: string
  private dicts = new Map<string, ReadonlyMap<string, string>>()
  private pending = new Set<string>()
  private inFlight = new Map<string, Set<string>>() // lang -> ключи в запросе
  private listeners = new Set<() => void>()
  private version = 0
  private timer: ReturnType<typeof setTimeout> | null = null

  constructor(options: I18nServiceOptions = {}) {
    this.transport = options.transport ?? (async () => ({}))
    this.delay = options.delay ?? 0
    this.limit = options.limit ?? null
    this.lang = options.lang ?? ''
  }

  readonly t = (key: string, ...argv: Argv): string => {
    const value = this.dicts.get(this.lang)?.get(key)

    if (value !== undefined) {
      return sprintf(value, ...argv)
    }

    this.enqueue([key])
    // прогрессивный фолбэк: пока перевод едет, показываем ключ
    return sprintf(key, ...argv)
  }

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  readonly getLang = (): string => this.lang

  readonly getVersion = (): number => this.version

  readonly getDict = (lang: string = this.lang): ReadonlyMap<string, string> =>
    this.dicts.get(lang) ?? EMPTY_DICT

  // интроспекция для тестов/отладки
  readonly getPending = (): string[] => [...this.pending]

  private enqueue(keys: Iterable<string>): void {
    const flight = this.inFlight.get(this.lang) ?? new Set<string>()
    this.inFlight.set(this.lang, flight)

    let added = false
    for (const key of keys) {
      if (flight.has(key) || this.pending.has(key)) continue
      this.pending.add(key)
      added = true
    }

    if (added) {
      this.schedule()
    }
  }

  private schedule(): void {
    if (this.timer !== null) return
    this.timer = setTimeout(() => {
      this.timer = null
      this.flush()
    }, this.delay)
  }

  private flush(): void {
    if (this.pending.size === 0) return

    const keys = [...this.pending]
    this.pending.clear()
    const lang = this.lang
    const flight = this.inFlight.get(lang) ?? new Set<string>()
    this.inFlight.set(lang, flight)
    keys.forEach(key => flight.add(key))

    this.transport(lang, keys)
      .then(result => this.merge(lang, keys, result))
      .catch(error => {
        console.error('i18n: fetch failed', error)
        // ключи снова доступны для постановки в очередь
        keys.forEach(key => flight.delete(key))
      })
  }

  private merge(lang: string, requested: string[], result: TranslateType): void {
    const flight = this.inFlight.get(lang)

    if (flight) {
      requested.forEach(key => flight.delete(key))
      if (flight.size === 0) {
        this.inFlight.delete(lang)
      }
    }

    // copy-on-write: новый Map на каждый мерж — адаптеры сравнивают ссылки
    const next = new Map(this.dicts.get(lang) ?? EMPTY_DICT)

    if (this.limit !== null) {
      // размер ответа, а не число запрошенных: ответ может быть надмножеством
      const overflow = next.size + Object.keys(result).length - this.limit
      if (overflow > 0) {
        [...next.keys()].slice(0, overflow).forEach(key => next.delete(key))
      }
    }

    // ответ мержится целиком — как в legacy updateTranslate ({...translate, ...result}):
    // ключи из ответа, которых не запрашивали, тоже оседают в кэше
    Object.entries(result).forEach(([key, value]) => next.set(key, value))

    // ключ, которого нет в ответе, получает значение = ключ:
    // инвариант «запрошен ⇒ в словаре» спасает от вечного рефетча
    requested.forEach(key => {
      if (!next.has(key)) next.set(key, key)
    })

    this.dicts.set(lang, next)

    // мерж в словарь не-текущего языка (поздний ответ при смене языка)
    // ложится в кэш тихо — без version bump и без notify
    if (lang === this.lang) {
      this.version += 1
      this.notify()
    }
  }

  private notify(): void {
    this.listeners.forEach(listener => listener())
  }
}
