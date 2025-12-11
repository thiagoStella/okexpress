import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Mock icons or use real URLs
const DRIVER_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png'; // Generic delivery icon
const CUSTOMER_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/684/684908.png'; // Generic location icon
const STORE_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/869/869636.png'; // Generic store icon

const TrackingModal = ({ isOpen, onClose, driver, tenantStoreLocation }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [route, setRoute] = useState(null);

    // Determine Scenario: "Ida" (Delivery) vs "Volta" (Return)
    const isDelivery = !!driver?.active_order_id;

    // Destination depends on scenario
    const destination = isDelivery
        ? driver.active_order_destination
        : tenantStoreLocation; // { lat, long } from tenant context

    useEffect(() => {
        if (!isOpen || !mapContainer.current || !driver) return;

        if (!map.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: {
                    version: 8,
                    sources: {
                        'osm-tiles': {
                            type: 'raster',
                            tiles: [
                                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            ],
                            tileSize: 256,
                            attribution: '&copy; OpenStreetMap Contributors',
                        },
                    },
                    layers: [
                        {
                            id: 'osm-tiles',
                            type: 'raster',
                            source: 'osm-tiles',
                        },
                    ],
                },
                center: [driver.current_long, driver.current_lat],
                zoom: 14,
            });

            map.current.on('load', () => {
                // Add markers logic here or in a separate effect
                addMarkers();
            });
        } else {
            // Update map center/markers if driver moves
            // For simple testing, we might just want to re-render markers if driver changes significantly
            // But map instance persistence is tricky with strict mode. 
            // For now, let's just rely on initial load or simple updates.
            if (map.current.getSource('driver-point')) {
                map.current.getSource('driver-point').setData({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [driver.current_long, driver.current_lat] }
                });
            }
        }

        // Cleanup
        return () => {
            // Optional: map.current.remove(); 
        };
    }, [isOpen, driver]);

    const addMarkers = () => {
        if (!map.current) return;

        // 1. Driver Marker
        const driverEl = createIconElement(DRIVER_ICON_URL);
        new maplibregl.Marker({ element: driverEl })
            .setLngLat([driver.current_long, driver.current_lat])
            .addTo(map.current);

        // 2. Destination Marker (Customer or Store)
        if (destination) {
            const iconUrl = isDelivery ? CUSTOMER_ICON_URL : STORE_ICON_URL;
            const destEl = createIconElement(iconUrl);
            new maplibregl.Marker({ element: destEl })
                .setLngLat([destination.long, destination.lat])
                .addTo(map.current);

            // Draw Route (Mock function)
            drawRoute([driver.current_long, driver.current_lat], [destination.long, destination.lat]);
        }
    };

    const drawRoute = async (start, end) => {
        try {
            // Fetch route from OSRM (Open Source Routing Machine)
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (!data.routes || data.routes.length === 0) return;

            const routeGeoJSON = data.routes[0].geometry;

            const geojson = {
                type: 'Feature',
                properties: {},
                geometry: routeGeoJSON
            };

            if (map.current.getSource('route')) {
                map.current.getSource('route').setData(geojson);
            } else {
                map.current.addSource('route', {
                    type: 'geojson',
                    data: geojson
                });
                map.current.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': isDelivery ? '#3b82f6' : '#ef4444', // Blue for Delivery, Red for Return
                        'line-width': 4
                    }
                });
            }

            // Fit bounds to show the entire route
            const bounds = new maplibregl.LngLatBounds();
            routeGeoJSON.coordinates.forEach(coord => {
                bounds.extend(coord);
            });
            map.current.fitBounds(bounds, {
                padding: 50
            });
        } catch (error) {
            console.error("Error fetching route:", error);
            // Fallback to straight line if API fails
            const fallbackGeojson = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: [start, end]
                }
            };
            if (map.current.getSource('route')) {
                map.current.getSource('route').setData(fallbackGeojson);
            }
        }
    };

    const createIconElement = (url) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${url})`;
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.backgroundSize = '100%';
        return el;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-3xl h-[500px] relative flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">
                        {isDelivery ? `Entrega #${driver.active_order_id}` : 'Retornando à Base'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="flex-1 relative" ref={mapContainer}>
                    {/* Map renders here */}
                </div>
                <div className="p-4 bg-gray-50 text-sm">
                    <p><strong>Status:</strong> {isDelivery ? 'Em Rota de Entrega' : 'Disponível / Retornando'}</p>
                    <p><strong>Última atualização:</strong> {new Date(driver.last_update).toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;
