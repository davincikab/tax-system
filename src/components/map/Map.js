import { useEffect, useRef, useState, useCallback } from 'react';
import Map, { Source, Layer, NavigationControl, Popup, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import Pin from './icon';

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
    buildingInfo:null,
    isUnitOpen:false,
    tax_assessment:null,
    markerPopupInfo:null,
    licenses:null,
    tax_summary:null,
    expired_license:null
  });

  // const { activeDistrict } = props
  const prevProp = usePrevious({ "district" : props.activeDistrict});

  useEffect(() => {
    
    fitToFeatureBounds();

    if(!state.rental_data) {
      readRentalData();
    }

    // console.log(prevProp);
    if(prevProp && prevProp.district !== props.activeDistrict) {
      // console.log("Props changed");
        setState({
          ...state,
          buildingInfo:null,
          popupInfo:null,
          activeDistrict:props.activeDistrict,
        })
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
      mapRef.current.fitBounds(bbox, { padding:100 });
      // // console.log(mapRef.current);
      // mapRef.current.setPaintProperty("districts-data", "fill-opacity", 0.2);

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
    // console.log(evt.features);

    let { features } = evt
    
    if(features[0] && features[0].layer.id === 'districts-data') {
      // console.log("Click Event");
      updateDistrictBuilding(features[0].properties.Name);

      // // 
      // if(state.activeDistrict === features[0].properties.Name) {
        
      // } else {
      //   // console.log("District Info: ", state.activeDistrict);
      //   con
       
      // }     
      // props.selectDistrict(features[0].properties.Name);      
    } 
    
    if(features[0] && features[0].layer.id === 'districts-buildings') {      
      let props = features[0].properties;
      let coords = Object.values(evt.lngLat);

      let info = {...props, latitude:coords[1], longitude:coords[0]}
      
      setState({
        ...state,
        buildingInfo:{...info},
        popupInfo:null,
        cursor:'pointer'
      });

    };

  }

  const updateDistrictBuilding = (district) => {
    // console.log(state);

    let districts = JSON.parse(JSON.stringify(state.rental_data))
      .filter(building => building["District Name"] === district);

    // console.log(state.activeDistricts);
    // console.log("Updating District:", district);

    setState({
      ...state,
      activeDistrict:district,
      district_buildings:districts
    });

  }

  const getBuildingGeoJSON = (entries) => {
    if(!entries) return turf.featureCollection([]);

    let items = entries.filter(item => item.Location).map(item => {
      let coords = item.Location.split(",").map(v => parseFloat(v)).reverse();

    
      let feature = turf.point([...coords], { ...item, coords } )
      return feature;
    });

    // // console.log(items);
    return turf.featureCollection([...items]);
  }


  let { district_buildings, activeDistrict, cursor, popupInfo, buildingInfo, expired_license, markerPopupInfo } = state;
  let building_json = getBuildingGeoJSON(district_buildings);


  let districtStyle = dataLayer(activeDistrict || props.activeDistrict);
  let layerIds = district_buildings ? ["districts-buildings", "districts-data"] : ['districts-data'];

  // expired licenses
  let licensesGeo = getBuildingGeoJSON(expired_license);
  // console.log(expired_license);

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
                <Layer {...buildingStyle()} />
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
                        {popupInfo.licenses.map(license => (
                          <tr key={license['No.']}>
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
            (activeDistrict && licensesGeo) && <Pins data={licensesGeo} setMarkerPopupInfo={setMarkerPopupInfo} color="orange" layer="license"/>
            // <Source type="geojson" data={licensesGeo} id="licenses">
            //     <Layer {...licenseStyle()} />
            // </Source>
          }

          {
            (activeDistrict && taxGeo) && <Pins data={taxGeo} setMarkerPopupInfo={setMarkerPopupInfo} color="blue" layer="tax"/>
            // <Source type="geojson" data={taxGeo} id="tax-assessment">
            //     <Layer {...taxStyle()} />
            // </Source>
          }

          {
            markerPopupInfo && <MarkerPopup info={markerPopupInfo} setMarkerPopupInfo={setMarkerPopupInfo}/>
          }


          <NavigationControl position='bottom-right'/>
          {buildingInfo && <UnitDetailSection info={district_buildings} buildingInfo={buildingInfo} /> }
        </Map>
    </>
    )
}

const Pins  = ({data, setMarkerPopupInfo, color, layer}) => {
  // console.log(data);

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
  
  const renderContent = (info) => {
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
            <tr>
              <th>Unit Number</th>
              <th>Type</th>
              <th>Monthly Rental</th>
              <th>District</th>
            </tr>


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


// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = (district) => {
  // // console.log(district);

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