import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
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
import { setNeighbourhood } from '../../slices/neighbourhoodSlice';

import GoogleMapReact from 'google-map-react';
import { DirectionsRenderer, DirectionsService } from '@react-google-maps/api';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

Modal.setAppElement('#root');

const _API = "AIzaSyApL72fzMsNAWZ75YfIojgTMIEGMj-l3QU";

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627
  },
  zoom: 11
};


const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -50.523
};

const AnyReactComponent = ({ text }: any) => <div>{text}</div>;

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

  const [origem, setOrigem] = useState("Travessa sorriso de maria, 474");
  const [destino, setDestino] = useState("ulbra santarem");


  const auth = useSelector((state: RootState) => state.auth)

  function openModal(model: string) {
    setIsOpen(true);
    setRegisterModel(model)
  }

  function closeModal() {
    setIsOpen(false);
    setRegisterModel("")
  }


  const [directions, setDirections] = useState(null);

  const origin = {
    lat: -2.4379422,
    lng: -54.7183108
  };
  const destination = {
    lat: -22.9068619,
    lng: -43.172946
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyApL72fzMsNAWZ75YfIojgTMIEGMj-l3QU"
  })

  const [map, setMap] = React.useState(null)

  // // const onLoad = React.useCallback(function callback(map:any) {
  // //   // This is just an example of getting and using the map instance!!! don't just blindly copy!
  // //   const bounds = new window.google.maps.LatLngBounds(center);
  // //   map.fitBounds(bounds);

  // //   setMap(map)
  // // }, [])
  const onLoad = async () => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsDisplay = new window.google.maps.DirectionsRenderer();
    directionsDisplay.setDirections({routes:directions as any})
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result: any, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };
  console.log('directions', directions)
  useEffect(() => {

    onLoad();
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null)
  }, [])


  const cities = useSelector((state: RootState) => state.city.cities);
  const neighbourhoods = useSelector((state: RootState) => state.neighbourhood.neighbourhoods);

  const [presentationCities, setPresentationCities] = useState(cities)
  const [presentationMaps, setPresentationMaps] = useState(neighbourhoods)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setPresentationCities(cities)
  }, [cities])

  useEffect(() => {
    setPresentationMaps(neighbourhoods)
  }, [neighbourhoods])

  // useEffect(() => {

  //   const API_PROXY = 'https://cors-anywhere.herokuapp.com/';

  //   const api = axios.create({
  //     baseURL: API_PROXY + `https://maps.googleapis.com/`
  //   });

  //   api.get(`maps/api/directions/json?origin=${origem}&destination=${destino}&key=${_API}`)
  //     .then(response => {
  //       console.log("nao fudeu")
  //       console.log(response.data.routes);
  //     })
  //     .catch(error => {
  //       console.log("fudeu")
  //       console.error(error);
  //     });

  //   // getDirections();
  // }, []);

  const mapRef = useRef(null);

  useEffect(() => {
    const directionsService = new google.maps.DirectionsService();


    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && mapRef.current !== null) {
          const map = new google.maps.Map(mapRef.current, {
            zoom: 7,
            center: origin
          });
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            directions: result
          });
        } else {
          console.error(result);
        }
      }
    );
  }, []);




  console.log('directions', directions)
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
                    <Form.Control type="text" value="Travessa sorriso de maria, 474" onChange={(event) => {
                      setOrigem(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Destino</Form.Label>
                    <Form.Control type="text" value="ulbra santarem" onChange={(event) => {
                      setDestino(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter-search'>
                  <Button onClick={() => console.log({ origem, destino })} >Buscar</Button>
                </div>

              </div>
            </div>


            {/* <div style={{ height: '100vh', width: '100%' }} >
              <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyApL72fzMsNAWZ75YfIojgTMIEGMj-l3QU' }}
                defaultCenter={origin}
                defaultZoom={11}
              >
                  <DirectionsRenderer directions={directions} />
              </GoogleMapReact>
            </div> */}

            {/* <div ref={mapRef} style={{ height: '400px', width: '100%' }} /> */}
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                { /* Child components, such as markers, info windows, etc. */}
                <></>
              </GoogleMap>
            ) : <></>}

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
                    <Form.Control type="email" placeholder="Qual Estado?" onChange={(event) => setCityState(event.target.value)} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Data da Fundação</Form.Label>
                    <Form.Control type="date" placeholder="Data de Fundação?" onChange={(event) => setCityFoundation(event.target.value)} />

                  </Form.Group>
                </div>

              </div>



            </div>

          </Tab>
          <Tab eventKey="chart" title="Map">

            <div className='main-table-header-wrapper'>

              <div className='filter-wrapper'>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Origem</Form.Label>
                    <Form.Control type="text" onChange={(event) => {
                      setMapName(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Destino</Form.Label>
                    <Form.Control type="text" onChange={(event) => {
                      setMapCity(event.target.value)
                    }} />
                  </Form.Group>
                </div>

              </div>
            </div>

          </Tab>
        </Tabs>
      </Modal>
    </div>
  )
}
