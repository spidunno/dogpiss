import { createSignal } from "solid-js";
import MapGL, { Layer, Source, Viewport } from "solid-map-gl";
import { createClient } from '@supabase/supabase-js'
import "mapbox-gl/dist/mapbox-gl.css";

import { Database } from "./supabase";

const accessToken = `pk.eyJ1Ijoic3BpZHVubm8iLCJhIjoiY2x3ZHlmdmd4MTl6ODJqcnM1a3AwNG9zZiJ9.vqd5rqsIKuDzdBUnWqPU1g`;
type Position = [number, number];

const supabaseUrl = 'https://tonunwxiclqnexwgbqxu.supabase.co'
const supabaseKeyDontStealPleaseColonThree = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbnVud3hpY2xxbmV4d2dicXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjIyMjQsImV4cCI6MjA1NzYzODIyNH0.Mig--A27VcVMlkuqpK_1Ak7sTlZAfzAKUjJG5HxO0Ro'
const supabase = createClient<Database>(supabaseUrl, supabaseKeyDontStealPleaseColonThree);

async function addPoint(coordinates: Position) {
	// return await datasetsService
	// 	.putFeature({
	// 		datasetId,
	// 		feature: {
	// 			geometry: {
	// 				coordinates,
	// 				type: "Point",
	// 			},
	// 			type: "Feature",
	// 			properties: {},
	// 		},
	// 		featureId: `${coordinates[0]}_${coordinates[1]}`,
	// 	})
	// 	.send();
	const { error } = await supabase.from("points").insert({
		created_at: new Date().toISOString(),
		// id: `${coordinates[0]}_${coordinates[1]}`,
		location: `POINT(${coordinates[1]} ${coordinates[0]})`
	});
	console.error(error);
	return;
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
	const userLocation = useLocation();

	const [viewport, setViewport] = createSignal({
		center: [-83.00083247943503, 39.96640194605027],
		zoom: 11,
	} as Viewport);

	return (
		<div
			style={{
				margin: "0",
				padding: "0",
				display: "flex",
				"flex-direction": "row",
			}}
		>
			<MapGL
				
				options={{ accessToken: accessToken }}
				viewport={viewport()}
				onViewportChange={(evt: Viewport) => setViewport(evt)}
			>
				{/* {userLocation() !== null ? (
					<Marker
						lngLat={
							new LngLat(
								userLocation()!.coords.longitude,
								userLocation()!.coords.latitude
							)
						}
					/>
				) : null} */}
				<Source
					source={{
						type: "vector",
						url: "http://queerhome.xyz:8232/function_zxy_query",
					}}
				>
					<Layer
						style={{
							type: "heatmap",
							// source: 'points',
							"source-layer": "function_zxy_query",
							// type: "line",
							paint: [
								"interpolate",
								["linear"],
								["heatmap-density"],
								0,
								"rgba(0, 0, 255, 0)",
								0.1,
								"royalblue",
								0.3,
								"cyan",
								0.5,
								"lime",
								0.7,
								"yellow",
								1,
								"red"
							],
						}}
					/>
				</Source>
			</MapGL>
			<button
				onClick={() => {
					if (!userLocation()) return;
					addPoint([
						userLocation()!.coords.latitude,
						userLocation()!.coords.longitude,
					]);
				}}
			>
				Add point
			</button>
			<code>
				{userLocation()?.coords.latitude}
				<br />
				{userLocation()?.coords.longitude}
			</code>
		</div>
	);
}

function useLocation() {
	const [position, setPosition] = createSignal<GeolocationPosition | null>(
		null
	);

	navigator.geolocation.watchPosition(
		(pos) => {
			setPosition(pos);
		},
		console.error,
		{ enableHighAccuracy: true }
	);

	return position;
}
