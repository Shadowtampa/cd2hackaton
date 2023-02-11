import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
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
import { logout, toggleLoggedIn } from '../slices/authSlice';

// import { loadFromStorage } from '../features/authSlice';

import { ImExit } from 'react-icons/im';

export const AppRoutes = () => {

  const auth = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/dashboard">
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
                    {auth.userName} <img style={{paddingRight: "15px", borderRadius: "50%"}} src={`https://avatars.dicebear.com/api/adventurer-neutral/${encodeURIComponent(auth.userName.trim())}.svg`}></img>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1" style={{color: "black"}}>Logout <ImExit  /></Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                : <Button variant="link" onClick={() => { dispatch(toggleLoggedIn()) }} >Login</Button>}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Router>
        <Routes>
          {/* <Route path="/" element={localStorage.getItem('status') === "success" ? <Dashboard /> : <Landing />} /> tela de login */}
          <Route path="/" element={localStorage.getItem('status') === "success" ? <Dashboard /> : <Landing />} /> {/* tela de login */}
          <Route path="/city" element={auth.status ? <City /> : <Landing />} /> {/* Tela de cadastro de cidade */}
          <Route path="/neighbourhood" element={auth.status ? <Neighbourhood /> : <Landing />} /> {/* Tela de cadastro de bairro */}
          <Route path="/dashboard" element={auth.status ? <Dashboard /> : <Landing />} /> {/* Relatório de cidades e bairro */}
          <Route path="/user" element={auth.status ? <User /> : <Landing />} /> {/* Tela de cadastro de usuário. */}
        </Routes>
      </Router>

    </>

  )
}
