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

import axios from 'axios';
import { setOriginalNode } from 'typescript';

Modal.setAppElement('#root');

const _API = "AIzaSyApL72fzMsNAWZ75YfIojgTMIEGMj-l3QU";

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627
  },
  zoom: 11
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

  const [origem, setOrigem] = useState("Travessa sorriso de maria, 474");
  const [destino, setDestino] = useState("ulbra santarem");

  const [origemCoords, setOrigemCoords] = useState({ lat: -2.4382325, lng: -54.7158996 });
  const [destinoCoords, setDestinoCoords] = useState({ lat: -2.4382325, lng: -54.7158996 });


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
  //       console.log(response.data.routes[0].legs[0]);
  //       setOrigemCoords({ lat: response.data.routes[0].legs[0].start_location.lat, lng: response.data.routes[0].legs[0].start_location.lng })
  //       setDestinoCoords({ lat: response.data.routes[0].legs[0].end_location.lat, lng: response.data.routes[0].legs[0].end_location.lng })
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });

  //   // getDirections();
  // }, []);

  const updateMap = () => {
    const directionsService = new google.maps.DirectionsService();

    console.log(origemCoords)
    console.log(destinoCoords)


    directionsService.route(
      {
        origin: origemCoords,
        destination: destinoCoords,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && mapRef.current !== null) {
          const map = new google.maps.Map(mapRef.current, {
            zoom: 7
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
  }

  const handleUpdateChart = () => {
    const API_PROXY = 'https://cors-anywhere.herokuapp.com/';

    const api = axios.create({
      baseURL: API_PROXY + `https://maps.googleapis.com/`
    });

    api.get(`maps/api/directions/json?origin=${origem}&destination=${destino}&key=${_API}`)
      .then(response => {
        console.log(response.data.routes[0].legs[0]);
        setOrigemCoords({ lat: response.data.routes[0].legs[0].start_location.lat, lng: response.data.routes[0].legs[0].start_location.lng })
        setDestinoCoords({ lat: response.data.routes[0].legs[0].end_location.lat, lng: response.data.routes[0].legs[0].end_location.lng })
      })
      .catch(error => {
        console.error(error);
      });


  }


  useEffect(() => {
    updateMap()
  }, [destinoCoords, origemCoords])

  useEffect(() => {
    console.log(origem)
  }, [origem])

  useEffect(() => {
    console.log(destino)
  }, [destino])


  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setOrigemCoords(pos)
      }, function () {
        // Handle errors here
      });
    } else {
      // Browser doesn't support Geolocation
    }

    const directionsService = new google.maps.DirectionsService();


    directionsService.route(
      {
        origin: origemCoords,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && mapRef.current !== null) {
          const map = new google.maps.Map(mapRef.current, {
            zoom: 7,
            center: origemCoords
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



  const [directions, setDirections] = useState(null);

  const origin = { lat: -2.4382325, lng: -54.7158996 };
  const destination = { lat: -2.4379422, lng: -54.7183108 };

 

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
                    <Form.Control type="text" onChange={(event) => {
                      setOrigem(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Destino</Form.Label>
                    <Form.Control type="text" onChange={(event) => {
                      setDestino(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter-search'>
                  <Button onClick={handleUpdateChart} >Buscar</Button>
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

            <div ref={mapRef} style={{ height: '400px', width: '100%' }} />


          </Tab>
        </Tabs>
      </div>
    </div>
  )
}
