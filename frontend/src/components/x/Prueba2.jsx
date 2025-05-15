import React, { Component } from 'react';
import { Box, Typography, CircularProgress, Paper, Slider, Button, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const polygonData = [
  {
    id: 1,
    paths: [
      { lat: 19.375100, lng: -98.834333 },
      { lat: 19.375100, lng: -98.834328 },
      { lat: 19.375094, lng: -98.834328 },
      { lat: 19.375094, lng: -98.834333 },
    ],
    fillColor: '#FF0000',
    strokeColor: '#FF0000',
    fillOpacity: 0.5,
    strokeOpacity: 1,
    strokeWeight: 2,
    description: "Fosa 1."
  },
  {
    id: 2,
    paths: [
      { lat: 19.375103, lng: -98.834323 },
      { lat: 19.375103, lng: -98.834319 },
      { lat: 19.375097, lng: -98.834319 },
      { lat: 19.375097, lng: -98.834323 },
    ],
    fillColor: '#FF0000',
    strokeColor: '#FF0000',
    fillOpacity: 0.5,
    strokeOpacity: 1,
    strokeWeight: 2,
    description: "Fosa 2."
  },
  {
    id: 3,
    paths: [
      { lat: 19.375103, lng: -98.834313 },
      { lat: 19.375103, lng: -98.834309 },
      { lat: 19.375097, lng: -98.834309 },
      { lat: 19.375097, lng: -98.834313 },
    ],
    fillColor: '#FF0000',
    strokeColor: '#FF0000',
    fillOpacity: 0.5,
    strokeOpacity: 1,
    strokeWeight: 2,
    description: "Fosa 3."
  },
  {
    id: 4,
    paths: [
      { lat: 19.37509919, lng: -98.83429456 },
      { lat: 19.37510005, lng: -98.83429029 },
      { lat: 19.37509102, lng: -98.83428826 },
      { lat: 19.37509016, lng: -98.83429253 }
    ],
    fillColor: '#FF0000',
    strokeColor: '#FF0000',
    fillOpacity: 0.5,
    strokeOpacity: 1,
    strokeWeight: 2,
    description: 'Fosa 4.'
  },

];

class Prueba2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      loading: true,
      polygons: [],
      polygonMap: {}, // Map polygon objects by ID for quick lookup
      infoWindow: null,
      rotation: 0,
      zoom: 22,
      searchId: '', // Store search input
      highlightedPolygon: null, // Track currently highlighted polygon
      originalColors: {} // Store original colors for reset
    };
  }

  componentDidMount() {
    // Load Google Maps API script manually
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDKTJsLbFkir-lQL9nviPkD4wO50Dtmy20`;
    script.async = true;
    script.defer = true;
    script.onload = this.initMap;
    document.head.appendChild(script);
  }

  initMap = () => {
    const mapDiv = document.getElementById('google-map');
    const map = new window.google.maps.Map(mapDiv, {
      center: { lat: 19.3751, lng: -98.834333 },
      zoom: 18,
      mapTypeId: 'satellite',
      heading: 90,
      tilt: 45,
      gestureHandling: 'greedy',



    });


    // Create a single InfoWindow instance to reuse
    const infoWindow = new window.google.maps.InfoWindow();

    this.setState({ map, infoWindow, loading: false }, () => {
      this.renderPolygons();
    });


  }

  renderPolygons = () => {
    const { map, infoWindow } = this.state;
    const polygonObjects = [];
    const polygonMap = {};
    const originalColors = {};

    // Create polygon objects from JSON data
    polygonData.forEach(data => {
      const polygon = new window.google.maps.Polygon({
        paths: data.paths,
        fillColor: data.fillColor,
        strokeColor: data.strokeColor,
        fillOpacity: data.fillOpacity,
        strokeOpacity: data.strokeOpacity,
        strokeWeight: data.strokeWeight,
        map: map
      });

      // Store original colors
      originalColors[data.id] = {
        fillColor: data.fillColor,
        strokeColor: data.strokeColor
      };

      // Add mouseover event to show tooltip
      polygon.addListener('mouseover', (event) => {
        // Set content for the info window
        infoWindow.setContent(`
          <div style="padding: 8px; max-width: 200px;">
            <strong>ID: ${data.id}</strong><br>
            ${data.description}
          </div>
        `);

        // Position the info window at the mouse position
        infoWindow.setPosition(event.latLng);

        // Open the info window
        infoWindow.open(map);
      });

      // Add mouseout event to close the tooltip
      polygon.addListener('mouseout', () => {
        // Only close if this isn't the highlighted polygon
        if (this.state.highlightedPolygon !== data.id) {
          infoWindow.close();
        }
      });

      // Store polygon with its data for later reference
      polygon.data = data;
      polygonObjects.push(polygon);
      polygonMap[data.id] = polygon;
    });

    this.setState({
      polygons: polygonObjects,
      polygonMap,
      originalColors
    });
  }

  // Handle search input change
  handleSearchChange = (event) => {
    this.setState({ searchId: event.target.value });
  }

  // Search for polygon by ID
  searchPolygon = () => {
    const { searchId, polygonMap, map, infoWindow, highlightedPolygon, originalColors } = this.state;

    // Reset previous highlight if exists
    if (highlightedPolygon && polygonMap[highlightedPolygon]) {
      const prevPolygon = polygonMap[highlightedPolygon];
      const origColors = originalColors[highlightedPolygon];
      prevPolygon.setOptions({
        fillColor: origColors.fillColor,
        strokeColor: origColors.strokeColor
      });
      infoWindow.close();
    }

    // Try to parse the ID as a number
    const id = parseInt(searchId, 10);

    if (isNaN(id)) {
      alert("Please enter a valid numeric ID");
      return;
    }

    // Find the polygon with the given ID
    const polygon = polygonMap[id];

    if (polygon) {
      // Highlight the polygon
      polygon.setOptions({
        fillColor: '#FFFF00', // Yellow
        strokeColor: '#FFFF00'
      });

      // Show the tooltip
      const bounds = new window.google.maps.LatLngBounds();
      polygon.getPath().forEach(path => bounds.extend(path));

      // Center the map on the polygon
      map.panTo(bounds.getCenter());

      // Show info window
      infoWindow.setContent(`
        <div style="padding: 8px; max-width: 200px;">
          <strong>ID: ${polygon.data.id}</strong><br>
          ${polygon.data.description}
        </div>
      `);
      infoWindow.setPosition(bounds.getCenter());
      infoWindow.open(map);

      // Update state to track highlighted polygon
      this.setState({ highlightedPolygon: id });
    } else {
      alert(`No polygon found with ID: ${id}`);
      this.setState({ highlightedPolygon: null });
    }
  }

  // Handle Enter key in search field
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.searchPolygon();
    }
  }

  render() {
    const { loading, searchId } = this.state;

    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Google Maps with Polygons
        </Typography>

        {/* Search Box */}
        <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
          <TextField
            label="Search by ID"
            variant="outlined"
            size="small"
            value={searchId}
            onChange={this.handleSearchChange}
            onKeyPress={this.handleKeyPress}
            sx={{ mr: 1, flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={this.searchPolygon}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Box>

        {loading && <CircularProgress />}

        <div
          id="google-map"
          style={{
            width: '100%',
            height: '500px',
            display: loading ? 'none' : 'block'
          }}
        />
      </Paper>
    );
  }
}

export default Prueba2;