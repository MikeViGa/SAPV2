import React, { useEffect, useRef, useState } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";
import {
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { obtenerJardinesApi } from "../api/JardinApiService";
import { obtenerUbicacionesPorJardinApi } from "../api/UbicacionApiService";
import { redAsteriskStyle } from "../base/common/CommonControls";

function parsePoligonoString(str) {
  try {
    const arr = JSON.parse(str);
    if (
      Array.isArray(arr) &&
      arr.length > 0 &&
      Array.isArray(arr[0]) &&
      typeof arr[0][0] === "number"
    ) {
      return arr;
    }
    return [];
  } catch {
    return [];
  }
}

export default function Prueba1() {
  const API_KEY =
    "A3lgNBwHGIj3JcIZ83S7ajGnrWXO6kcoSv8ZVdrHMVCsGNSDrpG3JQQJ99BDACYeBjFnsbLCAAAgAZMPkLXJ";
  const DEFAULT_CENTER = [-98.833361, 19.375297];
  const DEFAULT_ZOOM = 17.5;
  const INITIAL_BEAR = -12;

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const dsJardinRef = useRef(null);
  const dsUbicRef = useRef(null);
  const popupRef = useRef(null);
  const polygonMapRef = useRef({});

  const [loading, setLoading] = useState(true);
  const [jardines, setJardines] = useState([]);
  const [selectedJardin, setSelectedJardin] = useState(null);
  const [poligonoJardin, setPoligonoJardin] = useState("");
  const [poligonosUbicaciones, setPoligonosUbicaciones] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [mapType, setMapType] = useState("satellite");
  const [fullscreen, setFullscreen] = useState(false);
  const [popupReady, setPopupReady] = useState(false); 

  useEffect(() => {
    obtenerJardinesApi()
      .then((res) => setJardines(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setPopupReady(false); // always reset when (re)creating the map!
    const script = document.createElement("script");
    script.src =
      "https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js";
    script.async = true;
    document.head.appendChild(script);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css";
    document.head.appendChild(link);

    script.onload = () => {
      const map = new atlas.Map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        bearing: INITIAL_BEAR,
        style: mapType,
        authOptions: {
          authType: "subscriptionKey",
          subscriptionKey: API_KEY,
        },
      });
      mapInstanceRef.current = map;

      map.events.add("ready", () => {
        const dsJ = new atlas.source.DataSource();
        const dsU = new atlas.source.DataSource();
        map.sources.add([dsJ, dsU]);
        dsJardinRef.current = dsJ;
        dsUbicRef.current = dsU;

        const popup = new atlas.Popup({
          closeButton: false,
          pixelOffset: [0, -10],
        });
        popupRef.current = popup;
        setPopupReady(true);

        // Layer for UBICACIONES
        const layerUbic = new atlas.layer.PolygonLayer(dsU, null, {
          fillColor: ["get", "fillColor"],
          fillOpacity: ["get", "fillOpacity"],
          strokeColor: ["get", "strokeColor"],
          strokeWidth: ["get", "strokeWeight"],
          strokeOpacity: ["get", "strokeOpacity"],
        });
        map.layers.add(layerUbic);

        map.events.add("mouseover", layerUbic, (e) => {
          if (e.shapes?.length) {
            const p = e.shapes[0].data.properties;
            popup.setOptions({
              content: `<b>ID ${p.id}</b><br/>${p.description}`,
              position: e.position,
            });
            popup.open(map);
          }
        });
        map.events.add("mouseout", layerUbic, () => popup.close());

        const layerJard = new atlas.layer.PolygonLayer(dsJ, null, {
          fillColor: "rgba(100,200,255,0.4)",
          strokeColor: "#0055BB",
          strokeWidth: 2,
        });
        map.layers.add(layerJard);

        map.controls.add(
          [
            new atlas.control.ZoomControl(),
            new atlas.control.CompassControl(),
            new atlas.control.PitchControl(),
          ],
          { position: "top-right" }
        );
        setLoading(false);
      });
    };

    return () => {
      mapInstanceRef.current?.dispose();
      popupRef.current = null;
      setPopupReady(false);
    };
  }, [mapType]);

  useEffect(() => {
    const dsJ = dsJardinRef.current;
    const dsU = dsUbicRef.current;
    if (dsJ) dsJ.clear();
    if (dsU) dsU.clear();
    polygonMapRef.current = {};

    if (!selectedJardin) {
      setPoligonoJardin("");
      setPoligonosUbicaciones([]);
      return;
    }

    setPoligonoJardin(selectedJardin.poligono || "");

    obtenerUbicacionesPorJardinApi(selectedJardin.id)
      .then((res) => {
        const arr = res.data.map((u) => {
          const coordsArr = parsePoligonoString(u.poligono);
          return {
            id: u.id,
            description: `Sección: ${u.seccion}, Coordenada: ${u.coordenada}<br/>Obs: ${u.observaciones}`,
            paths: coordsArr,
            fillColor: (u.id_solicitud && u.id_solicitud !== "0" ? "#FF0000" : "#00FF00"),
            fillOpacity: 0.7,
            strokeOpacity: 1,
            strokeColor: (u.id_solicitud && u.id_solicitud !== "0" ? "#FF0000" : "#00FF00"),
            strokeWeight: 3,
          };
        });
        setPoligonosUbicaciones(arr);
      })
      .catch(console.error);
  }, [selectedJardin]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const dsJ = dsJardinRef.current;
    const dsU = dsUbicRef.current;
    if (!map || !dsJ || !dsU) return;

    dsJ.clear();
    dsU.clear();
    polygonMapRef.current = {};

    // Jardín
    if (poligonoJardin) {
      let coordsArr = [];
      try {
        coordsArr = JSON.parse(poligonoJardin);
      } catch (e) {
        console.error("Invalid JSON in poligonoJardin:", e);
      }
      if (Array.isArray(coordsArr)) {
        const ring = coordsArr.map(([lat, lon]) => [lon, lat]);
        dsJ.add(new atlas.data.Feature(new atlas.data.Polygon([ring])));
      }
    }
    // Ubicaciones
    poligonosUbicaciones.forEach((item) => {
      const ring = item.paths.map(([lat, lon]) => [lon, lat]);
      const feat = new atlas.data.Feature(new atlas.data.Polygon([ring]), {
        id: item.id,
        description: item.description,
        fillColor: item.fillColor,
        fillOpacity: item.fillOpacity,
        strokeColor: item.strokeColor,
        strokeWeight: item.strokeWeight,
      });
      dsU.add(feat);
      polygonMapRef.current[item.id] = feat;
    });
  }, [poligonoJardin, poligonosUbicaciones]);

  const searchPolygon = () => {
    const feat = polygonMapRef.current[searchId];
    if (!feat) {
      alert("Polygon not found");
      return;
    }
    const coords = feat.geometry.coordinates[0];
    const sum = coords.reduce(
      (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
      [0, 0]
    );
    const center = sum.map((c) => c / coords.length);
    const map = mapInstanceRef.current;
    if (!map) {
      alert("Mapa no está listo aún (sin mapa)");
      return;
    }
    if (!popupRef.current) {
      alert("Mapa no está listo aún (sin popup)");
      return;
    }

    map.setCamera({ center, zoom: DEFAULT_ZOOM + 1 });

    const p = feat.properties;
    popupRef.current.setOptions({
      content: `<b>ID ${p.id}</b><br/>${p.description}`,
      position: center,
    });
    popupRef.current.open(map);
  };

  return (
    <Box p={2}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Autocomplete
            options={jardines}
            getOptionLabel={(j) => j.nombre || ""}
            onChange={(e, v) => setSelectedJardin(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Jardín"
                size="small"
                required
                InputLabelProps={{ sx: redAsteriskStyle }}
              />
            )}
          />
          <TextField
            label="Buscar por ID"
            size="small"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Button
            startIcon={<SearchIcon />}
            variant="contained"
            onClick={searchPolygon}
            disabled={loading || !popupReady}
          >
            Buscar
          </Button>
          <Button
            startIcon={<MyLocationIcon />}
            variant="outlined"
            onClick={() =>
              mapInstanceRef.current?.setCamera({
                center: DEFAULT_CENTER,
                zoom: DEFAULT_ZOOM,
              })
            }
          >
            Centrar
          </Button>
          <FormControl size="small">
            <InputLabel>Tipo Mapa</InputLabel>
            <Select
              value={mapType}
              label="Tipo Mapa"
              onChange={(e) => setMapType(e.target.value)}
            >
              <MenuItem value="satellite">Satélite</MenuItem>
              <MenuItem value="road">Camino</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>
      <Box ref={mapRef} sx={{ position: "relative", height: 600 }}>
        {loading && (
          <CircularProgress
            size={48}
            sx={{ position: "absolute", top: "50%", left: "50%" }}
          />
        )}
        <IconButton
          sx={{ position: "absolute", bottom: 10, right: 10 }}
          onClick={() => {
            if (!fullscreen) {
              mapRef.current.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
            setFullscreen((f) => !f);
          }}
        >
          <FullscreenIcon />
        </IconButton>
      </Box>
    </Box>
  );
}