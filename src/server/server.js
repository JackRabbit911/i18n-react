import express from 'express';
import cors from 'cors';
import { getMap } from './i18n.js';

const app = express();
const PORT = 8080;
const staticRootUrl = new URL('../../dist/', import.meta.url).pathname;

const DEFAULT_LANG = 'en';
const SUPPORTED_LANGS = ['en', 'de', 'ru'];

// acceptsLanguages returns false when nothing matches — fall back to default
const detectLang = (req) => req.acceptsLanguages(SUPPORTED_LANGS) || DEFAULT_LANG;

app.use(cors());
app.use(express.static(staticRootUrl))
app.use(express.json())

app.post('/api/gettranslate', (req, res) => {
  const filter = req.body?.filter;
  const keys = Array.isArray(filter) ? filter.filter(k => typeof k === 'string') : null;
  const response = {
    success: true,
    result: getMap(detectLang(req), keys),
  }

  res.json(response)
});

app.get('/api/gettranslate', (req, res) => {
  const response = {
    success: true,
    result: getMap(detectLang(req), null),
  }

  res.json(response)
});

app.use((req, res) => {
  res.status(404).send('404 — Not Found')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
