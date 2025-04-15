import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import HomePage from './components/HomePage.jsx';
import Dashboard from './components/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<HomePage />}></Route>
    <Route path='/dashboard' element={<Dashboard />}></Route>
   </Routes>
   </BrowserRouter>
  </StrictMode>,
)