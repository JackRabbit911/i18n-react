import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style.css'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
