import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.scss'
import Routes from './routes/routes.tsx'
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
)
