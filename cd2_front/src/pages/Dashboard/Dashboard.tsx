import React, { useState, useEffect, useLayoutEffect } from 'react'
import Table from 'react-bootstrap/Table';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import "./styles.css"

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import Form from 'react-bootstrap/Form';
import { AppDispatch, RootState } from '../../services/redux/store';

import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap';

import Modal from 'react-modal';
import { fetchCities, fetchCitiesAPI, setCities } from '../../slices/citySlice';
import { instance } from '../../services/api/axiosInstance';
import { setNeighbourhood } from '../../slices/neighbourhoodSlice';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',

    minWidth: "50%"
  },
};

export const Dashboard = () => {

  const [modalIsOpen, setIsOpen] = useState(false);
  const [registerModel, setRegisterModel] = useState("");

  const [cityName, setCityName] = useState("");
  const [cityState, setCityState] = useState("");
  const [cityFoundation, setCityFoundation] = useState("");

  const [neighbourhoodName, setNeighbourhoodName] = useState("");
  const [neighbourhoodCity, setNeighbourhoodCity] = useState("");


  const auth = useSelector((state: RootState) => state.auth)

  function openModal(model: string) {
    setIsOpen(true);
    setRegisterModel(model)
  }

  function closeModal() {
    setIsOpen(false);
    setRegisterModel("")
  }


  const cities = useSelector((state: RootState) => state.city.cities);
  const neighbourhoods = useSelector((state: RootState) => state.neighbourhood.neighbourhoods);

  const [presentationCities, setPresentationCities] = useState(cities)
  const [presentationNeighbourhoods, setPresentationNeighbourhoods] = useState(neighbourhoods)

  const dispatch = useDispatch<AppDispatch>()

  const handleAddNeighbourHood = (neighbourhoodData: { name: string, city: string }) => {
    const city_id = cities.filter(cityItem => cityItem.name === neighbourhoodData.city)[0].id;
    instance.post('/neighbourhood',
      { name: neighbourhoodData.name, city_id: city_id },
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      .then(function (response: any) {
        alert("registro inserido com sucesso!")
        instance.get('/neighbourhood',
          {
            headers: { Authorization: `Bearer ${auth.token}` }
          })
          .then(function (response: any) {
            let tempNeighbourhood: { id: any; name: any; city_id: any; }[] = []
            response.data.map((item: { id: any; name: any; city_id: any }) => {
              tempNeighbourhood.push({ id: item.id, name: item.name, city_id: item.city_id })
            })
            dispatch(setNeighbourhood(tempNeighbourhood))
          })
      })


  }
  const handleAddCity = (cityData: { name: string, state: string, foundation: any }) => {
    instance.post('/city',
      { name: cityData.name, state: cityData.state, foundation: cityData.foundation },
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      .then(function (response: any) {
        alert("registro inserido com sucesso!")
        instance.get('/city',
          {
            headers: { Authorization: `Bearer ${auth.token}` }
          })
          .then(function (response: any) {
            let tempCities: { id: any; name: any; state: any; foundation: any; }[] = []
            response.data.map((city: { id: any; name: any; state: any; foundation: any }) => {
              tempCities.push({ id: city.id, name: city.name, state: city.state, foundation: city.foundation })
            })

            dispatch(setCities(tempCities))
          })
      })


  }


  const handleFetchCities = async () => {
    const response = instance.get('/city',
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      .then(function (response: any) {
        let tempCities: { id: any; name: any; state: any; foundation: any; }[] = []
        response.data.map((city: { id: any; name: any; state: any; foundation: any }) => {
          tempCities.push({ id: city.id, name: city.name, state: city.state, foundation: city.foundation })
        })
        dispatch(setCities(tempCities))

        const responseNeighbourhood = instance.get('/neighbourhood',
          {
            headers: { Authorization: `Bearer ${auth.token}` }
          })
          .then(function (response: any) {
            let tempNeighbourhood: { id: any; name: any; city_id: any; }[] = []
            response.data.map((item: { id: any; name: any; city_id: any }) => {
              tempNeighbourhood.push({ id: item.id, name: item.name, city_id: item.city_id })
            })
            dispatch(setNeighbourhood(tempNeighbourhood))
          })

      })

    // Inferred return type: Promise<MyData>

  }


  useEffect(() => {

    handleFetchCities()

  }, [])

  useEffect(() => {
    setPresentationCities(cities)
  }, [cities])
  useEffect(() => {
    setPresentationNeighbourhoods(neighbourhoods)
  }, [neighbourhoods])

  return (
    <div className='main-wrapper'>
      <div className='dash-table'>

        <span style={{ fontWeight: "bold" }}>Olá {auth.userName}!!</span>
        <Tabs
          defaultActiveKey="city"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="city" title="City">

            <div className='main-table-header-wrapper'>
              <div className='filter-wrapper'>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nome da Cidade</Form.Label>
                    <Form.Control type="email" placeholder="Qual cidade?" onChange={(event) => { setPresentationCities(cities.filter(city => city.name.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()))) }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control type="email" placeholder="Qual Estado?" onChange={(event) => { setPresentationCities(cities.filter(city => city.state.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()))) }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Data da Fundação</Form.Label>
                    <Form.Control type="date" placeholder="Data de fundação?" onChange={(event) => { setPresentationCities(cities.filter(city => city.foundation.toString().includes(event.target.value))) }} />
                  </Form.Group>


                </div>

              </div>



            </div>


            <Table striped hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Estado</th>
                  <th>Data Fundação</th>
                </tr>
              </thead>
              <tbody>

                {presentationCities !== undefined && presentationCities.map(city =>
                  <tr key={city.id}>
                    <td>{city.id}</td>
                    <td>{city.name}</td>
                    <td>{city.state}</td>
                    <td>{city.foundation.toString()}</td>
                  </tr>
                )}
              </tbody>
            </Table>

            <div className='add-wrapper'>
              <Button onClick={() => openModal("city")}>Adicionar Cidade</Button>
            </div>
          </Tab>
          <Tab eventKey="neighbourhood" title="Neighbourhood">

            <div className='main-table-header-wrapper'>

              <div className='filter-wrapper'>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nome do Bairro</Form.Label>
                    <Form.Control type="text" placeholder="Qual bairro?" onChange={(event) => {
                      setPresentationNeighbourhoods(neighbourhoods.filter(
                        neighbourhood => neighbourhood.name.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())))
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nome da cidade</Form.Label>
                    <Form.Control type="text" placeholder="Qual Cidade?" onChange={(event) => {

                      setPresentationNeighbourhoods(
                        /**
                         * 1º Fetch all cities that contain the text ont he input
                         * 2º Fetch all ids from the fetched cities
                         * 3º Fetch all neighbours that contain any of the fetched IDs
                         * */
                        neighbourhoods.filter(neighbour => cities.filter(city => city.name.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())).map((city) => city.id).includes(neighbour.city_id))

                      )
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nome do Estado</Form.Label>
                    <Form.Control type="text" placeholder="Qual Estado?" onChange={(event) => {

                      setPresentationNeighbourhoods(
                        /**
                         * 1º Fetch all cities that contain te state property equal to the input value
                         * 2º Fetch all ids from the fetched cities
                         * 3º Fetch all neighbours that contain any of the fetched IDs
                         * */
                        neighbourhoods.filter(neighbour => cities.filter(city => city.state.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())).map((city) => city.id).includes(neighbour.city_id))

                      )
                    }} />
                  </Form.Group>
                </div>

              </div>
            </div>


            <Table striped hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Cidade</th>
                </tr>
              </thead>
              <tbody>

                {presentationNeighbourhoods.map(neighbourhood =>
                  <tr key={neighbourhood.id}>
                    <td>{neighbourhood.id}</td>
                    <td>{neighbourhood.name}</td>
                    <td>{neighbourhood.name !== "Carregando..." ? cities.filter(city => city.id === neighbourhood.city_id)[0].name : null}</td>
                  </tr>
                )}
              </tbody>
            </Table>

            <div className='add-wrapper'>
              <Button onClick={() => openModal("neighbourhood")} >Adicionar Bairro</Button>
            </div>

          </Tab>
        </Tabs>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Adicionar {registerModel === "city" ? "Cidade" : "Bairro"}</h2>
        <button onClick={closeModal}>close</button>
        <Tabs
          defaultActiveKey={registerModel}
          id="uncontrolled-tab-example"
          className="mb-3"
          onSelect={(event) => event && setRegisterModel(event)}

        >
          <Tab eventKey="city" title="City">

            <div className='main-table-header-wrapper'>
              <div className='filter-wrapper'>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nome da Cidade</Form.Label>
                    <Form.Control type="email" placeholder="Qual cidade?" onChange={(event) => {
                      setCityName(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control type="email" placeholder="Qual Estado?" onChange={(event) => setCityState(event.target.value) }/>
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Data da Fundação</Form.Label>
                    <Form.Control type="date" placeholder="Data de Fundação?" onChange={(event) => setCityFoundation(event.target.value) }/>

                  </Form.Group>
                </div>

              </div>



            </div>

            <div className='add-wrapper'>
              <Button onClick={() => handleAddCity({name: cityName, foundation: cityFoundation, state :cityState})}>Adicionar Cidade</Button>
            </div>
          </Tab>
          <Tab eventKey="neighbourhood" title="Neighbourhood">

            <div className='main-table-header-wrapper'>

              <div className='filter-wrapper'>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nome do Bairro</Form.Label>
                    <Form.Control type="text" placeholder="Nome do novo bairro:" onChange={(event) => {
                      setNeighbourhoodName(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nome da cidade</Form.Label>
                    <Form.Control type="text" placeholder="Qual Cidade?" onChange={(event) => {
                      setNeighbourhoodCity(event.target.value)
                    }} />
                  </Form.Group>
                </div>

              </div>
            </div>


            <div className='add-wrapper'>
              <Button onClick={() => handleAddNeighbourHood({ name: neighbourhoodName, city: neighbourhoodCity })}>Adicionar Bairro</Button>
            </div>
          </Tab>
        </Tabs>
      </Modal>
    </div>
  )
}
