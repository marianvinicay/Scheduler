import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from '../Navbar';
import LandingPage from '../Auth/LandingPage';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import Guard from '../Auth/Guard';
import UserPanel from '../User/Panel';
import AdminPanel from '../Admin/Panel';
import AdminUsers from '../Admin/Users';
import AdminReservations from '../Admin/Reservations';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Guard policy='user' content={<Navbar content={<UserPanel />} />} />} />
            <Route path="/admin" element={<Guard policy='admin' content={<Navbar content={<AdminPanel />} />} />} />
            <Route path="/admin/users" element={<Guard policy='admin' content={<Navbar content={<AdminUsers />} />} />} />
            <Route path="/admin/reservations" element={<Guard policy='admin' content={<Navbar content={<AdminReservations />} />} />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
