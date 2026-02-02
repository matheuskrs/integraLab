import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '~/styles/global.css';
import App from './App.jsx'
import { GlobalLoadingProvider } from '~/providers/GlobalLoading/GlobalLoadingProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalLoadingProvider>
      <App />
    </GlobalLoadingProvider>
  </StrictMode>
);