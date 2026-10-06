import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

// Fix leafet default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2300f2fe" width="24px" height="24px"%3E%3Ccircle cx="12" cy="12" r="8" opacity="0.4" /%3E%3Ccircle cx="12" cy="12" r="4" /%3E%3C/svg%3E',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const IntelligenceMap = () => {
  return (
    <div className="w-full h-full relative z-0 bg-surface">
      <MapContainer 
        center={[18.9750, 72.8258]} 
        zoom={12} 
        style={{ height: '100%', width: '100%', background: '#0d1515' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OSM</a>'
          className="map-tiles"
        />
        {/* Mock debris zones */}
        <Marker position={[18.98, 72.82]} icon={customIcon} />
        <Marker position={[18.96, 72.80]} icon={customIcon} />
        <Marker position={[19.01, 72.83]} icon={customIcon} />
      </MapContainer>
      {/* TopoExport Vector Overlay (Drop your exported SVG into /public/topo-export-mumbai.svg) */}
      <img 
        src="/topo-export-mumbai.svg" 
        alt="Topological Vector Layer" 
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 pointer-events-none z-[500]"
      />

      {/* Dynamic Overlay Gradient for cinematic blending */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none z-[1000]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent pointer-events-none z-[1000]"></div>
    </div>
  );
};
