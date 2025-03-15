import { createSignal } from "solid-js";
import MapGL, { Layer, Source, Viewport } from "solid-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import mbxClient from "@mapbox/mapbox-sdk";
import mbxDatasets from "@mapbox/mapbox-sdk/services/datasets";

const datasetId = "cm8aecomp0iat1pph34esnelo";

const accessToken = `pk.eyJ1Ijoic3BpZHVubm8iLCJhIjoiY2x3ZHlmdmd4MTl6ODJqcnM1a3AwNG9zZiJ9.vqd5rqsIKuDzdBUnWqPU1g`;
const notImportant = `sk.eyJ1Ijoic3BpZHVubm8iLCJhIjoiY204YWVoaXo5MWFtODJqb21xMm5pMnN1NiJ9.yqR1ftjPhaeMQUood-xBKg`;

const mapboxClient = mbxClient({ accessToken: notImportant });
const datasetsService = mbxDatasets(mapboxClient);

type Position = [number, number];

async function addPoint(coordinates: Position) {
	return await datasetsService
		.putFeature({
			datasetId,
			feature: {
				geometry: {
					coordinates,
					type: "Point",
				},
				type: "Feature",
				properties: {},
			},
			featureId: `${coordinates[0]}_${coordinates[1]}`,
		})
		.send();
}

// type DatasetObject = {
//   "geometry": {
//     "coordinates": [
//       number,
//       number
//     ],
//     "type": "Point"
//   },
//   "type": "Feature"
// }

export default function App() {
	const [viewport, setViewport] = createSignal({
		center: [-122.45, 37.78],
		zoom: 11,
	} as Viewport);

	return (
		<div style={{ margin: "0", padding: "0", display: "flex", "flex-direction": "row" }}>
			<MapGL
				options={{ accessToken: accessToken }}
				viewport={viewport()}
				onViewportChange={(evt: Viewport) => setViewport(evt)}
			></MapGL>
      <button>Add point</button>
		</div>
	);
}
