// Source: Google Maps Platform Code Assist
import React, { useState, useMemo } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  InfoWindow
} from '@vis.gl/react-google-maps';
import { CORSStation, Project } from '../types';
import { CORS_COORDINATES, UNIQTEK_HQ } from '../data/corsLocations';
import {
  Radio,
  MapPin,
  Wifi,
  WifiOff,
  Layers,
  Search,
  Navigation,
  Crosshair,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface GoogleMapsViewProps {
  stations?: CORSStation[];
  projects?: Project[];
  activeMode?: 'cors' | 'projects';
  onStationSelect?: (station: CORSStation) => void;
  onProjectSelect?: (project: Project) => void;
}

// Calculate Haversine distance in km between two lat/lng points
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  stations = [],
  projects = [],
  activeMode = 'cors',
  onStationSelect,
  onProjectSelect
}) => {
  const [mode, setMode] = useState<'cors' | 'projects'>(activeMode);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [selectedStation, setSelectedStation] = useState<CORSStation | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [infoWindowPos, setInfoWindowPos] = useState<{ lat: number; lng: number } | null>(null);

  // Maps API Key from environment
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  // Enrich CORS stations with coordinates
  const enrichedStations = useMemo(() => {
    return stations.map((st) => {
      const coord = CORS_COORDINATES[st.id] || {
        lat: 17.9757 + (Math.random() - 0.5) * 3,
        lng: 102.6331 + (Math.random() - 0.5) * 3,
        province: 'ສປປ ລາວ',
        satellites: st.status === 'Online' ? 30 : 0
      };
      return {
        ...st,
        lat: coord.lat,
        lng: coord.lng,
        province: coord.province,
        satellites: coord.satellites
      };
    });
  }, [stations]);

  // Filtered CORS Stations
  const filteredStations = useMemo(() => {
    return enrichedStations.filter((st) => {
      const matchesSearch =
        st.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        st.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (st.province && st.province.toLowerCase().includes(searchFilter.toLowerCase()));
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'online' && st.status === 'Online') ||
        (statusFilter === 'offline' && st.status === 'Offline');
      return matchesSearch && matchesStatus;
    });
  }, [enrichedStations, searchFilter, statusFilter]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      return (
        p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.client.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.location.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });
  }, [projects, searchFilter]);

  // Center of Laos (approx Vientiane / Bolikhamxay)
  const defaultCenter = { lat: 18.25, lng: 103.5 };

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
      {/* Top Map Toolbar */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex items-center gap-2">
          {/* Mode Tabs */}
          <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => {
                setMode('cors');
                setSelectedProject(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'cors'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>ເຄືອຂ່າຍ CORS ({filteredStations.length})</span>
            </button>
            <button
              onClick={() => {
                setMode('projects');
                setSelectedStation(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'projects'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>ໂຄງການສຳຫຼວດ ({filteredProjects.length})</span>
            </button>
          </div>

          {/* Map Layer Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mapType === 'roadmap'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ຖະໜົນ
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mapType === 'satellite'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ດາວທຽມ
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mapType === 'terrain'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ພູມປະເທດ
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="ຄົ້ນຫາສະຖານີ / ໂຄງການ..."
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden focus:border-amber-500"
            />
          </div>

          {mode === 'cors' && (
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setStatusFilter(statusFilter === 'online' ? 'all' : 'online')}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                  statusFilter === 'online'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                }`}
              >
                Online
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'offline' ? 'all' : 'offline')}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                  statusFilter === 'offline'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                }`}
              >
                Offline
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Google Map Container with explicit height (CF2) */}
      <div className="w-full h-[520px] relative bg-slate-100 dark:bg-slate-800">
        <APIProvider apiKey={apiKey} language="lo" region="LA">
          <GoogleMap
            mapId="DEMO_MAP_ID"
            defaultCenter={defaultCenter}
            defaultZoom={7}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            className="w-full h-full"
          >
            {/* UniqTek HQ Marker */}
            <AdvancedMarker
              position={{ lat: UNIQTEK_HQ.lat, lng: UNIQTEK_HQ.lng }}
              title={UNIQTEK_HQ.name}
            >
              <div className="bg-amber-600 text-white px-2.5 py-1 rounded-xl shadow-lg border-2 border-white flex items-center gap-1.5 cursor-pointer transform hover:scale-110 transition-transform">
                <Navigation className="w-3.5 h-3.5 text-amber-200" />
                <span className="text-[11px] font-bold">UniqTek HQ (ວຽງຈັນ)</span>
              </div>
            </AdvancedMarker>

            {/* CORS Station Markers */}
            {mode === 'cors' &&
              filteredStations.map((station) => {
                const isOnline = station.status === 'Online';
                const lat = station.lat || defaultCenter.lat;
                const lng = station.lng || defaultCenter.lng;

                return (
                  <AdvancedMarker
                    key={station.id}
                    position={{ lat, lng }}
                    title={`${station.id} - ${station.name}`}
                    onClick={() => {
                      setSelectedStation(station);
                      setInfoWindowPos({ lat, lng });
                      if (onStationSelect) onStationSelect(station);
                    }}
                  >
                    <div
                      className={`p-1.5 rounded-full shadow-lg border-2 border-white cursor-pointer transform hover:scale-125 transition-transform flex items-center justify-center ${
                        isOnline ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5 text-white" />
                    </div>
                  </AdvancedMarker>
                );
              })}

            {/* Project Site Markers */}
            {mode === 'projects' &&
              filteredProjects.map((project) => {
                const lat = project.coordinatesLat;
                const lng = project.coordinatesLng;

                return (
                  <AdvancedMarker
                    key={project.id}
                    position={{ lat, lng }}
                    title={project.title}
                    onClick={() => {
                      setSelectedProject(project);
                      setInfoWindowPos({ lat, lng });
                      if (onProjectSelect) onProjectSelect(project);
                    }}
                  >
                    <div className="bg-sky-600 text-white p-1.5 rounded-xl shadow-lg border-2 border-white cursor-pointer transform hover:scale-125 transition-transform flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-200" />
                      <span className="text-[10px] font-bold px-1">{project.id}</span>
                    </div>
                  </AdvancedMarker>
                );
              })}

            {/* InfoWindow for Selected CORS Station */}
            {selectedStation && infoWindowPos && (
              <InfoWindow
                position={infoWindowPos}
                onCloseClick={() => {
                  setSelectedStation(null);
                  setInfoWindowPos(null);
                }}
              >
                <div className="p-1 max-w-[280px] text-slate-900 space-y-2">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {selectedStation.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        selectedStation.status === 'Online'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedStation.status === 'Online' ? (
                        <Wifi className="w-3 h-3" />
                      ) : (
                        <WifiOff className="w-3 h-3" />
                      )}
                      <span>{selectedStation.status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{selectedStation.name}</h4>
                    <p className="text-xs text-slate-500">
                      ແຂວງ/ທີ່ຕັ້ງ: {selectedStation.province || 'ສປປ ລາວ'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2 rounded-lg">
                    <div>
                      <span className="text-slate-400 block">ຮຸ່ນສະຖານີ:</span>
                      <span className="font-semibold">{selectedStation.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">ດາວທຽມ (Sats):</span>
                      <span className="font-semibold text-emerald-600">
                        {selectedStation.satellites ?? 32} ດວງ (GPS+GLO+BDS)
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block">ໄລຍະຫ່າງຈາກ HQ ວຽງຈັນ:</span>
                      <span className="font-semibold text-amber-700">
                        ~
                        {calculateDistanceKm(
                          UNIQTEK_HQ.lat,
                          UNIQTEK_HQ.lng,
                          selectedStation.lat || defaultCenter.lat,
                          selectedStation.lng || defaultCenter.lng
                        )}{' '}
                        km
                      </span>
                    </div>
                  </div>

                  {selectedStation.issue !== 'none' && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                      <strong>ອາການ/Issue:</strong> {selectedStation.issue}
                    </div>
                  )}

                  {selectedStation.notes && (
                    <div className="text-[10px] text-slate-600 bg-slate-100 p-1.5 rounded">
                      <strong>ແຜນປັບປຸງ:</strong> {selectedStation.notes}
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}

            {/* InfoWindow for Selected Survey Project */}
            {selectedProject && infoWindowPos && (
              <InfoWindow
                position={infoWindowPos}
                onCloseClick={() => {
                  setSelectedProject(null);
                  setInfoWindowPos(null);
                }}
              >
                <div className="p-1 max-w-[280px] text-slate-900 space-y-2">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      {selectedProject.id}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600">
                      ຄວາມຄືບໜ້າ: {selectedProject.progress}%
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {selectedProject.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    ລູກຄ້າ: <strong>{selectedProject.client}</strong>
                  </p>
                  <p className="text-xs text-slate-500">
                    ສະຖານທີ່: {selectedProject.location}
                  </p>

                  <div className="bg-sky-50 p-2 rounded-lg text-[11px]">
                    <span className="font-semibold block text-sky-900 mb-1">ທີມງານພາກສະໜາມ:</span>
                    {selectedProject.team.map((t, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span>{t.name}</span>
                        <span className="text-slate-400 font-mono">{t.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </APIProvider>

        {/* Floating Quick Legend (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl shadow-lg text-[11px] space-y-1">
          <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">ຄຳອະທິບາຍສັນຍາລັກ:</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
            <span className="text-slate-600 dark:text-slate-400">CORS Online (ພ້ອມແຈກ RTK)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-2xs" />
            <span className="text-slate-600 dark:text-slate-400">CORS Offline / ປັບປຸງ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-2xs" />
            <span className="text-slate-600 dark:text-slate-400">ສຳນັກງານໃຫຍ່ UniqTek HQ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
