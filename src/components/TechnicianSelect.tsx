import React, { useState, useRef, useEffect } from 'react';
import {
  UserCheck,
  ChevronDown,
  Search,
  Phone,
  Briefcase,
  ShieldCheck,
  Plus,
  Check,
  Sparkles,
  Database,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Employee } from '../types';

interface TechnicianSelectProps {
  value: string;
  onChange: (techName: string) => void;
  required?: boolean;
}

export const TechnicianSelect: React.FC<TechnicianSelectProps> = ({
  value,
  onChange,
  required = false
}) => {
  const { employees, isLoadingEmployees, addEmployee } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New technician form fields
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Service Technician');
  const [newDept, setNewDept] = useState('Service & Calibration');
  const [newPhone, setNewPhone] = useState('020 ');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsAddingNew(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedEmployee = employees.find(
    (e) => e.name.trim().toLowerCase() === (value || '').trim().toLowerCase()
  );

  const filteredEmployees = employees.filter((emp) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.phone.toLowerCase().includes(q) ||
      emp.specialties?.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleSelect = (emp: Employee) => {
    onChange(emp.name);
    setIsOpen(false);
    setIsAddingNew(false);
  };

  const handleCreateNewTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    setIsSubmitting(true);
    try {
      const specialtiesArray = newSpecialty
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await addEmployee({
        name: newName.trim(),
        role: newRole.trim(),
        department: newDept.trim(),
        phone: newPhone.trim(),
        active: true,
        specialties: specialtiesArray.length > 0 ? specialtiesArray : ['General Repair', 'Survey Diagnostics']
      });

      onChange(newName.trim());
      setNewName('');
      setNewSpecialty('');
      setIsAddingNew(false);
      setIsOpen(false);
    } catch (err) {
      console.error('Error adding employee to Firestore:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          ຊ່າງເຕັກນິກຜູ້ຮັບຜິດຊອບ (Assigned Technician) {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
          <Database className="w-3 h-3 animate-pulse" />
          <span>Firebase Firestore Synced</span>
        </div>
      </div>

      {/* Select trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-3.5 py-2.5 rounded-xl border transition-all text-left flex items-center justify-between gap-3 bg-white dark:bg-slate-900 ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {selectedEmployee ? (
            <>
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs text-sm">
                {selectedEmployee.name.charAt(0)}
              </div>
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {selectedEmployee.name}
                  </span>
                  <span className="shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    {selectedEmployee.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 truncate">
                  <span>{selectedEmployee.department}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {selectedEmployee.phone}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {value || 'ເລືອກຊ່າງເຕັກນິກຈາກຖານຂໍ້ມູນ...'}
                </span>
                <p className="text-xs text-slate-400">ກົດເພື່ອເລືອກຈາກລາຍຊື່ພະນັກງານທີ່ລົງທະບຽນ</p>
              </div>
            </>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header & Search */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                ລາຍຊື່ຊ່າງເຕັກນິກ ແລະ ວິສະວະກອນ ({filteredEmployees.length})
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNew((prev) => !prev)}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-bold"
              >
                {isAddingNew ? (
                  <>
                    <X className="w-3.5 h-3.5" /> ປິດຟອມເພີ່ມ
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" /> ລົງທະບຽນຊ່າງໃໝ່
                  </>
                )}
              </button>
            </div>

            {/* Search Input */}
            {!isAddingNew && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ຄົ້ນຫາຊື່, ສາຂາຄວາມຊຳນານ, ເບີໂທ..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-blue-500"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Quick-Add New Technician Form */}
          {isAddingNew ? (
            <form onSubmit={handleCreateNewTechnician} className="p-3.5 space-y-3 bg-blue-50/40 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ລົງທະບຽນຊ່າງເຕັກນິກໃໝ່ເຂົ້າ Firestore</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-0.5 font-medium">
                    ຊື່ ແລະ ນາມສະກຸນ *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="ຕົວຢ່າງ: ສົມຈິດ ວົງສາ"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-0.5 font-medium">
                    ເບີໂທລະສັບຕິດຕໍ່ *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="020 5xxx xxxx"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-0.5 font-medium">
                    ຕຳແໜ່ງ
                  </label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-0.5 font-medium">
                    ພະແນກ
                  </label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-300 mb-0.5 font-medium">
                  ຄວາມຊຳນານສະເພາະດ້ານ (Specialties, ຄັ່ນດ້ວຍຈຸດ ,)
                </label>
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Total Station, Optical Sensor, GNSS RTK"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newName.trim()}
                  className="px-3.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກລົງ Firebase'}
                </button>
              </div>
            </form>
          ) : null}

          {/* List of Registered Employees */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {isLoadingEmployees && employees.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-400">
                ກຳລັງໂຫຼດຂໍ້ມູນຈາກ Firebase Firestore...
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                ບໍ່ພົບລາຍຊື່ຊ່າງເຕັກນິກທີ່ຕົງກັບຄຳຄົ້ນຫາ
              </div>
            ) : (
              filteredEmployees.map((emp) => {
                const isSelected =
                  selectedEmployee?.id === emp.id ||
                  (value && emp.name.toLowerCase() === value.toLowerCase());

                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => handleSelect(emp)}
                    className={`w-full p-3 text-left transition-colors flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                      isSelected ? 'bg-blue-50/70 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {emp.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-semibold text-sm truncate ${
                              isSelected
                                ? 'text-blue-700 dark:text-blue-400 font-bold'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {emp.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {emp.role}
                          </span>
                          {emp.active && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-slate-400" />
                            {emp.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {emp.phone}
                          </span>
                        </div>

                        {/* Specialties pills */}
                        {emp.specialties && emp.specialties.length > 0 && (
                          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                            {emp.specialties.slice(0, 3).map((spec, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400"
                              >
                                {spec}
                              </span>
                            ))}
                            {emp.specialties.length > 3 && (
                              <span className="text-[10px] text-slate-400">
                                +{emp.specialties.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer showing Firestore Sync status */}
          <div className="px-3.5 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>ຄໍເລັກຊັນ: Firestore `employees`</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">ພ້ອມໃຊ້ງານໃນລະບົບ</span>
          </div>
        </div>
      )}
    </div>
  );
};
