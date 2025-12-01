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
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Head>
        <title>Moneywave Locations</title>
        <meta name="description" content="Find locations in Klang Valley" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col bg-white border-r border-gray-200 z-10 shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Find Locations</h1>
          <p className="text-sm text-gray-500">Find your nearest Moneywave</p>
        </div>

        <Search onSearch={setSearchQuery} />

        <div className="flex-1 overflow-y-auto">
          {filteredLocations.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {filteredLocations.map((location) => (
                <li
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`p-4 cursor-pointer hover:bg-[#F8BC06]/10 transition-colors duration-150 ${selectedLocation?.id === location.id ? 'bg-[#F8BC06]/10 border-l-4 border-[#F8BC06]' : ''
                    }`}
                >
                  <h3 className="font-semibold text-gray-800">{location.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">{location.address}</p>

                  <div className="flex items-center mt-1 text-sm text-green-600 font-medium">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {location.openingHours && (location.openingHours.includes('-')
                      ? `Open until ${location.openingHours.split(' - ')[1]}`
                      : location.openingHours)}
                  </div>

                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-black bg-[#F8BC06] rounded-full">
                    {location.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No locations found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="hidden md:block md:w-2/3 lg:w-3/4 relative">
        <Map locations={filteredLocations} center={mapCenter} zoom={mapZoom} />
      </div>
    </div>
  );
}
