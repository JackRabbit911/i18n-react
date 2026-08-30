import { existsSync, readFileSync, statSync } from 'fs'
import { parse } from 'yaml'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

// resolve relative to this module, not the process cwd —
// the server must work when started from any directory
const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data')

// per-lang cache: { mtime, data } — yaml is re-read only when the file changes
const cache = new Map()

const loadLang = (lang) => {
    const filename = path.join(dataDir, `${lang}.yaml`)

    if (!existsSync(filename)) {
        return null
    }

    const mtime = statSync(filename).mtimeMs
    const cached = cache.get(lang)

    if (cached && cached.mtime === mtime) {
        return cached.data
    }

    const content = readFileSync(filename, 'utf8')
    const dataObject = parse(content)
    cache.set(lang, { mtime, data: dataObject })

    return dataObject
}

export const getMap = (lang, keys) => {
    if (!lang) {
        return {}
    }

    const dataObject = loadLang(lang)

    if (!dataObject) {
        return {}
    }

    if (!keys) {
        return dataObject
    }

    const mapArray = keys.map((key) => Object.hasOwn(dataObject, key) ?
        [key, dataObject[key]] : [key, key])

    return Object.fromEntries(mapArray);
}
