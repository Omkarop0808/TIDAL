
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mumbai Coordinates
const CENTER_POS: [number, number] = [19.0760, 72.8258];

const ZONE_A_POS: [number, number] = [19.0970, 72.8258]; // Juhu approx
const ZONE_B_POS: [number, number] = [19.1350, 72.8140]; // Versova approx
const ZONE_C_POS: [number, number] = [19.0490, 72.8180]; // Bandra approx
const BASE_POS: [number, number] = [19.0160, 72.8530]; // Base approx

const LiveMap = () => {
  return (
    <div className="lg:col-span-6 glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col relative overflow-hidden min-h-[420px] lg:min-h-full">
      {/* Map Overlay Header */}
      <div className="relative z-10 flex items-center justify-between pb-4">
        <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-outline-variant/30 shadow-md">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-label-md text-on-surface">LIVE DIGITAL TWIN RADAR</span>
        </div>
        <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-outline-variant/30 font-label-md text-on-surface-variant shadow-md">
          <span className="material-symbols-outlined text-[16px] text-primary-fixed">near_me</span>
          <span>Vector Active</span>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={CENTER_POS} 
          zoom={12} 
          style={{ height: '100%', width: '100%', background: '#0d1515' }}
          zoomControl={false}
          attributionControl={false}
        >
          {/* Free OpenStreetMap tiles with a CSS dark mode filter to avoid API key requirements */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="dark-map-tiles"
          />
          
          {/* Zone A */}
          <CircleMarker center={ZONE_A_POS} pathOptions={{ color: '#ffb4ab', fillColor: '#93000a', fillOpacity: 0.5 }} radius={15}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip error-tooltip">
              <div className="p-1">
                <div className="flex items-center gap-1 text-error font-headline-sm mb-1">
                  <span className="material-symbols-outlined text-[16px]">warning</span> Zone A (Juhu)
                </div>
                <div className="text-label-sm">420 kg Debris • 94% Risk</div>
              </div>
            </Tooltip>
          </CircleMarker>

          {/* Zone B */}
          <CircleMarker center={ZONE_B_POS} pathOptions={{ color: '#6ff6ff', fillColor: '#004f53', fillOpacity: 0.5 }} radius={12}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip primary-tooltip">
              <div className="p-1">
                <div className="flex items-center gap-1 text-primary-fixed font-headline-sm mb-1">
                  <span className="material-symbols-outlined text-[16px]">navigation</span> Zone B (Versova)
                </div>
                <div className="text-label-sm">310 kg Debris • 82% Risk</div>
              </div>
            </Tooltip>
          </CircleMarker>

          {/* Zone C */}
          <CircleMarker center={ZONE_C_POS} pathOptions={{ color: '#9bcbff', fillColor: '#003256', fillOpacity: 0.5 }} radius={8}>
            <Tooltip direction="right" offset={[10, 0]} opacity={1} className="custom-tooltip secondary-tooltip">
              <div className="p-1">
                <div className="flex items-center gap-1 text-secondary font-headline-sm mb-1">
                  Zone C (Bandra)
                </div>
                <div className="text-label-sm">190 kg Debris • 61% Risk</div>
              </div>
            </Tooltip>
          </CircleMarker>

          {/* Base */}
          <CircleMarker center={BASE_POS} pathOptions={{ color: '#ffffff', fillColor: '#ffffff', fillOpacity: 1 }} radius={4} />

          {/* Routes */}
          <Polyline positions={[BASE_POS, ZONE_A_POS]} pathOptions={{ color: '#ffb4ab', dashArray: '5, 10', weight: 2 }} />
          <Polyline positions={[BASE_POS, ZONE_B_POS]} pathOptions={{ color: '#6ff6ff', dashArray: '5, 10', weight: 2 }} />
          <Polyline positions={[BASE_POS, ZONE_C_POS]} pathOptions={{ color: '#9bcbff', dashArray: '5, 10', weight: 2 }} />
        </MapContainer>
      </div>

      {/* Map Footer Legend */}
      <div className="relative z-10 flex items-center justify-between bg-surface/80 backdrop-blur-md px-4 py-3 rounded-xl border border-outline-variant/30 mt-auto shadow-md">
        <div className="flex items-center gap-4 text-label-md text-on-surface-variant flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-error"></span>Critical Risk</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary-container"></span>High Flow</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-secondary"></span>Moderate</span>
        </div>
        <span className="font-label-sm text-primary-fixed">ID: MUM-OPS-09</span>
      </div>

      <style>{`
        .leaflet-container {
          background-color: transparent !important;
        }
        .dark-map-tiles {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
        .custom-tooltip {
          background-color: rgba(13, 21, 21, 0.9) !important;
          border-radius: 0.75rem !important;
          backdrop-filter: blur(12px) !important;
          color: #dce4e4 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
        }
        .error-tooltip { border: 1px solid rgba(255, 180, 171, 0.5) !important; }
        .primary-tooltip { border: 1px solid rgba(0, 242, 254, 0.5) !important; }
        .secondary-tooltip { border: 1px solid rgba(155, 203, 255, 0.5) !important; }
        .leaflet-tooltip-top:before { border-top-color: rgba(13, 21, 21, 0.9) !important; }
        .leaflet-tooltip-right:before { border-right-color: rgba(13, 21, 21, 0.9) !important; }
      `}</style>
    </div>
  );
};

export default LiveMap;
