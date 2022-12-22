import { useEffect, useRef, useState, useCallback } from 'react';
import Map, { Source, Layer, NavigationControl, Popup, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import Pin from './icon';

// import { read, utils } from "xlsx";
import {read, utils} from "xlsx";

import geoData from '../../assets/data/districts.json';
import buildingData from '../../assets/data/buildings.json';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';

const MapContainer = (props) => {
  const mapRef = useRef(null);

  const [state, setState] = useState({
    activeDistrict:null,
    rental_data:null, 
    district_buildings:null,
    cursor:'auto',
    popupInfo:null,
    buildingInfo:null,
    isUnitOpen:false,
    tax_assessment:null,
    markerPopupInfo:null,
    licenses:null,
    tax_summary:null,
    expired_license:null,
    visibility:{
      tax:true,
      lot:true,
      rental:true,
      expired_license:true
    },
    tax_status:{
      Paid:true,
      Unpaid:true
    },
    lot_status:{
      Paid:true,
      Unpaid:true
    }
  });

  // const { activeDistrict } = props
  const prevProp = usePrevious({ 
    "district" : props.activeDistrict,
    "location" : props.location
  });

  useEffect(() => {
    
    fitToFeatureBounds();

    if(!state.rental_data) {
      readRentalData();
    }

    // console.log(prevProp);
    if(
      (prevProp && prevProp.district !== props.activeDistrict) ||
      (prevProp && prevProp.location !== props.location)
    ) {
      console.log("Props changed");
      console.log(props);
        let districtObj = state.activeDistrict === props.activeDistrict ? {} : { activeDistrict:props.activeDistrict };

        setState({
          ...state,
          buildingInfo:null,
          popupInfo:null,
          markerPopupInfo:props.activeEntry ? {...props.activeEntry} : null,
          ...districtObj
        });

        if(prevProp && prevProp.location !== props.location) {
          mapRef.current.flyTo({ center:props.location, zoom:17 });          
        }

        // mapRef.current.flyTo({ center:props.location, zoom:17 });
    }

    
    
  }, [props, state.activeDistrict]);

  // load rental data
  const readRentalData = () => {
    fetch('/assets/data/Rental Data.xlsx')
    .then(res => res.arrayBuffer())
    .then(data => {

      let workbook = read(data);
      let rental_data = utils.sheet_to_json(workbook.Sheets['Rent Place']);

      // // console.log(geoData);
      // // console.log(rental_data);

      geoData.features = geoData.features.map(ft => {
        let entry = rental_data.find(dt => dt['District Name'] === ft.properties.Name);
        ft.properties.summaryInfo = entry ? {...entry} : {'District Name':ft.properties.Name};
        
        return ft;
      });

      fetch("/assets/data/Business License.xlsx")
      .then(res => res.arrayBuffer())
      .then(data => {
        let businessWorkbook = read(data);
        let currentDistrict, currentRevenue = "";

        let licenses = utils.sheet_to_json(businessWorkbook.Sheets['License']).map(lic => {
          if(lic['District Name']) {
            currentDistrict = lic['District Name'];
            currentRevenue = lic['Total Revenue'];

          } else {

            lic['District Name'] = currentDistrict;
            lic['Total Revenue'] = currentRevenue;

          }

          return lic;
        });

        // console.log(licenses);

        // utils.sheet_to_
        setState({
          ...state,
          tax_assessment:utils.sheet_to_json(businessWorkbook.Sheets['Tax Assessment']),
          expired_license:utils.sheet_to_json(businessWorkbook.Sheets["ExpiredLicense Account Details "]),
          tax_summary:utils.sheet_to_json(businessWorkbook.Sheets['Tax']),
          licenses:[...licenses],
          rental_data:JSON.parse(JSON.stringify(rental_data))
        });

      })

      // setState({
      //   ...state,
      //   rental_data:JSON.parse(JSON.stringify(rental_data))
      // });

    });
    
  }

  const toggleUnitSection = () => {
    setState({
      ...state,
      isUnitOpen:true
    })
  }

  // load map data
  const handleMapLoad = (evt) => {
    // console.log("Map load event");
  }

  // fit feature
  const fitToFeatureBounds = () => {
    
    if(state.activeDistrict || props.activeDistrict) {
      let name = state.activeDistrict || props.activeDistrict;

      let feature = geoData.features.filter(ft => ft.properties.Name === name);
      // console.log(feature);

      var bbox = turf.bbox(turf.featureCollection([...feature]));

      // // console.log(bbprops
      console.log("Fit Map Bounds");

      mapRef.current.fitBounds(bbox, { padding:100 });

    }

  }

  // set
  const setPopupInfo = (info) => {
    setState({
      ...state,
      popupInfo:info,
      buildingInfo:info
    });
  }

  const setMarkerPopupInfo = (feature) => {
    setState({
      ...state,
      markerPopupInfo:feature
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
    let {features, lngLat } = evt;
    // console.log(features);

    if(features[0] && features[0].layer.id === "districts-data") {
      if(state.activeDistrict === features[0].properties.Name) {
        return;
      }

      // console.log("Mouse Enter Event");
      // // console.log("Feature");

      let feature = {...features[0]};
      let summaryInfo = JSON.parse(feature.properties.summaryInfo);
      // summaryInfo.Location ? summaryInfo.Location.split(",").reverse() :

      let coords =  [lngLat.lng, lngLat.lat];

      summaryInfo.latitude = coords[1];
      summaryInfo.longitude = coords[0]; 


      summaryInfo.licenses = state.licenses.filter(license => license['District Name'] === features[0].properties.Name);
      summaryInfo.tax_summary = state.tax_summary.find(tax => tax['District Name'] === features[0].properties.Name);

      // console.log(summaryInfo);

      setState({
        ...state,
        popupInfo:{ ...summaryInfo  },
        // activeDistrict:,
        buildingInfo:null,
        cursor:'pointer'
      });

    } else {
      setState({
        ...state,
        cursor:'pointer'
      })
    }

    
  }

  const onMouseLeave = (evt) => {
    setState({
      ...state,
      popupInfo:null,
      cursor:'auto'
    });
    
  }

  // map click event
  const handleMapClick = (evt) => {
    // query districts data
    console.log(evt.features);

    let { features } = evt
    let coords = Object.values(evt.lngLat);
    
    if(features[0] && features[0].layer.id === 'districts-data') {
      // console.log("Click Event");
      updateDistrictBuilding(features[0].properties.Name); 
    } 
    
    if(features[0] && features[0].layer.id === 'districts-buildings') {      
      let props = features[0].properties;

      let info = {...props, latitude:coords[1], longitude:coords[0]}
      
      setState({
        ...state,
        buildingInfo:{...info},
        markerPopupInfo:null,
        popupInfo:null,
        cursor:'pointer'
      });

    };

    if(features[0] && features[0].layer.id === 'lot-data') {
      let info = {...features[0], latitude:coords[1], longitude:coords[0]}

      setState({
        ...state,
        markerPopupInfo:{...info, geometry : { coordinates : [...coords] } }
      });

    }

  }

  const toggleLayer = (name, value) => {
    console.log(`${name} : ${value} `);

    setState({
      ...state,
      visibility:{
        ...state.visibility,
        [name]:value
      }
    });

  }

  const handleStatusChange = ({ name, value, checked }) => {
    console.log(`${name} : ${value}, ${checked}`);

    setState({
      ...state,
      [name]:{
        ...state[name],
        [value]:checked
      }
    });
  }

  const updateDistrictBuilding = (district) => {
    // console.log(state);

    let districtsRentals = JSON.parse(JSON.stringify(state.rental_data))
      .filter(building => building["District Name"] === district);

    // console.log(state.activeDistricts);
    // console.log("Updating District:", district);

    setState({
      ...state,
      activeDistrict:district,
      district_buildings:districtsRentals
    });

  }

  const getBuildingGeoJSON = (entries = null) => {
    if(!entries) return turf.featureCollection([]);

    // filter the data = 
    entries = entries.filter(item => {
      if(
        item['District'] === state.activeDistrict || 
        item['District Name'] === state.activeDistrict
      ) {
        return item;
      }

      return false
    });

    let items = entries.filter(item => item.Location).map(item => {
      let coords = item.Location.split(",").map(v => parseFloat(v)).reverse();

    
      let feature = turf.point([...coords], { ...item, coords } )
      return feature;
    });

    // // console.log(items);
    return turf.featureCollection([...items]);
  }


  let { 
    district_buildings, activeDistrict, cursor, popupInfo, 
    buildingInfo, expired_license, markerPopupInfo, visibility,
    tax_status, lot_status
  } = state;
  let building_json = getBuildingGeoJSON(district_buildings);


  let districtStyle = dataLayer(activeDistrict || props.activeDistrict);
  let layerIds = district_buildings ? ["districts-buildings", "districts-data", "lot-data"] : ['districts-data'];

  // expired licenses
  let licensesGeo = getBuildingGeoJSON(expired_license);

  let buildingLotData = { ...buildingData };
  // buildingLotData.features = buildingLotData.features.filter(item => item.District === activeDistrict);

  // tax assessment
  let taxGeo = getBuildingGeoJSON(state.tax_assessment);
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
              <Layer {...buildingStyle(visibility.rental)} />
            </Source>
          }

          {
            activeDistrict &&
            <Source type="geojson" data={buildingLotData} id="lot-data">
              <Layer {...lotStyle(activeDistrict, visibility.lot, lot_status)} />
            </Source>
          }

            {/* district summary info */}
            { popupInfo && (
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
                    <div className='section-header'>Rental Data</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Total Units</th>
                          <th>Unit Available</th>
                          <th>Total Rent</th>
                        </tr>
                      </thead>

                      <tbody>
                        {/* {popupInfo.licenses.map(license => ( */}
                          <tr>
                            <td>{popupInfo['Total Unit']}</td>
                            <td>{popupInfo['Unit Available']}</td>
                            <td>RM {formatValues(popupInfo['Total Rent'])}</td>
                          </tr>
                        {/* ))} */}
                      </tbody>
                    </table>

                  </div>

                  <div className='popup-body'>
                    <div className='section-header'>Tax Summary Data</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Total Assessment Case</th>
                          <th>Total Overdue Case</th>
                          <th>Current Overdue Amount</th>
                          <th>Accumulated Overdue Amount</th>
                          <th>Current Year Collection</th>
                        </tr>
                      </thead>

                      <tbody>
                        {/* {popupInfo.licenses.map(license => ( */}
                          <tr>
                            <td>{popupInfo.tax_summary['Total Assessment Case']}</td>
                            <td>{popupInfo.tax_summary['Total Overdue Case']}</td>
                            <td>RM {formatValues(popupInfo.tax_summary['Current Overdue Amount'])}</td>
                            <td>RM {formatValues(popupInfo.tax_summary['Accumulated Overdue Amount'])}</td>
                            <td>RM {formatValues(popupInfo.tax_summary['Current Year Collection'])}</td>
                          </tr>
                        {/* ))} */}
                      </tbody>
                    </table>

                  </div>


                  <div className='license-section'>
                    <div className='section-header'>
                      License Section
                    </div>

                    <table>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Issued/Renewed</th>
                          <th>Expired</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>

                      <tbody>
                        {popupInfo.licenses.map((license, i) => (
                          <tr key={`license-${i}`}>
                            <td>{license['License Type']}</td>
                            <td>{license['Total License Issued / Renewed']}</td>
                            <td>{license['Total License Expired']}</td>
                            <td>RM {formatValues(license['License Revenue'])}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                     
                  </div>

                </div>
              </Popup>
            )}

            {/*  building-summary-info */}
            { buildingInfo && (
              <Popup
                anchor="top"
                longitude={Number(buildingInfo.longitude)}
                latitude={Number(buildingInfo.latitude)}
                focusAfterOpen={false}
                closeOnClick={false}

                onClose={() => setPopupInfo(null)}
              >
                <div className='popup-content'>
                  <div className='popup-header'>
                    {buildingInfo['Name']}
                  </div>

                  <div className='popup-body'>
                    <div className='popup-item'>
                      <div className='item-label'>Total Units: </div>
                      <div className='item-value'>{buildingInfo['Total Unit']}</div>
                    </div>

                    <div className='popup-item'>
                      <div className='item-label'>Units Available: </div>
                      <div className='item-value'>{buildingInfo['Unit Available']}</div>
                    </div>

                    <div className='popup-item'>
                      <div className='item-label'>Total Rent: </div>
                      <div className='item-value'>{buildingInfo['Total Rent']}</div>
                    </div>

                    {/* <button className='btn btn-group' onClick={toggleUnitSection}>More Info</button> */}
                  </div>
                </div>

              </Popup>
            )}
          

          {/* render the data relating to the given district */}
          {
            (activeDistrict && licensesGeo) && 
            <Pins 
              data={licensesGeo} 
              visible={visibility.expired_license} 
              setMarkerPopupInfo={setMarkerPopupInfo} 
              color="orange" 
              layer="license"
            />
          }

          { //Paid and unpaid
            (activeDistrict && taxGeo) && 
            <Pins 
              data={taxGeo} 
              visible={visibility.tax} 
              status={tax_status}
              setMarkerPopupInfo={setMarkerPopupInfo} 
              color="blue" 
              layer="tax"
            />
          }

          {
            markerPopupInfo && <MarkerPopup info={markerPopupInfo} setMarkerPopupInfo={setMarkerPopupInfo}/>
          }


          <NavigationControl position='bottom-right'/>
          {buildingInfo && <UnitDetailSection info={district_buildings} buildingInfo={buildingInfo} /> }

          <FilterDataSection toggleLayer={toggleLayer}  handleStatusChange={handleStatusChange}/>
        </Map>
    </>
    )
}

const Pins  = ({data, setMarkerPopupInfo, color, layer, visible, status=null}) => {
  // console.log(status);

  if(!visible) {
    return <></>
  }

  if(status) {
    // let vals = []
    data.features = data.features.filter(entry => {
      if(entry.properties.Status === 'Paid' && status.Paid) {
        // console.log(entry);

        return entry;
      } else if(entry.properties.Status === 'Unpaid' && status.Unpaid) {
        return entry;
      } else {
        return false;
      }

      
    });

  }

  return (
    data.features.map((entry, index) => (
      <Marker
        key={`marker-${index}`}
        longitude={entry.geometry.coordinates[0]}
        latitude={entry.geometry.coordinates[1]}
        anchor="center"
        onClick={e => {
          // If we let the click event propagates to the map, it will immediately close the popup
          // with `closeOnClick: true`
          e.originalEvent.stopPropagation();
          setMarkerPopupInfo(entry);
        }}
      >
        <Pin color={color} />
      </Marker>
    ))
  )

}

const MarkerPopup = ({info, setMarkerPopupInfo}) => {
  let coords = info.geometry.coordinates;

  console.log(info);
  
  const renderContent = (info) => {
    console.log(info);

    let keys = Object.keys(info.properties).filter(key => ['Location', 'coords'].indexOf(key) === -1);

    return (
      <div className=''>
          {keys.map((columnName, i) => (
            <div key={`column-${i}`} className="d-flex popup-item">
              <div className='item-label'>{columnName}</div>
              <div className='item-value'>{info.properties[columnName]}</div>
            </div>
          ))}
      </div>
    )
    
  }

  return (
    <Popup
      anchor="top"
      longitude={Number(coords[0])}
      latitude={Number(coords[1])}
      focusAfterOpen={false}
      closeOnClick={false}
      onClose={() => setMarkerPopupInfo(null)}
    >
      { renderContent(info)}
    </Popup>
  )
}

const UnitDetailSection = (props) => {
  // console.log(props);
  let units = props.info.filter(info => info.Name === props.buildingInfo.Name);
  return (
    <div className='units-section'>
      <div className='header-section'>
        Units within {props.buildingInfo.Name}
      </div>

        <table className='table'>
          <thead>
            <tr>
              <th>Unit Number</th>
              <th>Type</th>
              <th>Monthly Rental</th>
              <th>District</th>
            </tr>
          </thead>

          <tbody>
            {units.map((unit, i) => (
              <tr key={`unit-${i}`}>
                  <td>{unit['Unit Number']}</td>
                  <td>{unit['Type']}</td>
                  <td>{unit['Monthly Rental']}</td>
                  <td>{unit['District Name']}</td>
              </tr>
            ))}
          </tbody>

        </table>
    </div>
  )
}


const FilterDataSection = (props) => {

  const [state, setState ] = useState({
    tax:true,
    lot:true,
    rental:true,
    expired_license:true,
    tax_status:{
      Paid:true,
      Unpaid:true
    },
    lot_status:{
      Paid:true,
      Unpaid:true
    }
  });

  const handleStatusChange = (evt) => {

    let { name, value, checked } = evt.target;
    console.log(`${name} : ${value}, ${checked}`);

    props.handleStatusChange({name, value, checked});

    setState({
      ...state,
      [name]:{
        ...state[name],
        [value]:checked
      }
    });
  }

  const handleChange = (evt) => {
    evt.stopPropagation();

    let {name, checked } = evt.target;
    props.toggleLayer(name, checked);

    setState({
      ...state,
      [name]:checked
    });

  }

  return (
    <div className='layer-toggler-section'>
      <div className="title">
        Map Layers
      </div>

      <div id="layers">
        <div className='layer-toggler'>
          <div className='toggle-section'>
            <div className='form-group'>
              <input 
                type="checkbox" 
                name="lot" 
                id='lot' 
                className='form-check' 
                checked={state.lot}
                onChange={handleChange}
              />

              <label htmlFor='lot' >Lot</label>
            </div>

            <div className='toggle-body'>
              <div className='form-group'>
                <input 
                  type="checkbox" 
                  name="lot_status" 
                  id='lot_paid' 
                  className='form-check' 
                  checked={state.lot_status.Paid}
                  value="Paid"
                  onChange={handleStatusChange}
                />

                <label htmlFor='lot_paid'>Paid</label>
              </div>

              <div className='form-group'>
                <input 
                  type="checkbox" 
                  name="lot_status" 
                  id='lot_unpaid' 
                  className='form-check' 
                  checked={state.lot_status.Unpaid}
                  value="Unpaid"
                  onChange={handleStatusChange}
                />

                <label htmlFor='lot_unpaid'>Unpaid</label>
              </div>
              
            </div>
          </div>
        

          <div className='form-group'>
            <input 
              type="checkbox" 
              name="rental" 
              id='rental' 
              className='form-check' 
              checked={state.rental}
              onChange={handleChange}
            />

            <label htmlFor='rental'>Rental Data</label>
          </div>

          <div className='toggle-section'>

            <div className='form-group'>
              <input 
                type="checkbox" 
                name="tax" 
                id='tax' 
                className='form-check' 
                checked={state.tax} 
                onChange={handleChange}
              />

              <label htmlFor='tax'>Tax Assessment</label>
            </div>

            <div className='toggle-body'>
                <div className='form-group'>
                  <input 
                    type="checkbox" 
                    name="tax_status" 
                    id='tax_paid' 
                    className='form-check' 
                    checked={state.tax_status.Paid}
                    value="Paid"
                    onChange={handleStatusChange}
                  />

                  <label htmlFor='tax_paid'>Paid</label>
                </div>

                <div className='form-group'>
                  <input 
                    type="checkbox" 
                    name="tax_status" 
                    id='tax_unpaid' 
                    className='form-check' 
                    checked={state.tax_status.Unpaid}
                    value="Unpaid"
                    onChange={handleStatusChange}
                  />

                  <label htmlFor='tax_unpaid'>Unpaid</label>
                </div>
                
              </div>
          </div>

          <div className='form-group'>
            <input 
              type="checkbox" 
              name="expired_license" 
              id='expired_license' 
              className='form-check' 
              checked={state.expired_license}
              onChange={handleChange}
            />

            <label htmlFor='expired_license'>Expired License</label>
          </div>

          {/* 1. Paid Tax Assessment
          2. Unpaid Tax Assessment
          3. Rental (On or Off)
          4. Expired License
          5. Paid License 
          6. Lot (Paid)
          7. Lot (Unpaid) */}
        </div>

        <div className='legend-section'>
          <div className='title'>Status</div>

          <div className='section-body'>
              <div className='legend-item'>
                <div className='legend-box' style={{backgroundColor:'#FF6961'}}></div>
                <div>Unpaid</div>
              </div>

              <div className='legend-item'>
                <div className='legend-box' style={{backgroundColor:'#81CCA4'}}></div>
                <div>Paid</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = (district) => {
  // // console.log(district);

  // 30 ~ 60 = red
  // 61 ~ 75 = yellow
  // 76 ~ 100 = green

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
        property: 'Status',
        stops: [
          [30, '#FF6961'],
          [60, '#f9f943'],
          [75, '#81CCA4'],
          // [20, '#e6f598'],
          // [25, '#ffffbf'],
          // [30, '#fee08b'],
          // [35, '#fdae61'],
          // [40, '#f46d43'],
          // [45, '#d53e4f']
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

const lotStyle = (district, isVisible, status) => {
  let visibility = isVisible ? 'visible' : 'none';
  // console.log("Visibility: ", isVisible);

  let opacity = 0.9;
  if(status.Paid && status.Unpaid) {
    opacity = 0.9;
  } else if (status.Paid) {
    opacity = [
      'match',
      ['get', 'Status'],
      'Paid',
      0.9,
      0
    ];

  } else if (status.Unpaid) {
    opacity = [
      'match',
      ['get', 'Status'],
      'Unpaid',
      0.9,
      0
    ];

  } else {
    opacity = 0;
  }

  return {
    id: "lot-data",
    type: 'fill',
    source:'lot-data',
    filter:[
      'match',
      ['get', 'District'],
      `${district}`, 
      true,
      false
    ],
    paint: {
      'fill-opacity':opacity,
      'fill-color': [
          'match',
          ['get', 'Status'],
          'Paid',
          '#81CCA4',
          'Unpaid',
          '#ff6961',
          '#F88D51',
        ]
    },
    layout:{
      'visibility':`${visibility}`
    }
  }
}

const buildingStyle = (isVisible) => {
  let visibility = isVisible ? 'visible' : 'none';

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
    },
    layout:{
      'visibility':`${visibility}`
    }

  }
}

const licenseStyle = () => {
  return {
    id: "licenses",
    // type: 'fill',
    source:'licenses',
    type:'circle',
    paint: {
      'circle-color': 'blue',
      'circle-opacity':  0.7,
      'circle-stroke-color':'white',
      'circle-stroke-width':0.5,
      'circle-radius':5
    }
  }
}

const taxStyle = () => {
  return {
    id: "tax",
    // type: 'fill',
    source:'tax-assessment',
    type:'circle',
    paint: {
      'circle-color': 'orange',
      'circle-opacity':  0.7,
      'circle-stroke-color':'white',
      'circle-stroke-width':0.5,
      'circle-radius':5
    }
  }
}

function usePrevious(value) {
  // // console.log(value);
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}


function formatValues(value = 0) {
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');  
}

export default MapContainer;