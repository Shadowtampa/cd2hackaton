import React from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import "./styles.css"

import { useNavigate } from "react-router-dom";


import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../services/redux/store';
import { loginHandler, toggleLoggedIn } from '../../slices/authSlice';
import { Col, Container, Row } from 'react-bootstrap';

import Modal from 'react-modal';
import { instance } from '../../services/api/axiosInstance';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export const Landing = () => {

  const navigate = useNavigate();

  const auth = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const handleLogin = () => {
    navigate("/dashboard");
    dispatch(toggleLoggedIn())
  }

  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [emailReg, setEmailReg] = React.useState("");
  const [passwordReg, setPasswordReg] = React.useState("");
  const [nameReg, setNameReg] = React.useState("");

  function openModal() {
    setIsOpen(true);
  }


  function closeModal() {
    setIsOpen(false);
  }

  const axios = require('axios').default;

  const handleLoginAPI =  () => {
    dispatch(loginHandler())
    navigate("/dashboard");
  }

  /**
   * 
   * @param credentials 
   *  Função visando a implementação futura de uma API
   */
  const handleRegisterAPI = async (credentials: { nameReg: string, emailReg: string, passwordReg: string }) => {

  }



  return (
    <div className="main-wrapper" style={{ marginTop: "10rem" }}>

      <Container style={{ height: "100%" }}>
        <Row >
          <Col xs={6} >
            <div style={{ display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center" }}>


              <h2 className="greetings">Bem vindo de volta!</h2>
              <Button onClick={openModal}>Login</Button>
            </div>
          </Col>
          <Col xs={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" placeholder="Enter email" onChange={(event) => setNameReg(event.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(event) => setEmailReg(event.target.value)} />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(event) => setPasswordReg(event.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(event) => setPasswordReg(event.target.value)} />
              </Form.Group>


              <Button variant="primary" onClick={() => handleRegisterAPI({ nameReg, emailReg, passwordReg })}>
                Register
              </Button>
            </Form></Col>
        </Row>
      </Container>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
          </Form.Group>
          <Button variant="primary" onClick={() => { handleLoginAPI()}}>
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
