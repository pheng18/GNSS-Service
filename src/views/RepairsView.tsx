import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Plus,
  ArrowLeft,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Calendar,
  FileSpreadsheet,
  ArrowUpDown,
  Filter,
  Flame,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Repair, InternalNote } from '../types';
import { MonthlyReportModal } from '../components/MonthlyReportModal';
import { VoiceDictationButton } from '../components/VoiceDictationButton';
import { TechnicianSelect } from '../components/TechnicianSelect';

export const RepairsView: React.FC = () => {
  const {
    repairs,
    notes,
    employees,
    selectedRepair,
    selectRepair,
    addRepair,
    updateRepairStatus,
    addInternalNote,
    user
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ທັງໝົດ');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'date-desc' | 'date-asc'>('priority');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // New repair form state
  const [model, setModel] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [problem, setProblem] = useState('');
  const [assignedTech, setAssignedTech] = useState('ສົມພອນ ເພັດດາລາ');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Edit diagnostic in detail view
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState<Repair['status']>('ລໍຖ້າກວດເຊັກ');
  const [editPriority, setEditPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [editCause, setEditCause] = useState('');
  const [editSolution, setEditSolution] = useState('');

  // New note input
  const [newNoteText, setNewNoteText] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ລໍຖ້າກວດເຊັກ':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'ກຳລັງສ້ອມແປງ':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case 'ກຳລັງສຳຫຼວດ':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
      case 'ສຳເລັດແລ້ວ':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getPriorityBadge = (pr?: 'High' | 'Medium' | 'Low') => {
    switch (pr) {
      case 'High':
        return {
          label: 'ບູລິມະສິດສູງ',
          english: 'High',
          badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800/70',
          dotClass: 'bg-rose-500 animate-pulse',
          borderHighlight: 'border-l-4 border-l-rose-500'
        };
      case 'Low':
        return {
          label: 'ບູລິມະສິດຕ່ຳ',
          english: 'Low',
          badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70',
          dotClass: 'bg-emerald-500',
          borderHighlight: 'border-l-4 border-l-emerald-500'
        };
      case 'Medium':
      default:
        return {
          label: 'ປານກາງ',
          english: 'Medium',
          badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70',
          dotClass: 'bg-amber-500',
          borderHighlight: 'border-l-4 border-l-amber-500'
        };
    }
  };

  const handleCreateRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim() || !client.trim()) return;
    addRepair(
      serialNo.trim(),
      model.trim(),
      title.trim() || `${model} - ກວດເຊັກ`,
      client.trim(),
      problem.trim(),
      assignedTech.trim(),
      priority
    );
    setModel('');
    setSerialNo('');
    setTitle('');
    setClient('');
    setProblem('');
    setPriority('Medium');
    setShowAddModal(false);
  };

  const handleStartEdit = (rep: Repair) => {
    setEditStatus(rep.status);
    setEditPriority(rep.priority || 'Medium');
    setEditCause(rep.cause || '');
    setEditSolution(rep.solution || '');
    setIsEditMode(true);
  };

  const handleSaveEdit = (rep: Repair) => {
    updateRepairStatus(rep, editStatus, editCause, editSolution, editPriority);
    setIsEditMode(false);
  };

  const handleSendNote = (repId: string) => {
    if (!newNoteText.trim()) return;
    const author = user ? `ຊ່າງເຕັກນິກ (${user.split('@')[0]})` : 'ຊ່າງເຕັກນິກ';
    addInternalNote(repId, author, newNoteText.trim());
    setNewNoteText('');
  };

  // Detail View Screen
  if (selectedRepair) {
    const repairNotes = notes.filter((n) => n.repairId === selectedRepair.id);

    return (
      <div className="space-y-5 pb-12">
        {/* Top bar with back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setIsEditMode(false);
              selectRepair(null);
            }}
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ກັບຄືນ</span>
          </button>
          <span className="text-xs font-mono font-semibold text-slate-400">
            {selectedRepair.id}
          </span>
        </div>

        {/* Header Info Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {selectedRepair.model}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                ລູກຄ້າ: <strong className="text-slate-800 dark:text-slate-200">{selectedRepair.client}</strong>
              </p>
              <p className="text-xs text-slate-500">
                ເລກເຄື່ອງ: {selectedRepair.serialNo} • ວັນທີຮັບ: {selectedRepair.receivedDate}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {(() => {
                const pb = getPriorityBadge(selectedRepair.priority);
                return (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${pb.badgeClass}`}>
                    <span className={`w-2 h-2 rounded-full ${pb.dotClass}`} />
                    {pb.label}
                  </span>
                );
              })()}
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(
                  selectedRepair.status
                )}`}
              >
                {selectedRepair.status}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              {selectedRepair.title}
            </p>
          </div>
        </div>

        {/* Diagnostics & Status Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              ຂໍ້ມູນເຕັກນິກ ແລະ ການວິນິດໄສ
            </h2>
            <button
              onClick={() => {
                if (isEditMode) {
                  setIsEditMode(false);
                } else {
                  handleStartEdit(selectedRepair);
                }
              }}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isEditMode ? 'ຍົກເລີກ' : 'ແກ້ໄຂສະຖານະ'}
            </button>
          </div>

          {isEditMode ? (
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                  ລະດັບບູລິມະສິດ (Priority):
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['High', 'Medium', 'Low'] as const).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setEditPriority(pr)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        editPriority === pr
                          ? pr === 'High'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : pr === 'Medium'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {pr === 'High' ? '🔴 ສູງ (High)' : pr === 'Medium' ? '🟡 ກາງ (Medium)' : '🟢 ຕ່ຳ (Low)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                  ສະຖານະເຄື່ອງສ້ອມແປງ:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['ລໍຖ້າກວດເຊັກ', 'ກຳລັງສ້ອມແປງ', 'ສຳເລັດແລ້ວ'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        editStatus === st
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ສາເຫດຂອງບັນຫາ (Cause)
                </label>
                <textarea
                  rows={2}
                  value={editCause}
                  onChange={(e) => setEditCause(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                  placeholder="ລະບຸສາເຫດ..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ວິທີແກ້ໄຂ / ອາໄຫຼ່ທີ່ໃຊ້ (Solution)
                </label>
                <textarea
                  rows={2}
                  value={editSolution}
                  onChange={(e) => setEditSolution(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                  placeholder="ລະບຸວິທີແກ້ໄຂ..."
                />
              </div>

              <button
                onClick={() => handleSaveEdit(selectedRepair)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                ບັນທຶກການແກ້ໄຂ
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">
                  ອາການເສຍຫາຍເບື້ອງຕົ້ນ:
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedRepair.problem || 'ບໍ່ໄດ້ລະບຸ'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">
                  ສາເຫດຂອງບັນຫາ (Cause):
                </span>
                <p className="text-slate-800 dark:text-slate-200">
                  {selectedRepair.cause || 'ກຳລັງກວດສອບ...'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">
                  ການແກ້ໄຂ (Solution):
                </span>
                <p className="text-slate-800 dark:text-slate-200">
                  {selectedRepair.solution || 'ກຳລັງວາງແຜນແກ້ໄຂ...'}
                </p>
              </div>
              {(() => {
                const techEmp = employees.find(
                  (e) => e.name.trim().toLowerCase() === selectedRepair.assignedTech.trim().toLowerCase()
                );
                return (
                  <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">ຊ່າງເຕັກນິກຜູ້ຮັບຜິດຊອບ:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRepair.assignedTech}</span>
                      {techEmp && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                          {techEmp.role}
                        </span>
                      )}
                    </div>
                    {techEmp?.phone && (
                      <a
                        href={`tel:${techEmp.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-200/50 dark:border-blue-800/40"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>{techEmp.phone}</span>
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Timeline Progress Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            ທາມລາຍການດຳເນີນງານ (Timeline)
          </h2>
          <div className="space-y-4 pl-2">
            {selectedRepair.timeline.map((item, idx) => (
              <div key={item.id} className="relative flex items-start gap-3">
                {/* Connector line */}
                {idx < selectedRepair.timeline.length - 1 && (
                  <div className="absolute top-4 left-2 w-0.5 h-12 bg-blue-200 dark:bg-blue-900/50 -translate-x-1/2" />
                )}
                {/* Step indicator */}
                <div
                  className={`w-4 h-4 rounded-full border-2 border-blue-600 mt-1 flex items-center justify-center shrink-0 z-10 ${
                    item.done ? 'bg-blue-600' : 'bg-white dark:bg-slate-900'
                  }`}
                />
                <div className="flex-1 pb-3 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                    {item.desc}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Notes Section */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            ບັນທຶກຊ່າງພາຍໃນ (Internal Notes)
          </h2>

          <div className="space-y-2.5">
            {repairNotes.length === 0 ? (
              <p className="text-xs text-slate-400">ຍັງບໍ່ມີບັນທຶກພາຍໃນສຳລັບເຄື່ອງນີ້</p>
            ) : (
              repairNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1E3A8A] dark:text-blue-400">
                      {note.author}
                    </span>
                    <span className="text-[10px] text-slate-400">{note.date}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {note.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Quick add note form with Voice Dictation */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">
                ເພີ່ມບັນທຶກຊ່າງດ່ວນ:
              </span>
              <VoiceDictationButton
                onTranscript={(dictated) => {
                  setNewNoteText((prev) => (prev ? `${prev} ${dictated}` : dictated));
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendNote(selectedRepair.id)}
                placeholder="ເພີ່ມບັນທຶກຊ່າງ... (ຫຼື ກົດປຸ່ມເວົ້າບັນທຶກສຽງ)"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
              />
              <button
                onClick={() => handleSendNote(selectedRepair.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ສົ່ງ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Priority weights for sorting
  const priorityWeights: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1
  };

  // Filtered and sorted list
  const filteredRepairs = repairs
    .filter((rep) => {
      const matchesQuery =
        rep.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.assignedTech.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'ທັງໝົດ' || rep.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'All' || (rep.priority || 'Medium') === priorityFilter;

      return matchesQuery && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const weightA = priorityWeights[a.priority || 'Medium'] || 2;
        const weightB = priorityWeights[b.priority || 'Medium'] || 2;
        if (weightB !== weightA) return weightB - weightA;
        return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime();
      }
      if (sortBy === 'date-desc') {
        return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime();
      }
      return 0;
    });

  const filterChips = ['ທັງໝົດ', 'ລໍຖ້າກວດເຊັກ', 'ກຳລັງສ້ອມແປງ', 'ສຳເລັດແລ້ວ'];

  return (
    <div className="space-y-4 pb-12">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            ບໍລິການສ້ອມແປງ (Repairs)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ຕິດຕາມອຸປະກອນທີ່ສົ່ງເຂົ້າມາສ້ອມແປງ ແລະ ປັບຈູນ Calibration ພ້ອມຈັດລຽງຕາມບູລິມະສິດ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="export_monthly_report_btn"
            onClick={() => setShowReportModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            title="ສົ່ງອອກບົດສະຫຼຸບປະຈຳເດືອນ (PDF / CSV)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ລາຍງານປະຈຳເດືອນ</span>
          </button>
          <button
            data-testid="add_repair_btn"
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>ເພີ່ມໃໝ່</span>
          </button>
        </div>
      </div>

      {/* Search & Priority / Sort Controls */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ຄົ້ນຫາ ຣຸ່ນ, ລູກຄ້າ, ໝາຍເລກເຄື່ອງ, ຊ່າງເຕັກນິກ..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden focus:border-blue-500 shadow-2xs"
          />
        </div>

        {/* Priority Filter and Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Priority Filter Dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">ບູລິມະສິດ (Priority):</span>
              <select
                data-testid="priority_filter_dropdown"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as 'All' | 'High' | 'Medium' | 'Low')}
                aria-label="ເລືອກບູລິມະສິດ"
                className="bg-transparent font-bold text-slate-900 dark:text-white outline-hidden cursor-pointer"
              >
                <option value="All" className="text-slate-900 dark:text-slate-900">ທັງໝົດ (All Priorities)</option>
                <option value="High" className="text-slate-900 dark:text-slate-900">🔴 ສູງ (High - {repairs.filter(r => (r.priority || 'Medium') === 'High').length})</option>
                <option value="Medium" className="text-slate-900 dark:text-slate-900">🟡 ກາງ (Medium - {repairs.filter(r => (r.priority || 'Medium') === 'Medium').length})</option>
                <option value="Low" className="text-slate-900 dark:text-slate-900">🟢 ຕ່ຳ (Low - {repairs.filter(r => (r.priority || 'Medium') === 'Low').length})</option>
              </select>
            </div>

            {/* Quick Priority Pill Badges */}
            <div className="hidden sm:flex items-center gap-1 text-xs">
              {(['All', 'High', 'Medium', 'Low'] as const).map((p) => {
                const isSelected = priorityFilter === p;
                const count = p === 'All' ? repairs.length : repairs.filter(r => (r.priority || 'Medium') === p).length;
                return (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? p === 'High'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : p === 'Medium'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : p === 'Low'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p === 'All' ? 'ທັງໝົດ' : p === 'High' ? '🔴 ສູງ' : p === 'Medium' ? '🟡 ກາງ' : '🟢 ຕ່ຳ'} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs shadow-2xs ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">ຈັດລຽງ:</span>
            <select
              data-testid="sort_by_dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'priority' | 'date-desc' | 'date-asc')}
              aria-label="ເລືອກການຈັດລຽງ"
              className="bg-transparent font-bold text-slate-900 dark:text-white outline-hidden cursor-pointer"
            >
              <option value="priority" className="text-slate-900 dark:text-slate-900">ບູລິມະສິດ (ສູງ → ຕ່ຳ)</option>
              <option value="date-desc" className="text-slate-900 dark:text-slate-900">ວັນທີຮັບ (ໃໝ່ສຸດ)</option>
              <option value="date-asc" className="text-slate-900 dark:text-slate-900">ວັນທີຮັບ (ເກົ່າສຸດ)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterChips.map((chip) => {
            const isSelected = chip === statusFilter;
            return (
              <button
                key={chip}
                onClick={() => setStatusFilter(chip)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Repairs List */}
      {filteredRepairs.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          ບໍ່ພົບຂໍ້ມູນໃບສ້ອມແປງທີ່ກົງກັບເງື່ອນໄຂ
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRepairs.map((repair) => {
            const pBadge = getPriorityBadge(repair.priority);
            const isHighPriority = (repair.priority || 'Medium') === 'High';

            return (
              <div
                key={repair.id}
                onClick={() => selectRepair(repair)}
                className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border shadow-xs hover:border-blue-400 transition-all cursor-pointer space-y-2.5 ${
                  isHighPriority
                    ? 'border-rose-200 dark:border-rose-900/50 shadow-rose-500/5'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {repair.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* Priority Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${pBadge.badgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pBadge.dotClass}`} />
                      {pBadge.label}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(
                        repair.status
                      )}`}
                    >
                      {repair.status}
                    </span>
                  </div>
                </div>

                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {repair.title}
                </h2>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-slate-400" />
                    <span>{repair.model}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>ລູກຄ້າ: <strong className="text-slate-700 dark:text-slate-300">{repair.client}</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    ວັນທີຮັບ: {repair.receivedDate}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ຊ່າງເຕັກນິກ: {repair.assignedTech}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Repair Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ເພີ່ມໃບຮັບສ້ອມແປງໃໝ່
            </h3>

            <form onSubmit={handleCreateRepair} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ລຸ່ນອຸປະກອນ (e.g., Leica TS16) *
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Leica TS16 / Trimble R12i"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ໝາຍເລກເຄື່ອງ (Serial Number)
                </label>
                <input
                  type="text"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  placeholder="894521"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ຫົວຂໍ້ອາການເສຍຫາຍ
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Total Station - ຄວາມຜິດພາດ EDM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
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
                  placeholder="ກົມແຜນທີ່ / ບໍລິສັດກໍ່ສ້າງ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-slate-700 dark:text-slate-300">
                    ລາຍລະອຽດບັນຫາ / ອາການເສຍຫາຍ (Service Notes)
                  </label>
                  <VoiceDictationButton
                    onTranscript={(dictated) => {
                      setProblem((prev) => (prev ? `${prev} ${dictated}` : dictated));
                    }}
                  />
                </div>
                <textarea
                  rows={3}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="ອຸປະກອນບໍ່ເປີດ, ຈໍສະແດງຜົນມີບັນຫາ... (ຫຼື ກົດປຸ່ມເວົ້າບັນທຶກສຽງ Voice-to-Text ດ້ານເທິງ)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <TechnicianSelect
                  value={assignedTech}
                  onChange={(tech) => setAssignedTech(tech)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  ລະດັບບູລິມະສິດ (Priority Level) *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'High' as const, label: 'ສູງ (High)', desc: 'ດ່ວນ / ລູກຄ້າຮີບດ່ວນ', dot: 'bg-rose-500' },
                    { val: 'Medium' as const, label: 'ກາງ (Medium)', desc: 'ປົກກະຕິ', dot: 'bg-amber-500' },
                    { val: 'Low' as const, label: 'ຕ່ຳ (Low)', desc: 'ກວດເຊັກທົ່ວໄປ', dot: 'bg-emerald-500' }
                  ].map((p) => {
                    const isSel = priority === p.val;
                    return (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setPriority(p.val)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSel
                            ? p.val === 'High'
                              ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20'
                              : p.val === 'Medium'
                              ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                              : 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                          <span>{p.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{p.desc}</p>
                      </button>
                    );
                  })}
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  ບັນທຶກ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Monthly Service Summary Report Modal */}
      {showReportModal && (
        <MonthlyReportModal
          repairs={repairs}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
