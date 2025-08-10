import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet CSS import (redundant if already in index.css, but good for standalone)

// Note: Leaflet's default marker icon is sometimes broken in Webpack setups.
// You might need to manually set it.
import L from 'leaflet';

// Fix for default marker icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = () => {
  const position = [22.8456, 89.5404];
  const initialZoom = 13;

  return (
    <div className="flex flex-col md:flex-row lg:flex-row items-center ">
      <div className="flex flex-col items-center p-8 w-full">
        <div className="relative w-full max-w-4xl h-[500px] rounded-lg shadow-xl overflow-hidden -z-50">
          <MapContainer
            center={position}
            zoom={initialZoom}
            scrollWheelZoom={false}
            className="h-full w-full"
            container
          >
            {/* OpenStreetMap Tile Layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marker with a Popup */}
            <Marker position={position}>
              <Popup>
                <div className="text-center">
                  <h2 className="text-lg font-bold">Ours Location</h2>
                  <p>112, New Town, Khulna Sadar, Khulna, Bangladesh</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="mt-8 text-center ">
          <p className="text-lg"></p>
          <p className="text-md">
            112, New Town, Khulna Sadar, Khulna, Bangladesh
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center p-8 w-full space-y-4">
        <div>
          <img
            src="https://i.ibb.co/Q7mwcDJz/h4-img-01.jpg"
            alt=""
            className="w-60 rounded-t-full shadow-lg"
          />
        </div>

        <div>
          <p>71 Madison Ave, New York, NY 10016,</p>
          <p>T. 123-45-6789, 123-45-7899</p>
          <p>M. reservations@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
