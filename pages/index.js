import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { locations } from '../data/locations';
import Search from '../components/Search';

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">
      Loading Map...
    </div>
  ),
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const mapCenter = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : [3.1390, 101.6869]; // Default center (KL)

  const mapZoom = selectedLocation ? 15 : 11;

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans bg-gray-50">
      <Head>
        <title>Moneywave Locations</title>
        <meta name="description" content="Find locations in Klang Valley" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Map Area - Full Screen Background */}
      <div className="absolute inset-0 z-0">
        <Map locations={filteredLocations} center={mapCenter} zoom={mapZoom} />
      </div>

      {/* Floating Glass Sidebar */}
      <div className="absolute left-4 top-4 bottom-4 w-[90%] md:w-1/3 lg:w-1/4 z-10 flex flex-col">
        <div className="h-full flex flex-col bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Find your nearest <span className="text-[#F8BC06] font-bold text-3xl">Moneywave</span></h1>
          </div>

          <Search onSearch={setSearchQuery} />

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredLocations.length > 0 ? (
              <ul className="divide-y divide-white/20">
                {filteredLocations.map((location) => (
                  <li
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className={`p-4 cursor-pointer hover:bg-white/40 transition-colors duration-150 ${selectedLocation?.id === location.id ? 'bg-white/50 border-l-4 border-[#F8BC06]' : ''
                      }`}
                  >
                    <h3 className="font-semibold text-gray-800">{location.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">{location.address}</p>

                    <div className="flex items-center mt-1 text-sm text-green-700 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {location.openingHours && (location.openingHours.includes('-')
                        ? `Open until ${location.openingHours.split(' - ')[1]}`
                        : location.openingHours)}
                    </div>

                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-black bg-[#F8BC06] rounded-full shadow-sm">
                      {location.type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-600">
                No locations found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
