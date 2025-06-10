import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "@/components/ui/sonner";
createRoot(document.getElementById('root')!).render(
  <>
    <Toaster />
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <AuthProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </AuthProvider>
  </ThemeProvider>
  </>
  ,
)
