import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/context/ThemeContext'


import './i18n.ts';
import Loader from './components/UI/Loader/Loader.tsx'
import { RouterProvider } from 'react-router'
import { router } from './Routes/index.ts';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  </ThemeProvider>
)
