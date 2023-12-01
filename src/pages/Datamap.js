import React, { useState, useEffect } from "react";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, get } from "ol/proj";
import {
  Layers,
  TileLayer,
  VectorLayer,
} from "../components/OpenLayers/Layers";
import { osm, vector } from "../components/OpenLayers/Source";
import GeoJSON from "ol/format/GeoJSON";
import FeatureStyles from "../components/OpenLayers/Features/Styles";
import Map from "../components/OpenLayers/Map/Map";
import { Controls, FullScreenControl } from "../components/OpenLayers/Controls";
import mapConfig from "../components/OpenLayers/config.json";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;
const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];

function addMarkers(lonLatArray) {
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: mapConfig.markerImage32,
    }),
  });
  let features = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle);
    return feature;
  });
  return features;
}

export default function Datamap() {

  console.log(process.env['REACT_APP_TEST'])

  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(9);

  const [showOil, setShowOil] = useState(true);
  const [showGas, setShowGas] = useState(true);
  const [showTm, setShowTm] = useState(true);
  const [showDry, setShowDry] = useState(true);
  const [showNt, setShowNt] = useState(true);
  const [showWsw, setShowWsw] = useState(true);
  const [showSwd, setShowSwd] = useState(true);
  const [show2d, setShow2d] = useState(true);
  const [show2dnc, setShow2dnc] = useState(true);
  const [show2rin, setShow2rin] = useState(true);

  const [showMarker, setShowMarker] = useState(false);

  const [features, setFeatures] = useState(addMarkers(markersLonLat));

  const [wellData, setWellData] = useState([]);
  const [wellsLoaded, setWellsLoaded] = useState(false);

  const getWellData = async () => {
    const res = await axios.get("https://ou-wells-database.com/");
    console.log(res.data.features[0]);
    setWellData(res.data.features);
    setWellsLoaded(true);
  };

  useEffect(() => {
    if (!wellsLoaded) {
      getWellData();
    }
  }, [wellsLoaded]);

  return (
    <>
      <div>
        {wellsLoaded && (
          <>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              //options={wellData}
              sx={{ width: "100vh" }}
              renderInput={(params) => <TextField {...params} label="Wells" />}
            />
            <hr />

            <table>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={showOil}
                    onChange={(event) => setShowOil(event.target.checked)}
                  />{" "}
                  OIL
                </th>
                <th>
                  <input
                    type="checkbox"
                    checked={showGas}
                    onChange={(event) => setShowGas(event.target.checked)}
                  />{" "}
                  GAS
                </th>
                <th>
                  <input
                    type="checkbox"
                    checked={showTm}
                    onChange={(event) => setShowTm(event.target.checked)}
                  />{" "}
                  TM
                </th>
                <th>
                  <input
                    type="checkbox"
                    checked={showDry}
                    onChange={(event) => setShowDry(event.target.checked)}
                  />{" "}
                  DRY
                </th>
                <th>
                  <input
                    type="checkbox"
                    checked={showNt}
                    onChange={(event) => setShowNt(event.target.checked)}
                  />{" "}
                  NT
                </th>
                <th>
                  <input
                    type="checkbox"
                    checked={showWsw}
                    onChange={(event) => setShowWsw(event.target.checked)}
                  />{" "}
                  WSW
                </th>
                <th>
                  <input
                    type="checkbox"
                    checked={showSwd}
                    onChange={(event) => setShowSwd(event.target.checked)}
                  />{" "}
                  SWD
                </th>
                <th>
                  <input
                    type="checkbox"
                    checked={show2d}
                    onChange={(event) => setShow2d(event.target.checked)}
                  />{" "}
                  2D
                </th>
                <th>
                  <input
                    type="checkbox"
                    checked={show2dnc}
                    onChange={(event) => setShow2dnc(event.target.checked)}
                  />{" "}
                  2DNC
                </th>
                <th>
                  <input
                    type="checkbox"
                    checked={show2rin}
                    onChange={(event) => setShow2rin(event.target.checked)}
                  />{" "}
                  2RIn
                </th>
              </tr>
            </table>
          </>
        )}
      </div>
      <Map
        center={fromLonLat(center)}
        zoom={zoom}
        style={{ outerHeight: "100%" }}
        
      >
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {/* Make into own component in the future */}
          {showOil && wellsLoaded && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  {
                    crs: {
                      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                      type: "name",
                    },
                    features: wellData.filter(
                      (well) => well.properties.WellType === "GAS"
                    ),
                    name: "OrphanWellsOklahoma",
                    type: "FeatureCollection",
                  },
                  {
                    featureProjection: get("EPSG:3857"),
                    dataProjection: get("EPSG:4326"),
                  }
                ),
              })}
              style={FeatureStyles.Point}
            />
          )}
          {showGas && wellsLoaded && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  {
                    crs: {
                      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                      type: "name",
                    },
                    features: wellData.filter(
                      (well) => well.properties.WellType === "OIL"
                    ),
                    name: "OrphanWellsOklahoma",
                    type: "FeatureCollection",
                  },
                  {
                    featureProjection: get("EPSG:3857"),
                    dataProjection: get("EPSG:4326"),
                  }
                ),
              })}
              style={FeatureStyles.Point}
            />
          )}
          {showTm && wellsLoaded && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  {
                    crs: {
                      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                      type: "name",
                    },
                    features: wellData.filter(
                      (well) => well.properties.WellType === "TM"
                    ),
                    name: "OrphanWellsOklahoma",
                    type: "FeatureCollection",
                  },
                  {
                    featureProjection: get("EPSG:3857"),
                    dataProjection: get("EPSG:4326"),
                  }
                ),
              })}
              style={FeatureStyles.Point}
            />
          )}
          {showDry && wellsLoaded && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  {
                    crs: {
                      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                      type: "name",
                    },
                    features: wellData.filter(
                      (well) => well.properties.WellType === "DRY"
                    ),
                    name: "OrphanWellsOklahoma",
                    type: "FeatureCollection",
                  },
                  {
                    featureProjection: get("EPSG:3857"),
                    dataProjection: get("EPSG:4326"),
                  }
                ),
              })}
              style={FeatureStyles.Point}
            />
          )}
          {showNt && wellsLoaded && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  {
                    crs: {
                      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                      type: "name",
                    },
                    features: wellData.filter(
                      (well) => well.properties.WellType === "NT"
                    ),
                    name: "OrphanWellsOklahoma",
                    type: "FeatureCollection",
                  },
                  {
                    featureProjection: get("EPSG:3857"),
                    dataProjection: get("EPSG:4326"),
                  }
                ),
              })}
              style={FeatureStyles.Point}
            />
          )}
          {showWsw && wellsLoaded && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  {
                    crs: {
                      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                      type: "name",
                    },
                    features: wellData.filter(
                      (well) => well.properties.WellType === "WSW"
                    ),
                    name: "OrphanWellsOklahoma",
                    type: "FeatureCollection",
                  },
                  {
                    featureProjection: get("EPSG:3857"),
                    dataProjection: get("EPSG:4326"),
                  }
                ),
              })}
              style={FeatureStyles.Point}
            />
          )}
          {showSwd && wellsLoaded && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  {
                    crs: {
                      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                      type: "name",
                    },
                    features: wellData.filter(
                      (well) => well.properties.WellType === "SWD"
                    ),
                    name: "OrphanWellsOklahoma",
                    type: "FeatureCollection",
                  },
                  {
                    featureProjection: get("EPSG:3857"),
                    dataProjection: get("EPSG:4326"),
                  }
                ),
              })}
              style={FeatureStyles.Point}
            />
          )}
          {show2d && wellsLoaded && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  {
                    crs: {
                      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                      type: "name",
                    },
                    features: wellData.filter(
                      (well) => well.properties.WellType === "2D"
                    ),
                    name: "OrphanWellsOklahoma",
                    type: "FeatureCollection",
                  },
                  {
                    featureProjection: get("EPSG:3857"),
                    dataProjection: get("EPSG:4326"),
                  }
                ),
              })}
              style={FeatureStyles.Point}
            />
          )}
          {show2dnc && wellsLoaded && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  {
                    crs: {
                      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                      type: "name",
                    },
                    features: wellData.filter(
                      (well) => well.properties.WellType === "2DNC"
                    ),
                    name: "OrphanWellsOklahoma",
                    type: "FeatureCollection",
                  },
                  {
                    featureProjection: get("EPSG:3857"),
                    dataProjection: get("EPSG:4326"),
                  }
                ),
              })}
              style={FeatureStyles.Point}
            />
          )}
          {show2rin && wellsLoaded && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(
                  {
                    crs: {
                      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
                      type: "name",
                    },
                    features: wellData.filter(
                      (well) => well.properties.WellType === "2RIn"
                    ),
                    name: "OrphanWellsOklahoma",
                    type: "FeatureCollection",
                  },
                  {
                    featureProjection: get("EPSG:3857"),
                    dataProjection: get("EPSG:4326"),
                  }
                ),
              })}
              style={FeatureStyles.Point}
            />
          )}
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>
    </>
  );
}

{
  /* <>
    <iframe src="https://main.d2i0l6ukx93ko2.amplifyapp.com/" style={{ top:0, left:0, bottom:0, right:0, width:'100%', height:'100%', border:'none', margin:0, padding:0, overflow:'hidden', zIndex:999999,}}/>
    </> */
}
