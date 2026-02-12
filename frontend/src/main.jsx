import App from '@pages/App.jsx'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import AuthProvider from '@hooks/AuthProvider.jsx'
import { CookiesProvider } from 'react-cookie'



createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <CookiesProvider defaultSetOptions={{ path: '/', maxAge: (60 * 30), secure: true, sameSite: 'lax' }}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </CookiesProvider>
  // </StrictMode>,

)
