import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserDataContextProvider } from './context/UserContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserDataContextProvider>
        <App />
      </UserDataContextProvider>
    </BrowserRouter>
  </StrictMode>
)
