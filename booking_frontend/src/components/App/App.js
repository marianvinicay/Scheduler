import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
//import useToken from './components/App/useToken';

import Login from '../Auth/Login';
import Register from '../Auth/Register';
import Dashboard from '../Dashboard/Dashboard';

import './App.css';

function RequireAuth() {
  let location = useLocation();

  if (!Cookies.get('token')) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}

function LandingPage() {
  if (!Cookies.get('token')) {
    return <Navigate to="/login" />;
  }
  return <Navigate to="/dashboard" />;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
