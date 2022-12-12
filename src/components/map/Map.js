import Map, {Source, Layer, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import geoData from '../../assets/data/districts.json';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';

const MapContainer = (props) => {

    return (
    <>
        <Map
            initialViewState={{
                longitude: 103.147645,
                latitude: 5.311248,
                zoom: 10
            }}
            mapStyle="mapbox://styles/mapbox/dark-v9"
            mapboxAccessToken={MAPBOX_TOKEN}
            interactiveLayerIds={['data']}
            id="map-container"
            // onMouseMove={onHover}
        >
            <Source type="geojson" data={geoData}>
                <Layer {...dataLayer} />
            </Source>

            <NavigationControl position='bottom-right'/>
        </Map>
    </>
    )
}


// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = {
  id: 'data',
  type: 'fill',
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
    'fill-opacity': 0.7,
    'fill-outline-color':'white'
  }
};

export default MapContainer;