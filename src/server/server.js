import express from 'express';
import cors from 'cors';
import { getMap } from './i18n.js';

const app = express();
const PORT = 8080;
const staticRootUrl = new URL('../dist/', import.meta.url).pathname;

app.use(cors());
app.use(express.static(staticRootUrl))
app.use(express.json())

app.post('/api/gettranslate', (req, res) => {
  const lang = req.acceptsLanguages(['en', 'de', 'ru'])
  const response = {
    success: true,
    result: getMap(lang, req.body.filter),
  }

  res.json(response)
});

app.use((req, res) => {
  res.status(404).send('404 — Not Found')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
