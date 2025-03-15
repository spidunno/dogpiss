import { createSignal } from "solid-js";
import MapGL, { Layer, Source, Viewport } from "solid-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function App() {
  const [viewport, setViewport] = createSignal({
    center: [-122.45, 37.78],
    zoom: 11,
  } as Viewport);


  return (
    <MapGL
      options={{ accessToken: "pk.eyJ1Ijoic3BpZHVubm8iLCJhIjoiY2x3YXZtMGt5MGkyajJwdHhrMTZ4NGx1MSJ9.u2FfwTZYNI2Q4LAni2BSsg" }}
      viewport={viewport()}
      onViewportChange={(evt: Viewport) => setViewport(evt)}
      
    >
      <Source
        source={{
          type: "geojson",
          data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
        }}
      >
        <Layer
          style={{
            type: "circle",
            paint: {
              "circle-radius": 8,
              "circle-color": "red",
            },
          }}
        />
      </Source>
    </MapGL>
  );
}