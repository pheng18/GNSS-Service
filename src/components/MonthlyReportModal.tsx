import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  X,
  Calendar,
  Wrench,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Filter,
  FileText
} from 'lucide-react';
import { Repair } from '../types';
import { UniqTekLogo } from './UniqTekLogo';
import { useApp } from '../context/AppContext';

interface MonthlyReportModalProps {
  repairs: Repair[];
  onClose: () => void;
}

const LAO_MONTHS = [
  { value: '01', name: 'ມັງກອນ (January)' },
  { value: '02', name: 'ກຸມພາ (February)' },
  { value: '03', name: 'ມີນາ (March)' },
  { value: '04', name: 'ເມສາ (April)' },
  { value: '05', name: 'ພຶດສະພາ (May)' },
  { value: '06', name: 'ມິຖຸນາ (June)' },
  { value: '07', name: 'ກໍລະກົດ (July)' },
  { value: '08', name: 'ສິງຫາ (August)' },
  { value: '09', name: 'ກັນຍາ (September)' },
  { value: '10', name: 'ຕຸລາ (October)' },
  { value: '11', name: 'ພະຈິກ (November)' },
  { value: '12', name: 'ທັນວາ (December)' },
];

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  repairs,
  onClose
}) => {
  const { logUserOperation } = useApp();
  const currentYear = new Date().getFullYear();
  // Detect most prevalent month in repairs or default to May (as sample seed data has 2024-05)
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [selectedMonth, setSelectedMonth] = useState<string>('05'); // May
  const [selectedStatus, setSelectedStatus] = useState<string>('ທັງໝົດ');
  const [selectedTech, setSelectedTech] = useState<string>('ທັງໝົດ');
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);

  // Available distinct technicians
  const technicians = useMemo(() => {
    return ['ທັງໝົດ', ...Array.from(new Set(repairs.map((r) => r.assignedTech).filter(Boolean)))];
  }, [repairs]);

  // Available years from repairs
  const years = useMemo(() => {
    const detected = repairs
      .map((r) => r.receivedDate.split('-')[0])
      .filter((y) => y && y.length === 4);
    const set = new Set([String(currentYear), '2024', ...detected]);
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [repairs, currentYear]);

  // Filter repairs matching selected month, year, status, and technician
  const filteredRepairs = useMemo(() => {
    return repairs.filter((r) => {
      const parts = r.receivedDate.split('-');
      const repYear = parts[0];
      const repMonth = parts[1];

      const matchesYear = selectedYear === 'ທັງໝົດ' || repYear === selectedYear;
      const matchesMonth = selectedMonth === 'ທັງໝົດ' || repMonth === selectedMonth;
      const matchesStatus = selectedStatus === 'ທັງໝົດ' || r.status === selectedStatus;
      const matchesTech = selectedTech === 'ທັງໝົດ' || r.assignedTech === selectedTech;

      return matchesYear && matchesMonth && matchesStatus && matchesTech;
    });
  }, [repairs, selectedYear, selectedMonth, selectedStatus, selectedTech]);

  // Summary Metrics
  const totalCount = filteredRepairs.length;
  const completedCount = filteredRepairs.filter((r) => r.status === 'ສຳເລັດແລ້ວ').length;
  const inProgressCount = filteredRepairs.filter((r) => r.status === 'ກຳລັງສ້ອມແປງ').length;
  const pendingCount = filteredRepairs.filter((r) => r.status === 'ລໍຖ້າກວດເຊັກ').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Selected Month Name in Lao
  const monthLabel =
    selectedMonth === 'ທັງໝົດ'
      ? 'ທຸກເດືອນ'
      : LAO_MONTHS.find((m) => m.value === selectedMonth)?.name || selectedMonth;

  // CSV Export Function
  const exportToCSV = () => {
    const headers = [
      'ລຳດັບ (No.)',
      'ລະຫັດໃບສ້ອມແປງ (Repair ID)',
      'ວັນທີຮັບ (Received Date)',
      'ລຸ້ນອຸປະກອນ (Model)',
      'ໝາຍເລກເຄື່ອງ (Serial No)',
      'ລູກຄ້າ / ໜ່ວຍງານ (Client)',
      'ອາການເສຍຫາຍ (Problem)',
      'ສາເຫດ (Cause)',
      'ວິທີແກ້ໄຂ (Solution)',
      'ສະຖານະ (Status)',
      'ຊ່າງເຕັກນິກ (Technician)'
    ];

    const rows = filteredRepairs.map((r, i) => [
      i + 1,
      `"${r.id}"`,
      `"${r.receivedDate}"`,
      `"${r.model.replace(/"/g, '""')}"`,
      `"${r.serialNo.replace(/"/g, '""')}"`,
      `"${r.client.replace(/"/g, '""')}"`,
      `"${(r.problem || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(r.cause || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(r.solution || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${r.status}"`,
      `"${r.assignedTech}"`
    ]);

    // Add summary row at the end
    rows.push([]);
    rows.push([
      'ສະຫຼຸບລາຍເດືອນ',
      `ປີ: ${selectedYear}`,
      `ເດືອນ: ${monthLabel}`,
      `ລວມທັງໝົດ: ${totalCount} ລາຍການ`,
      `ສຳເລັດ: ${completedCount}`,
      `ກຳລັງສ້ອມແປງ: ${inProgressCount}`,
      `ລໍຖ້າກວດເຊັກ: ${pendingCount}`,
      `ອັດຕາສຳເລັດ: ${completionRate}%`
    ]);

    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Microsoft Excel Lao encoding compatibility
      headers.join(',') +
      '\n' +
      rows.map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `UniqTek_Repair_Report_${selectedYear}_${selectedMonth}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logUserOperation(
      "ສົ່ງອອກລາຍງານ CSV",
      `ບົດສະຫຼຸບການສ້ອມແປງເດືອນ: ${monthLabel} ປີ: ${selectedYear} (${totalCount} ລາຍການ)`,
      "repair"
    );
  };

  const handlePrint = () => {
    logUserOperation(
      "ພິມ / ສົ່ງອອກ PDF",
      `ບົດສະຫຼຸບການສ້ອມແປງເດືອນ: ${monthLabel} ປີ: ${selectedYear} (${totalCount} ລາຍການ)`,
      "repair"
    );
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <UniqTekLogo size={36} roundedClassName="rounded-xl" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                ລາຍງານສະຫຼຸບບໍລິການສ້ອມແປງປະຈຳເດືອນ
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly Technical Service & Repair Summary Report
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 bg-slate-100/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3 text-xs">
          {/* Year */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600 dark:text-slate-300">ປີ:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold outline-hidden focus:border-blue-500"
            >
              <option value="ທັງໝົດ">ທຸກປີ (All Years)</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600 dark:text-slate-300">ເດືອນ:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold outline-hidden focus:border-blue-500"
            >
              <option value="ທັງໝົດ">ທຸກເດືອນ (All Months)</option>
              {LAO_MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600 dark:text-slate-300">ສະຖານະ:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold outline-hidden focus:border-blue-500"
            >
              <option value="ທັງໝົດ">ທຸກສະຖານະ</option>
              <option value="ສຳເລັດແລ້ວ">ສຳເລັດແລ້ວ</option>
              <option value="ກຳລັງສ້ອມແປງ">ກຳລັງສ້ອມແປງ</option>
              <option value="ລໍຖ້າກວດເຊັກ">ລໍຖ້າກວດເຊັກ</option>
            </select>
          </div>

          {/* Tech */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600 dark:text-slate-300">ຊ່າງເຕັກນິກ:</span>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold outline-hidden focus:border-blue-500"
            >
              {technicians.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={exportToCSV}
              disabled={filteredRepairs.length === 0}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              title="ດາວໂຫຼດເປັນໄຟລ໌ CSV Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ດາວໂຫຼດ CSV</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={filteredRepairs.length === 0}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              title="ພິມ ຫຼື ບັນທຶກເປັນ PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>ພິມ / PDF</span>
            </button>
          </div>
        </div>

        {/* Content body / Printable Sheet */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 print:p-0 print:overflow-visible print-container">
          
          {/* Printable Report Header */}
          <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs print:border-none print:shadow-none print:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <UniqTekLogo size={48} roundedClassName="rounded-xl" />
                <div>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    ບໍລິສັດ ຢູນິກເທັກ ຈຳກັດ
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    UNIQTEK CO., LTD • ພະແນກບໍລິການສ້ອມແປງ ແລະ ປັບຈູນອຸປະກອນວັດແທກ
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right text-xs text-slate-500">
                <p>
                  <strong>ໄລຍະເວລາລາຍງານ:</strong> {monthLabel} {selectedYear}
                </p>
                <p>
                  <strong>ວັນທີອອກບົດສະຫຼຸບ:</strong>{' '}
                  {new Date().toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  ຮັບສ້ອມແປງທັງໝົດ
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {totalCount}
                </span>
                <span className="text-[10px] text-slate-400 block">ລາຍການ</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 block">
                  ສ້ອມແປງສຳເລັດ
                </span>
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {completedCount}
                </span>
                <span className="text-[10px] text-emerald-600/70 block">
                  {completionRate}% ຂອງຍອດຮັບ
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 block">
                  ກຳລັງດຳເນີນການ
                </span>
                <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {inProgressCount}
                </span>
                <span className="text-[10px] text-blue-600/70 block">ລາຍການ</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 block">
                  ລໍຖ້າກວດເຊັກ
                </span>
                <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  {pendingCount}
                </span>
                <span className="text-[10px] text-amber-600/70 block">ລາຍການ</span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden print:border-slate-300">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                ລາຍການອຸປະກອນຮັບສ້ອມແປງ ({filteredRepairs.length} ລາຍການ)
              </h3>
              <span className="text-xs text-slate-500">
                ສະແດງຜົນຕາມເງື່ອນໄຂຄັດຕອງ
              </span>
            </div>

            {filteredRepairs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                ບໍ່ພົບລາຍການສ້ອມແປງສຳລັບເດືອນ ແລະ ປີທີ່ເລືອກ
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-100/70 dark:bg-slate-800 font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 w-8">#</th>
                      <th className="py-2.5 px-3">ເລກບັດ / ວັນທີ</th>
                      <th className="py-2.5 px-3">ອຸປະກອນ & SN</th>
                      <th className="py-2.5 px-3">ລູກຄ້າ</th>
                      <th className="py-2.5 px-3">ອາການເສຍຫາຍ</th>
                      <th className="py-2.5 px-3">ສະຖານະ</th>
                      <th className="py-2.5 px-3">ຊ່າງເຕັກນິກ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredRepairs.map((r, idx) => (
                      <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">
                            {r.id}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {r.receivedDate}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {r.model}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {r.serialNo}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold">
                          {r.client}
                        </td>
                        <td className="py-2.5 px-3 max-w-xs truncate text-[11px] text-slate-600 dark:text-slate-400" title={r.problem}>
                          {r.problem}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              r.status === 'ສຳເລັດແລ້ວ'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                : r.status === 'ກຳລັງສ້ອມແປງ'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {r.assignedTech}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Signature Sign-off block for formal monthly reports */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-8">
              <p className="font-bold text-slate-700 dark:text-slate-300">
                ຊ່າງເຕັກນິກຜູ້ສັງລວມ (Technician Lead)
              </p>
              <div className="pt-6 border-b border-dashed border-slate-300 dark:border-slate-600 w-44 mx-auto" />
              <p className="text-[11px] text-slate-500">
                ວັນທີ: ..... / ..... / ..........
              </p>
            </div>

            <div className="space-y-8">
              <p className="font-bold text-slate-700 dark:text-slate-300">
                ຫົວໜ້າຝ່າຍບໍລິການເຕັກນິກ (Technical Service Manager)
              </p>
              <div className="pt-6 border-b border-dashed border-slate-300 dark:border-slate-600 w-44 mx-auto" />
              <p className="text-[11px] text-slate-500">
                ວັນທີ: ..... / ..... / ..........
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            ລາຍງານພ້ອມສົ່ງອອກທັງຮູບແບບ PDF ແລະ CSV ສຳລັບ Excel
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white rounded-xl font-bold transition-colors"
          >
            ປິດໜ້າຕ່າງ
          </button>
        </div>

      </div>
    </div>
  );
};
