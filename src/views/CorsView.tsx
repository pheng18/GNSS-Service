import React, { useState } from 'react';
import { Radio, Search, Edit2, RefreshCw, AlertTriangle, CheckCircle, Wifi, WifiOff, Map as MapIcon, List } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CORSStation } from '../types';
import { GoogleMapsView } from '../components/GoogleMapsView';

export const CorsView: React.FC = () => {
  const { stations, toggleStationStatus, updateStationIssue } = useApp();

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ທັງໝົດ');

  const [editingStation, setEditingStation] = useState<CORSStation | null>(null);
  const [issueEditText, setIssueEditText] = useState('');

  const filteredStations = stations.filter((st) => {
    const matchesQuery =
      st.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.notes && st.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'ທັງໝົດ' || st.type === typeFilter;
    return matchesQuery && matchesType;
  });

  const handleOpenEdit = (st: CORSStation) => {
    setEditingStation(st);
    setIssueEditText(st.issue);
  };

  const handleSaveIssue = () => {
    if (editingStation) {
      updateStationIssue(editingStation, issueEditText.trim());
      setEditingStation(null);
    }
  };

  const onlineCount = stations.filter(s => s.status === 'Online').length;
  const offlineCount = stations.filter(s => s.status === 'Offline').length;

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            ສະຖານີອ້າງອີງພິກັດ CORS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ເຄືອຂ່າຍສະຖານີດາວທຽມອ້າງອີງພິກັດທົ່ວປະເທດ (73 ສະຖານີ)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Map vs List View Toggle */}
          <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'map'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>ແຜນທີ່</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'list'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>ລາຍການ</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Online: {onlineCount}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-bold border border-red-200 dark:border-red-800">
              Offline: {offlineCount}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Map View */}
      {viewMode === 'map' && (
        <div className="space-y-3">
          <GoogleMapsView
            stations={stations}
            activeMode="cors"
            onStationSelect={(st) => handleOpenEdit(st)}
          />
        </div>
      )}

      {/* Search & List Section */}
      {viewMode === 'list' && (
        <>
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ຄົ້ນຫາ ລະຫັດສະຖານີ, ຊື່, ບັນຫາ..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden focus:border-amber-500 shadow-2xs"
            />
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-2">
            {['ທັງໝົດ', 'ໃໝ່', 'ເກົ່າ'].map((filter) => {
              const isSelected = filter === typeFilter;
              return (
                <button
                  key={filter}
                  onClick={() => setTypeFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {filter} (CORS)
                </button>
              );
            })}
          </div>

          {/* Stations Grid / List */}
          {filteredStations.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              ບໍ່ພົບຂໍ້ມູນສະຖານີ CORS ທີ່ກົງກັບຄຳຄົ້ນຫາ
            </div>
          ) : (
        <div className="space-y-3">
          {filteredStations.map((station) => {
            const isOnline = station.status === 'Online';

            return (
              <div
                key={station.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 hover:border-amber-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs">
                      {station.id}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      {station.name}
                    </h2>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isOnline
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                    }`}
                  >
                    {isOnline ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    <span>{station.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">ປະເພດສະຖານີ:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ສະຖານີຮຸ່ນ {station.type}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-0.5">ລາຍງານອາການ:</span>
                    <button
                      onClick={() => handleOpenEdit(station)}
                      className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 transition-colors text-left"
                    >
                      <span className="truncate">
                        {station.issue === 'none' ? 'ປົກກະຕິ' : station.issue}
                      </span>
                      <Edit2 className="w-3 h-3 text-slate-400 shrink-0" />
                    </button>
                  </div>
                </div>

                {station.notes && (
                  <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200">
                    <span className="font-bold block">ແຜນປັບປຸງ & ງົບປະມານ:</span>
                    <span>{station.notes}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    ຄລິກປ່ຽນສະຖານະດ່ວນ:
                  </span>
                  <button
                    onClick={() => toggleStationStatus(station)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-2xs transition-colors ${
                      isOnline
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{isOnline ? 'ປິດ (Offline)' : 'ເປີດ (Online)'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}

      {/* Edit Issue Modal */}
      {editingStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ແກ້ໄຂບັນຫາ / Maintenance Log
            </h3>
            <p className="text-xs text-slate-500">
              ສະຖານີ: <strong>{editingStation.id} - {editingStation.name}</strong>
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                ລາຍລະອຽດບັນຫາ (Issue Report)
              </label>
              <textarea
                rows={3}
                value={issueEditText}
                onChange={(e) => setIssueEditText(e.target.value)}
                placeholder="ລະບຸບັນຫາອຸປະກອນ, ສາຍໄຟ, ຫຼື ອິນເຕີເນັດ..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingStation(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold text-xs transition-colors"
              >
                ຍົກເລີກ
              </button>
              <button
                type="button"
                onClick={handleSaveIssue}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
              >
                ບັນທຶກ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
