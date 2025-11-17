import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@/context/ThemeContext'

import './scss/main.scss'

import './i18n.ts';
import Loader from './components/UI/Loader/Loader.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Suspense fallback={<Loader />}>
      <StrictMode >
        <App />
      </StrictMode>
    </Suspense>
  </ThemeProvider>
)
