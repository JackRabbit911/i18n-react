import { existsSync, readFileSync } from 'fs'
import { parse } from 'yaml'
import * as path from 'node:path'


export const getMap = (lang, keys) => {
    const filename = path.resolve('./', 'src/server/data', `${lang}.yaml`)

    if (existsSync(filename)) {
        const content = readFileSync(filename, 'utf8')
        const dataObject = parse(content)

        if (!keys) {
            return dataObject
        }

        const mapArray = keys.map((key) => Object.hasOwn(dataObject, key) ?
            [key, dataObject[key]] : [key, key])
        
        return Object.fromEntries(mapArray);
    } else return {}
}
