import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UseContextProvider } from '../UseContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <UseContextProvider>
    <App />
    </UseContextProvider>
    
    </BrowserRouter>
 
  </React.StrictMode>,
)
