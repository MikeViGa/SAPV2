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
    IconButton,
    Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { obtenerJardinesApi } from "../../api/JardinApiService";
import { obtenerUbicacionesPorJardinApi } from "../../api/UbicacionApiService";
import { redAsteriskStyle } from "../../base/common/CommonControls";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Item, ScreenWrapper, ExitButton, } from '../../base/common/CommonControls';
import { useNavigate } from "react-router-dom";

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
const popupStyle = {
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '15px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    maxWidth: '200px',
};
export default function PantallaUbicaciones() {
    const API_KEY = "A3lgNBwHGIj3JcIZ83S7ajGnrWXO6kcoSv8ZVdrHMVCsGNSDrpG3JQQJ99BDACYeBjFnsbLCAAAgAZMPkLXJ";
    const DEFAULT_CENTER = [-98.833361, 19.375297];
    const DEFAULT_ZOOM = 17.5;
    const INITIAL_BEARING = -12;
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const dsJardinRef = useRef(null);
    const dsUbicRef = useRef(null);
    const popupRef = useRef(null);
    const polygonMapRef = useRef({});
    const containerRef = useRef(null);

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
                bearing: INITIAL_BEARING,
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
                            content: `
                            <div style="text-align: center; ${popupStyle}">
                                <h3 style="margin: 0; color: #0055BB;">ID: ${p.id}</h3>
                                <p style="margin: 5px 0;">${p.description}</p>
                            </div>
                `,
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
                        description: `<b>Sección:</b> ${u.seccion}<br/><b> Coordenada:</b> ${u.coordenada}<br/><b>Solicitud:</b> ${u.id_solicitud}<br/><b>Obs:</b> ${u.observaciones}`,
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
            alert("Ubicación no encontrada");
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
       

        //Popup que se  muestra cuando encuentra la ubicacion
        const p = feat.properties;
        popupRef.current.setOptions({
            content: `<b>ID: </b> ${p.id}<br/>${p.description}`,
            position: center,
        });
        popupRef.current.open(map);
        
    };

    const toggleFullscreen = () => {
        const el = containerRef.current;
        if (!el) return;

        if (!fullscreen) {
            el.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    const salirModulo = () => {
        navigate("/inicio/escritorio");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') searchPolygon();
    };

    const centerMap = () => {
        const map = mapInstanceRef.current;
        if (map) {
            map.setCamera({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, bearing: INITIAL_BEARING, pitch: 0 });
        }
    };
    const handleMapTypeChange = (e) => {
        const type = e.target.value;
        setMapType(type);
        const map = mapInstanceRef.current;
        if (map) {
            map.setStyle({ style: type });
        }
    };

    return (
        <ScreenWrapper >
            <Item>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* Added gap for spacing */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Autocomplete
                            options={jardines}
                            getOptionLabel={j => j.nombre || ''}
                            onChange={(e, val) => setSelectedJardin(val)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Seleccionar jardín"
                                    size="small"
                                    required
                                    InputLabelProps={{ sx: redAsteriskStyle }}
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* Added gap for spacing */}
                        <TextField
                            label="Buscar por id"
                            name="Buscar por id"
                            variant="outlined"
                            size="small"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyPress={handleKeyPress}
                            type="number"
                            InputLabelProps={{ sx: redAsteriskStyle }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={searchPolygon}
                            startIcon={<SearchIcon />}
                        >
                            Buscar
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, maxWidth: '200px' }}>
                        <Button
                            variant="outlined"
                            onClick={centerMap}
                            startIcon={<MyLocationIcon />}
                            fullWidth
                        >
                            Centrar
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, maxWidth: '200px' }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="select-label">Tipo de mapa</InputLabel>
                            <Select
                                value={mapType}
                                onChange={handleMapTypeChange}
                                labelId="select-label"
                            >
                                <MenuItem value="satellite">Satelite</MenuItem>
                                <MenuItem value="road">Camino</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Item>
            <Item>
                <Box
                    ref={containerRef}
                    sx={{
                        position: 'relative',
                        height: '650px',
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0',
                        bgcolor: '#f0f0f0',
                    }}
                >
                    {loading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                zIndex: 10,
                            }}
                        >
                            <CircularProgress />
                            <Typography variant="caption">Cargando mapa...</Typography>
                        </Box>
                    )}
                    <div id="azure-map" ref={mapRef} style={{ width: '100%', height: '100%' }} />
                    <IconButton
                        onClick={toggleFullscreen}
                        sx={{
                            position: 'absolute',
                            bottom: 450,
                            right: 5,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                        }}
                    >
                        <FullscreenIcon />
                    </IconButton>
                </Box>
            </Item>
            <ExitButton onClick={salirModulo} />
        </ScreenWrapper>
    );
}