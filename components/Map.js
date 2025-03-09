'use client';
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from 'leaflet';
import { useRouter } from 'next/navigation';

const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

const Map = ({ gardens, position, zoom }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fixLeafletIcons();
      setIsMounted(true);
    }
  }, []);

  const polygonStyle = {
    color: '#2e7d32',
    weight: 2,
    fillColor: '#4CAF50',
    fillOpacity: 0.3,
    dashArray: '3',
  };

  const onEachFeature = (feature, layer, garden) => {
    if (!garden) return;

    const tooltipContent = `
      <div class="map-tooltip">
        <h3>${garden.gardenname || 'Unknown Garden'}</h3>
        <p><strong>Address:</strong> ${garden.address || 'N/A'}</p>
        <p><strong>Status:</strong> ${garden.status || 'N/A'}</p>
        <p><strong>Borough:</strong> ${garden.borough || 'N/A'}</p>
        <div class="tooltip-link">Click to view details →</div>
      </div>
    `;

    layer.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'top',
      className: 'custom-tooltip'
    });

    layer.on({
      click: () => router.push(`/gardens/${garden.id}`),
      mouseover: (e) => e.target.setStyle({ fillOpacity: 0.5 }),
      mouseout: (e) => e.target.setStyle({ fillOpacity: 0.3 })
    });
  };

  if (!isMounted) return null;

  return (
    <div style={{ height: "500px", width: "100%", position: 'relative' }}>
      <MapContainer 
        center={position} 
        zoom={zoom} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {gardens?.map((garden) => {
          try {
            const multipolygon = typeof garden.multipolygon === 'string' 
              ? JSON.parse(garden.multipolygon)
              : garden.multipolygon;

            return (
              <GeoJSON
                key={garden.id}
                data={multipolygon}
                style={polygonStyle}
                onEachFeature={(feature, layer) => 
                  onEachFeature(feature, layer, garden)
                }
                eventHandlers={{
                  click: () => router.push(`/gardens/${garden.id}`)
                }}
              />
            );
          } catch (error) {
            console.error("Error parsing multipolygon:", error);
            return null;
          }
        })}
      </MapContainer>
    </div>
  );
};

export default Map;