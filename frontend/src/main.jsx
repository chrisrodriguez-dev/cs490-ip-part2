import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import FilmDetails from './FilmDetails.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/landing-page" element={<App/>} />
      <Route path="/film-details/:id" element={<FilmDetails/>} />
    </Routes>
  </BrowserRouter>,
)
