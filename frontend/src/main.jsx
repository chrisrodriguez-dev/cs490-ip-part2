import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import FilmDetails from './FilmDetails.jsx';
import Navbar from './components/navbar.jsx'; 
import Customers from './Customers.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar /> 
    <Routes>
      <Route path="/" element={<App/>} />
      <Route path="/film-details/:id" element={<FilmDetails/>} />
      <Route path="/customers" element={<Customers/>} />
    </Routes>
  </BrowserRouter>,
)