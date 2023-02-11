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


const _API = "AIzaSyApL72fzMsNAWZ75YfIojgTMIEGMj-l3QU";

export const Dashboard = () => {

  // Utilização do hook "useSelector" do React Redux para obter informações do estado da aplicação.
  const auth = useSelector((state: RootState) => state.auth)

  // Utilização do hook "useDispatch" do React Redux para dispatchar ações.
  const dispatch = useDispatch<AppDispatch>()

  // Declaração de estados para a origem e destino da rota. Inicializado com valores fixos.
  const [origem, setOrigem] = useState<any>("Travessa sorriso de maria, 474");
  const [destino, setDestino] = useState("ulbra santarem");

  // Declaração de estados para as coordenadas da origem e destino. Inicializado com valores fixos.
  const [origemCoords, setOrigemCoords] = useState({ lat: -2.4382325, lng: -54.7158996 });
  const [destinoCoords, setDestinoCoords] = useState({ lat: -2.4382325, lng: -54.7158996 });

  const [meioTransporte, setMeioTransporte] = useState("WALKING");

  const [timeUntilGoal, setTimeUntilGoal] = useState(0);

  const mapRef = useRef(null);

  const updateMap = () => {
    console.log("updateMap")
    //Cria uma instância do DirectionsService do Google Maps
    const directionsService = new google.maps.DirectionsService();

    console.log(meioTransporte === "WALKING")
    //Solicita a rota entre as coordenadas de origem e destino
    directionsService.route(
      {
        origin: origemCoords,
        destination: destinoCoords,
        travelMode: google.maps.TravelMode.WALKING
      }
      ,
      (result, status) => {
        //Se o status da solicitação de rota for OK e o mapa estiver pronto
        if (status === google.maps.DirectionsStatus.OK && mapRef.current !== null) {
          //Cria um novo mapa com zoom 7
          const map = new google.maps.Map(mapRef.current, {
            zoom: 7
          });
          //Renderiza as direções na tela
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            directions: result
          });
        } else {
          //Exibe o resultado de erro no console
          console.error(result);
        }
      }
    );

  }

  // Função para atualizar o gráfico
  const handleUpdateChart = () => {

    // console.log("handleUpdateChart")

    // Endereço de proxy para contornar restrições de CORS
    const API_PROXY = 'https://cors-anywhere.herokuapp.com/';

    // Criação de uma instância da API Axios, configurada com a URL base
    const api = axios.create({
      baseURL:  `https://maps.googleapis.com/`
    });

    // Requisição à API do Google Maps para obter informações sobre a rota
    api.get(`maps/api/directions/json?origin=${origem}&destination=${destino}&key=${_API}&mode=${meioTransporte}`)
      .then(response => {
        // Armazenamento das coordenadas de origem e destino retornadas pela API
        setOrigemCoords({ lat: response.data.routes[0].legs[0].start_location.lat, lng: response.data.routes[0].legs[0].start_location.lng })
        setDestinoCoords({ lat: response.data.routes[0].legs[0].end_location.lat, lng: response.data.routes[0].legs[0].end_location.lng })
        setTimeUntilGoal(oldState => oldState = response.data.routes[0].legs[0].duration.text)
      })
      .catch(error => {
        // Tratamento de erros
        console.error(error);
      });

      updateMap()
  }


  useEffect(() => {
    // console.log("executado pois código foi ativado")
    updateMap()
  }, [destinoCoords, origemCoords])

  useEffect(() => {

    // console.log("primeira exec")
    // Verifica se o navegador suporta a API de geolocalização
    if (navigator.geolocation) {
      // Obtém a localização atual do usuário
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Atualiza o estado "origemCoords" e o "destinoCoords" com a mesma localização atual
        setOrigemCoords(oldState => oldState = pos)
        setDestinoCoords(oldState => oldState = pos)

        // Atualiza o estado "origem" e o "destinoC" com a mesma localização atual
        setOrigem((oldState: any) => oldState = pos.lat.toString() + "," + pos.lng.toString())
        setDestino((oldState: any) => oldState = pos.lat.toString() + "," + pos.lng.toString())

      });
    }

    // Cria uma nova instância de "DirectionsService" do Google Maps API
    const directionsService = new google.maps.DirectionsService();
    // console.log(meioTransporte === "WALKING")
    // Solicita uma rota de direções do serviço
    directionsService.route(
      {

       
        // Define a origem da rota como a localização atual do usuário
        origin: origemCoords,
        // Define o destino da rota com o valor armazenado em "destination"
        destination: destinoCoords,

        
        travelMode: google.maps.TravelMode.WALKING


      },
      (result, status) => {
        // Verifica se o status da solicitação é "OK"
        if (status === google.maps.DirectionsStatus.OK && mapRef.current !== null) {
          // Cria uma nova instância de "Map" do Google Maps API
          const map = new google.maps.Map(mapRef.current, {
            // Define o zoom inicial como 7
            zoom: 7,
            // Define o centro inicial do mapa com a localização atual do usuário
            center: origemCoords
          });
          // Cria uma nova instância de "DirectionsRenderer" do Google Maps API
          const directionsRenderer = new google.maps.DirectionsRenderer({
            // Define o mapa a ser renderizado com a instância de "Map" criada anteriormente
            map: map,
            // Define as direções a serem renderizadas com o resultado da solicitação
            directions: result
          });
        } else {
          console.error(result);
        }
      }
    );
  }, []);

  useEffect(() => {
    // console.log(meioTransporte)

    let _temp = origem;
    setDestino(oldState => oldState = destino)
    setOrigem((oldState: any) => oldState = _temp)

  }, [meioTransporte])


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
                    <Form.Control type="text" value={origem} onChange={(event) => {
                      setOrigem(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Destino</Form.Label>
                    <Form.Control type="text" value={destino} onChange={(event) => {
                      setDestino(event.target.value)
                    }} />
                  </Form.Group>
                </div>
                <div className='filter'>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Meio de transporte</Form.Label>
                    <Form.Select onChange={e => setMeioTransporte(e.target.value)}>
                      <option value="driving">Carro</option>
                      <option value="walking">Caminhada</option>
                      <option value="bicycling">Bicicleta</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className='filter-search'>
                  <Button onClick={handleUpdateChart} >Buscar</Button>
                </div>

              </div>
            </div>

            <div ref={mapRef} style={{ height: '400px', width: '100%' }} />

            <div>Tempo até a chegada: {timeUntilGoal}</div>

          </Tab>
        </Tabs>
      </div>
    </div>
  )
}
