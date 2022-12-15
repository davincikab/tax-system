import { useEffect, useRef, useState, useCallback } from 'react';
import Map, { Source, Layer, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';

// import { read, utils } from "xlsx";
import {read, utils} from "xlsx";

import geoData from '../../assets/data/districts.json';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';

const MapContainer = (props) => {
  const mapRef = useRef(null);

  const [state, setState] = useState({
    activeDistrict:null,
    rental_data:null, 
    district_buildings:null,
    cursor:'auto',
    popupInfo:null,
    buildingInfo:null
  });

  useEffect(() => {
    fitToFeatureBounds();

    if(!state.rental_data) {
      readRentalData();
    }
    
  }, [props.activeDistrict, state.activeDistrict]);

  // load rental data
  const readRentalData = () => {
    fetch('/assets/data/Rental Data.xlsx')
    .then(res => res.arrayBuffer())
    .then(data => {

      let workbook = read(data);
      let rental_data = utils.sheet_to_json(workbook.Sheets['Rent Place']);

      // console.log(geoData);
      // console.log(rental_data);

      geoData.features = geoData.features.map(ft => {
        let entry = rental_data.find(dt => dt['District Name'] === ft.properties.Name);

        // if(entry) {
        //   console.log(entry);
        // }

        ft.properties.summaryInfo = {...entry} || {};
        
        return ft;
      });

      setState({
        ...state,
        rental_data:JSON.parse(JSON.stringify(rental_data))
      });

    });

    
  }

  // load map data
  const handleMapLoad = (evt) => {
    console.log("Map load event");
  }

  // fit feature
  const fitToFeatureBounds = () => {
    
    if(state.activeDistrict || props.activeDistrict) {
      let name = state.activeDistrict || props.activeDistrict;

      let feature = geoData.features.find(ft => ft.properties.Name === name);
      var bbox = turf.bbox(feature);

      // console.log(bbprops
      mapRef.current.fitBounds(bbox, { padding:100 });
      // console.log(mapRef.current);
      // mapRef.current.setPaintProperty("districts-data", "fill-opacity", 0.2);

    }

  }

  // set
  const setPopupInfo = (info) => {
    setState({
      ...state,
      popupInfo:info,
      // buildingInfo:info
    });


  }

  // update cursor
  const setCursor = (cursor) => {
    setState({
      ...state,
      cursor
    });

  }

  // mouse events
  const onMouseEnter = (evt) => {
    console.log("Mouse Enter Event");
    let {features, lngLat } = evt;

    if(features[0] && features[0].layer.id === "districts-data") {
      if(state.activeDistrict === features[0].properties.Name) {
        return;
      }
      // console.log("Feature");

      let feature = {...features[0]};
      let summaryInfo = JSON.parse(feature.properties.summaryInfo);
      // summaryInfo.Location ? summaryInfo.Location.split(",").reverse() :

      let coords =  [lngLat.lng, lngLat.lat];

      summaryInfo.latitude = coords[1];
      summaryInfo.longitude = coords[0]; 

      // console.log(summaryInfo);

      setState({
        ...state,
        popupInfo:summaryInfo,
        cursor:'pointer'
      });
      
    } else {

      // let props = features[0].properties;
      // let coords = Object.values(evt.lngLat);

      // let info = {...props, latitude:coords[1], longitude:coords[0]}
      // console.log(info);
      
      // setState({
      //   ...state,
      //   buildingInfo:{...info},
      //   cursor:'pointer'
      // });
      // setCursor('pointer');
    }

    
  }

  const onMouseLeave = (evt) => {
    // setState({
    //   ...state,
    //   // popupInfo:null,
    //   cursor:'auto'
    // });
    
  }

  // map click event
  const handleMapClick = (evt) => {
    // query districts data
    console.log(evt.features);

    let { features } = evt
    
    if(features[0] && features[0].layer.id === 'districts-data') {
      // 
      if(state.activeDistrict === features[0].properties.Name) {
        
      } else {
        console.log("District Info")
        updateDistrictBuilding(features[0].properties.Name);
      }     
      // props.selectDistrict(features[0].properties.Name);      
    } 
    
    if(features[0] && features[0].layer.id === 'districts-buildings') {
      console.log("Rendering District Popup");
      
      let props = features[0].properties;
      let coords = Object.values(evt.lngLat);

      let info = {...props, latitude:coords[1], longitude:coords[0]}
      console.log(info);
      
      setState({
        ...state,
        buildingInfo:{...info},
        cursor:'pointer'
      });

    }

    // console.log(features);

  }

  const updateDistrictBuilding = (district) => {
    let activeDistricts = state.rental_data.filter(building => building["District Name"] === district);
    console.log(activeDistricts);

    // props.selectDistrict(district);

    console.log("Updating District:", district);

    setState({
      ...state,
      activeDistrict:district,
      district_buildings:activeDistricts
    });

  }

  const getBuildingGeoJSON = (entries) => {
    if(!entries) return turf.featureCollection([]);

    let items = entries.filter(item => item.Location).map(item => {
      let coords = item.Location.split(",").map(v => parseFloat(v)).reverse();

    
      let feature = turf.point([...coords], { ...item, coords } )
      return feature;
    });

    // console.log(items);

    return turf.featureCollection([...items]);
  }


  let { district_buildings, activeDistrict, cursor, popupInfo, buildingInfo } = state;
  let building_json = getBuildingGeoJSON(district_buildings);
  let districtStyle = dataLayer(activeDistrict || props.activeDistrict);
  let layerIds = district_buildings ? ["districts-buildings", "districts-data"] : ['districts-data'];

  console.log(buildingInfo);

  return (
    <>
        <Map
            initialViewState={{
                longitude: 103.147645,
                latitude: 5.311248,
                zoom: 10
            }}
            ref={mapRef}
            mapStyle="mapbox://styles/mapbox/dark-v9"
            mapboxAccessToken={MAPBOX_TOKEN}
            interactiveLayerIds={[...layerIds]}
            cursor={cursor}
            id="map-container"
            onLoad={handleMapLoad}
            onClick={handleMapClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            // onMouseMove={onHover}
        >
          <Source type="geojson" data={geoData} id="districts-data">
              <Layer {...districtStyle} />
          </Source>

            {
              district_buildings &&
              <Source type="geojson" data={building_json} id="districts-buildings">
                <Layer {...buildingStyle()} />
            </Source>
            }

            {/* district summary info */}
            {popupInfo && (
              <Popup
                anchor="top"
                longitude={Number(popupInfo.longitude)}
                latitude={Number(popupInfo.latitude)}
                onClose={() => setPopupInfo(null)}
                focusAfterOpen={false}
                closeOnClick={false}
              >
                <div className='popup-content'>
                  <div className='popup-header'>
                    {popupInfo['District Name']}
                  </div>

                  <div className='popup-body'>
                    <div className='popup-item'>
                      <div className='item-label'>Total Units</div>
                      <div className='item-value'>{popupInfo['Total Unit']}</div>
                    </div>

                    <div className='popup-item'>
                      <div className='item-label'>Unit Available</div>
                      <div className='item-value'>{popupInfo['Unit Available']}</div>
                    </div>

                    <div className='popup-item'>
                      <div className='item-label'>Total Rent</div>
                      <div className='item-value'>{popupInfo['Total Rent']}</div>
                    </div>
                  </div>

                </div>
              </Popup>
            )}

            {/*  building-summary-info */}
            {buildingInfo && (
              <Popup
                anchor="top"
                longitude={Number(buildingInfo.longitude)}
                latitude={Number(buildingInfo.latitude)}

                onClose={() => setPopupInfo(null)}
              >
                <div className='popup-content'>
                  <div className='popup-header'>
                    {buildingInfo['Name']}
                  </div>

                  <div className='popup-body'>
                    <div className='popup-item'>
                      <div className='item-label'>Unit Number</div>
                      <div className='item-value'>{buildingInfo['Unit Number']}</div>
                    </div>

                    <div className='popup-item'>
                      <div className='item-label'>Unit Available</div>
                      <div className='item-value'>{buildingInfo['Unit Available']}</div>
                    </div>

                    <div className='popup-item'>
                      <div className='item-label'>Total Rent</div>
                      <div className='item-value'>{buildingInfo['Total Rent']}</div>
                    </div>
                  </div>

                </div>
              </Popup>
            )}
          

          {/* render the data relating to the given district */}


          <NavigationControl position='bottom-right'/>
        </Map>
    </>
    )
}

const UnitDetailSection = (props) => {
  return (
    <div className='units-section'>

    </div>
  )
}


// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = (district) => {
  // console.log(district);

  return {
    id: "districts-data",
    type: 'fill',
    filter:[
      'match',
      ['get', 'Name'],
      `${district}`, 
      false,
      true
    ],
    paint: {
      'fill-color': {
        property: 'id',
        stops: [
          [5, '#3288bd'],
          [10, '#66c2a5'],
          [15, '#abdda4'],
          [20, '#e6f598'],
          [25, '#ffffbf'],
          [30, '#fee08b'],
          [35, '#fdae61'],
          [40, '#f46d43'],
          [45, '#d53e4f']
        ]
      },
      'fill-opacity': [
        'match',
        ['get', 'Name'],
        `${district}`, 
        0,
        0.7
      ],
      'fill-outline-color':'white'
    }

  };
}

const buildingStyle = () => {
  return {
    id: "districts-buildings",
    // type: 'fill',
    source:'districts-buildings',
    type:'circle',
    paint: {
      'circle-color': 'red',
      'circle-opacity':  0.7,
      'circle-stroke-color':'white',
      'circle-stroke-width':1,
      'circle-radius':7
    }
  }
}

export default MapContainer;