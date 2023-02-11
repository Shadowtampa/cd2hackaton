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

  const [chartName, setMapName] = useState("");
  const [chartCity, setMapCity] = useState("");

  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");


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
  const [presentationMaps, setPresentationMaps] = useState(neighbourhoods)

  const dispatch = useDispatch<AppDispatch>()

  const handleAddNeighbourHood = (chartData: { name: string, city: string }) => {
    const city_id = cities.filter(cityItem => cityItem.name === chartData.city)[0].id;
    instance.post('/chart',
      { name: chartData.name, city_id: city_id },
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      .then(function (response: any) {
        alert("registro inserido com sucesso!")
        instance.get('/chart',
          {
            headers: { Authorization: `Bearer ${auth.token}` }
          })
          .then(function (response: any) {
            let tempMap: { id: any; name: any; city_id: any; }[] = []
            response.data.map((item: { id: any; name: any; city_id: any }) => {
              tempMap.push({ id: item.id, name: item.name, city_id: item.city_id })
            })
            dispatch(setNeighbourhood(tempMap))
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

        const responseMap = instance.get('/chart',
          {
            headers: { Authorization: `Bearer ${auth.token}` }
          })
          .then(function (response: any) {
            let tempMap: { id: any; name: any; city_id: any; }[] = []
            response.data.map((item: { id: any; name: any; city_id: any }) => {
              tempMap.push({ id: item.id, name: item.name, city_id: item.city_id })
            })
            dispatch(setNeighbourhood(tempMap))
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
    setPresentationMaps(neighbourhoods)
  }, [neighbourhoods])

  return (
    <div className='main-wrapper'>
      <div className='dash-table'>

        <span style={{ fontWeight: "bold" }}>Olá {auth.userName}!!</span>
        <Tabs
          defaultActiveKey="chart"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          
          <Tab eventKey="chart" title="Map">

            <div className='main-table-header-wrapper'>

              <div className='filter-wrapper'>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Origem</Form.Label>
                    <Form.Control type="text"  onChange={(event) => {
                      setOrigem(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Destino</Form.Label>
                    <Form.Control type="text"  onChange={(event) => {
                      setDestino(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter-search'>
              <Button onClick={() => console.log({origem,destino}) } >Buscar</Button>
            </div>

              </div>
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
          <Tab eventKey="chart" title="Map">

            <div className='main-table-header-wrapper'>

              <div className='filter-wrapper'>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Origem</Form.Label>
                    <Form.Control type="text"  onChange={(event) => {
                      setMapName(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Destino</Form.Label>
                    <Form.Control type="text"  onChange={(event) => {
                      setMapCity(event.target.value)
                    }} />
                  </Form.Group>
                </div>

              </div>
            </div>


            <div className='add-wrapper'>
              <Button onClick={() => handleAddNeighbourHood({ name: chartName, city: chartCity })}>Adicionar Bairro</Button>
            </div>
          </Tab>
        </Tabs>
      </Modal>
    </div>
  )
}
