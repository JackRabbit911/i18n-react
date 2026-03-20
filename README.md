# i18n-react
## i18n module for React TS
- Doesn't require the entire translation table to be hosted on the client
- Retrieves the necessary translations upon request from the server as a key-value object
- Caches the retrieved data. Cached data is not re-requested
- Option to set a cache limit
- It is possible to receive the entire translate map in one request.
- You can implement any backend contract
- Doesn't depend on any libraries other than React itself
## Usage
*To use you only need the i18n folder, the rest is for demonstration purposes.*
Wrap your components.
```typescript
const location = useLocation()

return (
    <TranslateProvider deps={[location.pathname]}>
        ...
    </TranslateProvider>
)
```
*`useLocation()` is not required. You can specify any array of dependencies similar to `useEffect(()=>{...}, [...])`.
Important! Dependency must be reactive at the level `<TranslateProvider>`*
Somewhere in the component:
```typescript
const __ = useTranslate() //This is a reactive translation function. Call it whatever you like

return (
    <>
        <h1>{__('Title')}
        <Child __={__} /> {/*It looks funny*/}
    </>
)
```
Child.tsx
```typescript
type Props = {
    __: GetText; //The function is already typed
}

const Child = ({ __ }: Props) => {
    return (
        <div>
            {__('Up to % symbols', 8)} {/*No more 8 symbols*/}
        </div>
    )
}
```
*You can call the `useTranslate()` hook multiple times at any level of nesting inside `<TranslateProvider>` or pass the translation function as props*

The server request function must be typed like this:
```typescript
export type TranslateType = {
  [key: string]: string;
}
export type FetchTranslateType = (lang: string, keys: string[]) => Promise<TranslateType>
//or like this: (if you want to get the entire translation table in one request)
export type FetchTranslateType = (lang: string, keys: null) => Promise<TranslateType>
```
*If you use `fetchAllMap()`, set the delay parameter to 0*

Recommendation: Install the DEMO and see what works and what doesn't. It's very simple:
```bash
git clone https://github.com/JackRabbit911/i18n-react
cd i18n-react
npm i
npm run serve
```
*In the console, you'll see which port the server is running on. In your browser, go to `localhost:PORT`*

Check out the example configuration (file i18n/config.ts) and the example fetchTranslate() and fetchAllMap() functions (file i18n/utils.ts).

That's all for now. Good luck!
