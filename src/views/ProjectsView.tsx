import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Plus,
  ArrowLeft,
  User,
  Phone,
  Compass,
  CheckCircle2,
  Clock,
  Map as MapIcon,
  List
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { GoogleMapsView } from '../components/GoogleMapsView';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    selectedProject,
    selectProject,
    addProject,
    updateProjectProgress
  } = useApp();

  const [projectViewMode, setProjectViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ທັງໝົດ');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add project fields
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [latText, setLatText] = useState('18.0');
  const [lngText, setLngText] = useState('102.0');
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('ຫົວໜ້າທີມສຳຫຼວດ');
  const [teamPhone, setTeamPhone] = useState('020 5556 1234');

  // Edit progress in detail view
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState<Project['status']>('ກຳລັງສຳຫຼວດ');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ກຳລັງສຳຫຼວດ':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'ລໍຖ້າການວິເຄາະ':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
      case 'ສຳເລັດແລ້ວ':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) return;
    const lat = parseFloat(latText) || 18.0;
    const lng = parseFloat(lngText) || 102.0;
    addProject(title.trim(), client.trim(), location.trim(), lat, lng, teamName.trim(), teamRole.trim(), teamPhone.trim());
    setTitle('');
    setClient('');
    setLocation('');
    setTeamName('');
    setShowAddModal(false);
  };

  const handleStartEdit = (prj: Project) => {
    setEditProgress(prj.progress);
    setEditStatus(prj.status);
    setIsEditMode(true);
  };

  const handleSaveEdit = (prj: Project) => {
    updateProjectProgress(prj, editProgress, editStatus);
    setIsEditMode(false);
  };

  // Detail View Screen
  if (selectedProject) {
    return (
      <div className="space-y-5 pb-12">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setIsEditMode(false);
              selectProject(null);
            }}
            className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ກັບຄືນ</span>
          </button>
          <span className="text-xs font-mono font-semibold text-slate-400">
            {selectedProject.id}
          </span>
        </div>

        {/* Title Info Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex-1">
              {selectedProject.title}
            </h1>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${getStatusBadge(
                selectedProject.status
              )}`}
            >
              {selectedProject.status}
            </span>
          </div>
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <p>
              ລູກຄ້າ: <strong className="text-slate-800 dark:text-slate-200">{selectedProject.client}</strong>
            </p>
            <p>ສະຖານທີ່: {selectedProject.location}</p>
            <p className="flex items-center gap-1 text-slate-400">
              <Compass className="w-3.5 h-3.5" />
              <span>ພິກັດ: {selectedProject.coordinatesLat}, {selectedProject.coordinatesLng}</span>
            </p>
          </div>
        </div>

        {/* Progress Update Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              ຄວາມຄືບໜ້າ ແລະ ສະຖານະໂຄງການ
            </h2>
            <button
              onClick={() => {
                if (isEditMode) {
                  setIsEditMode(false);
                } else {
                  handleStartEdit(selectedProject);
                }
              }}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {isEditMode ? 'ຍົກເລີກ' : 'ແກ້ໄຂ'}
            </button>
          </div>

          {isEditMode ? (
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                  ສະຖານະໂຄງການ:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['ກຳລັງສຳຫຼວດ', 'ລໍຖ້າການວິເຄາະ', 'ສຳເລັດແລ້ວ'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        editStatus === st
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">ຄວາມຄືບໜ້າ:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{editProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <button
                onClick={() => handleSaveEdit(selectedProject)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                ບັນທຶກຄວາມຄືບໜ້າ
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${selectedProject.progress}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedProject.progress}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Team Members Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            ທີມງານປະຕິບັດງານພາກສະໜາມ
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {selectedProject.team.map((member, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-slate-400">{member.role}</p>
                  </div>
                </div>
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{member.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Projects List
  const filteredProjects = projects.filter((prj) => {
    const matchesQuery =
      prj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ທັງໝົດ' || prj.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const filterChips = ['ທັງໝົດ', 'ກຳລັງສຳຫຼວດ', 'ລໍຖ້າການວິເຄາະ', 'ສຳເລັດແລ້ວ'];

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            ໂຄງການສຳຫຼວດວັດແທກ
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ງານສຳຫຼວດພູມສາດ, ວາງແນວທາງ ແລະ ສຳຫຼວດຂອບເຂດທີ່ດິນ
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Map vs List View Toggle */}
          <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setProjectViewMode('list')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                projectViewMode === 'list'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>ລາຍການ</span>
            </button>
            <button
              onClick={() => setProjectViewMode('map')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                projectViewMode === 'map'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>ແຜນທີ່</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>ເພີ່ມໃໝ່</span>
          </button>
        </div>
      </div>

      {/* Map View */}
      {projectViewMode === 'map' && (
        <div className="space-y-3">
          <GoogleMapsView
            projects={projects}
            activeMode="projects"
            onProjectSelect={(p) => selectProject(p)}
          />
        </div>
      )}

      {/* List View Container */}
      {projectViewMode === 'list' && (
        <>
          {/* Search Bar */}
          <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ຄົ້ນຫາ ຫົວຂໍ້ໂຄງການ, ລູກຄ້າ, ສະຖານທີ່..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 shadow-2xs"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterChips.map((chip) => {
          const isSelected = chip === statusFilter;
          return (
            <button
              key={chip}
              onClick={() => setStatusFilter(chip)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          ບໍ່ພົບຂໍ້ມູນໂຄງການທີ່ກົງກັບເງື່ອນໄຂ
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => selectProject(project)}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-400 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {project.id}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {project.title}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                ລູກຄ້າ: <strong className="text-slate-700 dark:text-slate-300">{project.client}</strong>
              </p>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {project.progress}%
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">ສະຖານທີ່: {project.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ເພີ່ມໂຄງການສຳຫຼວດໃໝ່
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ຊື່ໂຄງການສຳຫຼວດ *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ສຳຫຼວດພື້ນທີ່ສ້າງທາງດ່ວນ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ຊື່ລູກຄ້າ / ໜ່ວຍງານ *
                </label>
                <input
                  type="text"
                  required
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="ກົມຂົນສົ່ງ / ລັດວິສາຫະກິດ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ສະຖານທີ່ (ແຂວງ/ເມືອງ)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={latText}
                    onChange={(e) => setLatText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={lngText}
                    onChange={(e) => setLngText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  ຜູ້ຮັບຜິດຊອບພາກສະໜາມ:
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="ຊື່-ນາມສະກຸນ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={teamRole}
                      onChange={(e) => setTeamRole(e.target.value)}
                      placeholder="ຕຳແໜ່ງ (Role)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={teamPhone}
                      onChange={(e) => setTeamPhone(e.target.value)}
                      placeholder="ເບີໂທຕິດຕໍ່"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  ບັນທຶກ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
