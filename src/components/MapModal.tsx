import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  MapContainerProps,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapModalProps {
  lat: number;
  lon: number;
  location: string;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ lat, lon, location, onClose }) => {
  const mapProps: MapContainerProps = {
    center: [lat, lon] as [number, number],
    zoom: 13,
    style: { height: "300px", width: "100%" },
    className: "rounded-md",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[90vw] max-w-lg">
        <h2 className="text-lg font-bold mb-2">📍 {location}</h2>
        <MapContainer {...mapProps}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lon]}>
            <Popup>{location}</Popup>
          </Marker>
        </MapContainer>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MapModal;
