import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Landing } from '../pages/Landing/Landing';
import { City } from '../pages/City/City';
import { Neighbourhood } from '../pages/Neighbourhood/Neighbourhood';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { User } from '../pages/User/User';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { RootState } from '../services/redux/store';

import { useSelector, useDispatch } from 'react-redux'
import { Button, Dropdown } from 'react-bootstrap';
import { loginHandler, logoutHandler, toggleLoggedIn } from '../slices/authSlice';

// import { loadFromStorage } from '../features/authSlice';

import { ImExit } from 'react-icons/im';
import { DashboardTeste } from '../pages/DashboardTeste/Dashboard';

export const AppRoutes = () => {


  const auth = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutHandler());
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            Equipe Rocket
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {auth.status ?
                // <Button variant="link" onClick={() => {
                //   dispatch(logout());
                //   dispatch(toggleLoggedIn());
                //   }}>Logout</Button>

                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic" >
                    {auth.userName} 
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/" style={{color: "black"}} onClick={() => { dispatch(logoutHandler()) }}>Logout <ImExit /></Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                : <Button variant="link" onClick={() => { dispatch(loginHandler()) }} >Login</Button>}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Router>
        <Routes>
          <Route path="/" element={localStorage.getItem('status') ? <Dashboard /> : <Landing />} /> tela de login
          <Route path="/teste" element={localStorage.getItem('status') ? <DashboardTeste /> : <Landing />} /> tela de login
          {/* <Route path="/" element={localStorage.getItem('status') === "success" ? <Dashboard /> : <Landing />} /> tela de login */}
          <Route path="/city" element={auth.status ? <City /> : <Landing />} /> {/* Tela de cadastro de cidade, mudar para cadastro de */}
          <Route path="/user" element={auth.status ? <User /> : <Landing />} /> {/* Tela de cadastro de usuário. */}
        </Routes>
      </Router>

    </>

  )
}
