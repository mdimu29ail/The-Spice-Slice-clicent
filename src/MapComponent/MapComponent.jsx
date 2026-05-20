import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Sparkles,
  ArrowUpRight,
  Navigation2,
  Loader2,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../supabase/supabaseClient';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- ১. ডাইনামিক কালার মার্কার ফাংশন (Performance: Moved outside to prevent recreation) ---
const createCustomIcon = isActive => {
  const bgColor = isActive ? '#1a1a1a' : '#E65100';
  const borderColor = isActive ? '#E65100' : '#ffffff';

  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center" role="presentation">
        ${isActive ? '<div class="absolute w-12 h-12 bg-[#E65100] rounded-full animate-ping opacity-30"></div>' : ''}
        <div class="relative flex items-center justify-center w-9 h-9 rounded-full border-2 shadow-2xl transition-all duration-500 ${isActive ? 'scale-125' : 'scale-100'}" 
             style="background-color: ${bgColor}; border-color: ${borderColor};">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div class="absolute -bottom-1 w-2.5 h-2.5 rotate-45 shadow-lg" style="background-color: ${bgColor};" aria-hidden="true"></div>
      </div>
    `,
    className: 'custom-boutique-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 2 });
    }
  }, [center, zoom, map]);
  return null;
};

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.8103, 90.4125]);
  const [zoom, setZoom] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('boutique_settings')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setLocations(data);
          setActiveLocation(data[0]);
          setMapCenter([data[0].lat, data[0].lng]);
          setZoom(15);
        }
      } catch (err) {
        console.error('Map Fetch Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Performance: useCallback used for event handler
  const handleBranchSelect = useCallback(loc => {
    setActiveLocation(loc);
    setMapCenter([loc.lat, loc.lng]);
    setZoom(16);
  }, []);

  if (loading)
    return (
      <div
        className="h-[600px] flex items-center justify-center bg-[#fcf9f5]"
        role="alert"
        aria-busy="true"
      >
        <Loader2
          className="animate-spin text-[#E65100]"
          size={40}
          aria-hidden="true"
        />
        <span className="sr-only">Loading boutique map...</span>
      </div>
    );

  return (
    <section
      className="py-24 bg-[#fcf9f5] overflow-hidden font-sans selection:bg-orange-100"
      aria-labelledby="map-heading"
    >
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4 bg-orange-100/50 px-4 py-1.5 rounded-full"
          >
            <Sparkles size={14} className="text-[#E65100]" aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E65100]">
              Global Presence
            </span>
          </motion.div>
          <h2
            id="map-heading"
            className="text-5xl lg:text-7xl font-black text-[#1a1a1a] tracking-tighter leading-none italic uppercase"
          >
            The Atelier{' '}
            <span className="text-[#E65100] not-italic">Network.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* --- LEFT: THE MAP --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 relative group"
          >
            <div className="h-[600px] w-full rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white relative z-10">
              <MapContainer
                center={mapCenter}
                zoom={zoom}
                scrollWheelZoom={false}
                className="h-full w-full grayscale-[0.2]"
                aria-label="Interactive map showing boutique locations"
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {locations.map(loc => {
                  const isActive = activeLocation?.id === loc.id;
                  return (
                    <Marker
                      key={loc.id}
                      position={[loc.lat, loc.lng]}
                      icon={createCustomIcon(isActive)}
                      eventHandlers={{ click: () => handleBranchSelect(loc) }}
                    >
                      <Popup>
                        <div className="text-center p-2 font-sans">
                          <p className="font-black uppercase text-[10px] text-[#E65100]">
                            The Spice Slice
                          </p>
                          <p className="text-[9px] font-bold text-gray-500 leading-tight">
                            {loc.address}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                <ChangeView center={mapCenter} zoom={zoom} />
              </MapContainer>
            </div>

            {activeLocation && (
              <div className="absolute -bottom-6 -right-6 bg-[#1a1a1a] text-white p-8 rounded-[2.5rem] shadow-2xl z-20 hidden md:block border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E65100] mb-2">
                  Active Node
                </p>
                <p className="text-lg font-black italic tracking-tighter">
                  {activeLocation.lat.toFixed(4)}° N,{' '}
                  {activeLocation.lng.toFixed(4)}° E
                </p>
              </div>
            )}
          </motion.div>

          {/* --- RIGHT: ATELIER DIRECTORY --- */}
          <div className="lg:col-span-5 space-y-8 lg:pl-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                Atelier Directory
              </h3>
              <span className="px-3 py-1 bg-orange-100 text-[#E65100] rounded-full text-[9px] font-black uppercase">
                {locations.length} Locations
              </span>
            </div>

            <div
              className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar"
              role="list"
              aria-label="List of boutique locations"
            >
              {locations.length > 0 ? (
                locations.map(loc => {
                  const isActive = activeLocation?.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      role="listitem"
                      aria-current={isActive ? 'true' : 'false'}
                      onClick={() => handleBranchSelect(loc)}
                      className={`w-full text-left relative p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex items-start gap-5 group overflow-hidden
                         ${isActive ? 'border-[#E65100] bg-[#1a1a1a] shadow-2xl scale-[1.02]' : 'border-transparent bg-white hover:border-black/5 shadow-sm'}
                       `}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500
                         ${isActive ? 'bg-[#E65100] text-white rotate-[360deg]' : 'bg-[#fcf9f5] text-gray-300 group-hover:text-[#E65100]'}
                       `}
                        aria-hidden="true"
                      >
                        {isActive ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Navigation2 size={20} />
                        )}
                      </div>
                      <div className="flex-1 relative z-10">
                        <h4
                          className={`text-sm font-black uppercase tracking-tight mb-1 transition-colors ${isActive ? 'text-white' : 'text-[#1a1a1a] group-hover:text-[#E65100]'}`}
                        >
                          {loc.address.split(',')[0]}
                        </h4>
                        <p className="text-[10px] font-medium text-gray-400 leading-relaxed line-clamp-2 italic">
                          {loc.address}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div
                  className="bg-white p-10 rounded-[3rem] border border-black/5 text-center"
                  role="status"
                >
                  <Info
                    className="mx-auto text-gray-300 mb-4"
                    size={32}
                    aria-hidden="true"
                  />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    No Ateliers Established
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="w-full py-5 bg-[#1a1a1a] text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-[#E65100] transition-all flex items-center justify-center gap-3"
              aria-label="Request a private tour of our boutique"
            >
              Request Private Tour <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapComponent;
