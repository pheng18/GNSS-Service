import React, { useState, useMemo } from 'react';
import {
  Wrench,
  MapPin,
  Radio,
  ShoppingCart,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Users,
  Activity,
  Database,
  Wifi
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RepairPerformanceAnalytics } from '../components/RepairPerformanceAnalytics';

const LAO_MONTH_NAMES = [
  'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
  'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'
];

export const DashboardView: React.FC = () => {
  const {
    repairs,
    projects,
    stations,
    quotations,
    notes,
    users,
    activityLogs,
    lastSyncedAt,
    realtimeEventCount,
    profile,
    navigateTo,
    selectRepair
  } = useApp();

  // Current calendar month definition
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth();
  const currentMonthKey = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}`;
  const currentMonthLao = `${LAO_MONTH_NAMES[currentMonthIdx]} ${currentYear}`;

  // Month selector state: defaults to current month
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  // Available months extracted from data + current month
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    monthSet.add(currentMonthKey);
    repairs.forEach((r) => {
      if (r.receivedDate && r.receivedDate.length >= 7) {
        monthSet.add(r.receivedDate.substring(0, 7));
      }
    });
    quotations.forEach((q) => {
      if (q.date && q.date.length >= 7) {
        monthSet.add(q.date.substring(0, 7));
      }
    });
    return Array.from(monthSet).sort().reverse();
  }, [repairs, quotations, currentMonthKey]);

  // 1. Active Repairs for the selected/current month
  const activeRepairsForMonth = useMemo(() => {
    return repairs.filter((r) => {
      const isActive = r.status === 'ກຳລັງສ້ອມແປງ' || r.status === 'ລໍຖ້າກວດເຊັກ';
      if (!isActive) return false;
      if (selectedMonth === 'all') return true;
      if (r.receivedDate && r.receivedDate.startsWith(selectedMonth)) return true;
      if (selectedMonth === currentMonthKey) return true;
      return false;
    });
  }, [repairs, selectedMonth, currentMonthKey]);

  // 2. Pending Quotations for the selected/current month
  const pendingQuotationsForMonth = useMemo(() => {
    return quotations.filter((q) => {
      if (selectedMonth === 'all') return true;
      if (q.date && q.date.startsWith(selectedMonth)) return true;
      if (selectedMonth === currentMonthKey) return true;
      return false;
    });
  }, [quotations, selectedMonth, currentMonthKey]);

  const pendingQuotesValue = useMemo(() => {
    return pendingQuotationsForMonth.reduce((sum, q) => sum + (q.total || 0), 0);
  }, [pendingQuotationsForMonth]);

  // 3. Completed Projects for the selected/current month
  const completedProjectsForMonth = useMemo(() => {
    return projects.filter((p) => {
      const isCompleted = p.status === 'ສຳເລັດແລ້ວ' || p.progress === 100;
      if (!isCompleted) return false;
      if (selectedMonth === 'all') return true;
      return true;
    });
  }, [projects, selectedMonth]);

  const activeRepairsCount = repairs.filter(
    (r) => r.status === 'ກຳລັງສ້ອມແປງ' || r.status === 'ລໍຖ້າກວດເຊັກ'
  ).length;

  const activeProjectsCount = projects.filter(
    (p) => p.status === 'ກຳລັງສຳຫຼວດ' || p.status === 'ລໍຖ້າການວິເຄາະ'
  ).length;

  const onlineStationsCount = stations.filter((s) => s.status === 'Online').length;
  const totalStationsCount = stations.length;

  const totalQuotesValue = quotations.reduce((acc, q) => acc + q.total, 0);

  const statuses = [
    { label: 'ລໍຖ້າກວດເຊັກ', count: repairs.filter((r) => r.status === 'ລໍຖ້າກວດເຊັກ').length, color: 'bg-slate-500' },
    { label: 'ກຳລັງສ້ອມແປງ', count: repairs.filter((r) => r.status === 'ກຳລັງສ້ອມແປງ').length, color: 'bg-blue-500' },
    { label: 'ກຳລັງສຳຫຼວດ', count: repairs.filter((r) => r.status === 'ກຳລັງສຳຫຼວດ').length, color: 'bg-amber-500' },
    { label: 'ສຳເລັດແລ້ວ', count: repairs.filter((r) => r.status === 'ສຳເລັດແລ້ວ').length, color: 'bg-emerald-500' }
  ];

  const maxCount = Math.max(...statuses.map((s) => s.count), 1);

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

  const getMonthDisplayText = (key: string) => {
    if (key === 'all') return 'ທັງໝົດ';
    if (key === currentMonthKey) return `ເດືອນປັດຈຸບັນ (${currentMonthLao})`;
    const [y, m] = key.split('-');
    const mIdx = parseInt(m, 10) - 1;
    return `${LAO_MONTH_NAMES[mIdx] || m}/${y}`;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            ສະບາຍດີ, {profile.name || 'ທີມງານ UniqTek'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {profile.role} • ລະບົບຕິດຕາມການສ້ອມແປງ, ຖານຂໍ້ມູນຜູ້ໃຊ້ງານ ແລະ Real-time Info
          </p>
        </div>

        <button
          onClick={() => navigateTo('profile')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>ຈັດການ ອີເມວ/ຊື່ຜູ້ໃຊ້ & ລະຫັດຜ່ານ ({users.length})</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* REAL-TIME USER DATABASE & LIVE INFO HUB                                   */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border border-blue-200/80 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  ຖານຂໍ້ມູນຜູ້ໃຊ້ງານ, ອີເມວ/ຊື່ຜູ້ໃຊ້ & ລະຫັດຜ່ານ (Real-time Info)
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/70 dark:border-emerald-700">
                  <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
                  <span>LIVE SYNC • {lastSyncedAt}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ເຊື່ອມຕໍ່ Firebase Firestore Real-time • ຜູ້ໃຊ້ອອນລາຍ{' '}
                {users.filter((u) => u.status === 'Online').length}/{users.length} ຄົນ • ຊິ້ງຂໍ້ມູນແລ້ວ{' '}
                {realtimeEventCount} ຄັ້ງ
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('profile')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-center cursor-pointer"
          >
            <span>ຈັດການ ຊື່ຜູ້ໃຊ້ & ລະຫັດຜ່ານ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active Users Presence Cards + Live Activity Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Online / Registered Users List (2 cols) */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>ສະຖານະຜູ້ເຂົ້າໃຊ້ງານປັດຈຸບັນ (Active Users & Credentials DB)</span>
              <span className="text-[11px] text-slate-400">
                Online: {users.filter((u) => u.status === 'Online').length} | Busy:{' '}
                {users.filter((u) => u.status === 'Busy').length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {users.slice(0, 4).map((u) => (
                <div
                  key={u.id}
                  onClick={() => navigateTo('profile')}
                  className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 hover:border-blue-400 transition-all cursor-pointer flex items-start justify-between gap-2.5"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                          u.status === 'Online'
                            ? 'bg-emerald-500'
                            : u.status === 'Busy'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                        @{u.username || u.email.split('@')[0]} • {u.email}
                      </div>
                      <div className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate">
                        {u.currentActivity || 'ພ້ອມປະຕິບັດງານ'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'Online'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : u.status === 'Busy'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Activity Stream (1 col) */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>ການເຄື່ອນໄຫວ Real-time ຫຼ້າສຸດ</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">{activityLogs.length} ລາຍການ</span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {activityLogs.slice(0, 3).map((log) => (
                <div
                  key={log.id}
                  className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/70 text-[11px]"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span className="truncate">{log.action}</span>
                    <span className="text-[10px] font-normal text-slate-400 shrink-0 ml-1">
                      {log.timestamp.split(' ')[1] || log.timestamp}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {log.userEmail ? `${log.userEmail}: ` : ''}{log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SUMMARY CARDS SECTION - CURRENT MONTH METRICS                             */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-amber-500/10 via-slate-50 to-blue-500/10 dark:from-amber-950/20 dark:via-slate-800/60 dark:to-blue-950/20 p-5 rounded-3xl border border-amber-200/60 dark:border-slate-700/80 shadow-sm space-y-4">
        {/* Section Header with Month Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  ສະຫຼຸບຜົນງານປະຈຳເດືອນ (Monthly Summary)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  {selectedMonth === currentMonthKey ? 'ເດືອນປັດຈຸບັນ' : 'ຂໍ້ມູນຕາມເດືອນ'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ສະແດງການສ້ອມແປງຄົງຄ້າງ, ໃບສະເໜີລາຄາລໍຖ້າອະນຸມັດ ແລະ ໂຄງການສຳຫຼວດສຳເລັດ
              </p>
            </div>
          </div>

          {/* Month Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {availableMonths.map((mKey) => (
              <button
                key={mKey}
                onClick={() => setSelectedMonth(mKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedMonth === mKey
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {getMonthDisplayText(mKey)}
              </button>
            ))}
            <button
              onClick={() => setSelectedMonth('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedMonth === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              ທັງໝົດ
            </button>
          </div>
        </div>

        {/* 3 Prominent Summary Cards for Current Month */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Card 1: Active Repairs */}
          <div
            onClick={() => navigateTo('repairs')}
            className="group bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  ການສ້ອມແປງກຳລັງດຳເນີນການ
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                  {activeRepairsForMonth.length}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  ລາຍການ (Active Repairs)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                ກຳລັງສ້ອມແປງ & ລໍຖ້າກວດເຊັກ
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                <span>ເບິ່ງລາຍການ</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Pending Quotations */}
          <div
            onClick={() => navigateTo('quotations')}
            className="group bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  ໃບສະເໜີລາຄາລໍຖ້າອະນຸມັດ
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {pendingQuotationsForMonth.length}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  ສະບັບ (Pending Quotes)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-amber-700 dark:text-amber-400 font-semibold truncate mr-1 text-[11px]">
                {pendingQuotesValue > 0 ? `${pendingQuotesValue.toLocaleString()} LAK` : 'ລໍຖ້າລູກຄ້າຕອບຮັບ'}
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform shrink-0">
                <span>ເບິ່ງໃບສະເໜີ</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Completed Projects */}
          <div
            onClick={() => navigateTo('projects')}
            className="group bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  ໂຄງການສຳຫຼວດສຳເລັດແລ້ວ
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {completedProjectsForMonth.length}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  ໂຄງການ (Completed)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>100% ສຳເລັດພ້ອມສົ່ງມອບ</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                <span>ເບິ່ງໂຄງການ</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Graphical Performance Analytics: Repair Completion Trends (Last 6 Months) */}
      <RepairPerformanceAnalytics repairs={repairs} />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Repairs KPI */}
        <div
          onClick={() => navigateTo('repairs')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ເຄື່ອງສ້ອມແປງຄົງຄ້າງ
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {activeRepairsCount} <span className="text-xs font-normal text-slate-500">ລາຍການ</span>
          </div>
        </div>

        {/* Projects KPI */}
        <div
          onClick={() => navigateTo('projects')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ໂຄງການກຳລັງສຳຫຼວດ
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {activeProjectsCount} <span className="text-xs font-normal text-slate-500">ໂຄງການ</span>
          </div>
        </div>

        {/* CORS KPI */}
        <div
          onClick={() => navigateTo('cors')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ສະຖານີ CORS ອອນລາຍ
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {onlineStationsCount}/{totalStationsCount}{' '}
            <span className="text-xs font-normal text-slate-500">ສະຖານີ</span>
          </div>
        </div>

        {/* Quotations KPI */}
        <div
          onClick={() => navigateTo('quotations')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ຍອດໃບສະເໜີລາຄາ
            </span>
            <div className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-bold text-pink-600 dark:text-pink-400 truncate">
            {totalQuotesValue.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500">LAK</span>
          </div>
        </div>
      </div>

      {/* Status Breakdown Meter Chart */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          ສະຫຼຸບສະຖານະເຄື່ອງສ້ອມແປງ
        </h2>
        <div className="space-y-3">
          {statuses.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-xs">
              <span className="w-24 shrink-0 font-medium text-slate-600 dark:text-slate-300">
                {item.label}
              </span>
              <div className="flex-1 h-3.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right font-bold text-slate-900 dark:text-white">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Repairs List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            ລາຍການສ້ອມແປງຫຼ້າສຸດ
          </h2>
          <button
            onClick={() => navigateTo('repairs')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            <span>ເບິ່ງທັງໝົດ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {repairs.length === 0 ? (
          <p className="text-xs text-slate-500">ບໍ່ມີຂໍ້ມູນລາຍການສ້ອມແປງ</p>
        ) : (
          <div className="space-y-2">
            {repairs.slice(0, 3).map((repair) => (
              <div
                key={repair.id}
                onClick={() => selectRepair(repair)}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {repair.model}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {repair.client} • {repair.serialNo}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${getStatusBadge(
                      repair.status
                    )}`}
                  >
                    {repair.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internal Tech Notes */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          ບັນທຶກເຕັກນິກພາຍໃນຫຼ້າສຸດ (Internal Notes)
        </h2>

        {notes.length === 0 ? (
          <p className="text-xs text-slate-500">ບໍ່ມີບັນທຶກພາຍໃນ</p>
        ) : (
          <div className="space-y-2">
            {notes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E3A8A] dark:text-blue-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    {note.author}
                  </span>
                  <span className="text-[11px] text-slate-400">{note.date}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {note.text}
                </p>
                <p className="text-[10px] text-slate-400">
                  ເລກບັດ: {note.repairId}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
