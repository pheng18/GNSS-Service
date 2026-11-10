import React, { useState } from 'react';
import { Search, Edit2, Info, Box, QrCode, Tag, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Equipment } from '../types';
import { Equipment3DViewer } from '../components/Equipment3DViewer';
import { QRCodeScannerModal } from '../components/QRCodeScannerModal';
import {
  EquipmentQRLabelModal,
  formatEquipmentUniqueId
} from '../components/EquipmentQRLabelModal';

export const EquipmentView: React.FC = () => {
  const { equipment, repairs, updateEquipmentDetail, selectRepair, navigateTo } = useApp();

  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRLabelModal, setShowQRLabelModal] = useState(false);
  const [selectedLabelEquipment, setSelectedLabelEquipment] = useState<Equipment | null>(null);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [model3DTarget, setModel3DTarget] = useState<'TS16' | 'GNSS' | 'LEVEL'>('TS16');
  const [searchQuery, setSearchQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('ທັງໝົດ');

  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [serialNumberText, setSerialNumberText] = useState('');
  const [noteText, setNoteText] = useState('');

  const provincesList = ['ທັງໝົດ', ...Array.from(new Set(equipment.map((e) => e.provinceName)))];

  const filteredEquipment = equipment.filter((eq) => {
    const uniqueId = formatEquipmentUniqueId(eq.id).toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      uniqueId.includes(q) ||
      eq.districtCode.toLowerCase().includes(q) ||
      eq.districtNameLao.toLowerCase().includes(q) ||
      eq.districtNameEng.toLowerCase().includes(q) ||
      eq.model.toLowerCase().includes(q) ||
      eq.serialNo.toLowerCase().includes(q) ||
      eq.provinceName.toLowerCase().includes(q) ||
      eq.note.toLowerCase().includes(q);
    const matchesProvince =
      provinceFilter === 'ທັງໝົດ' || eq.provinceName.includes(provinceFilter);
    return matchesQuery && matchesProvince;
  });

  const handleOpenEdit = (eq: Equipment) => {
    setEditingEquipment(eq);
    setSerialNumberText(eq.serialNo);
    setNoteText(eq.note);
  };

  const handleOpenQRLabel = (eq: Equipment | null) => {
    setSelectedLabelEquipment(eq);
    setShowQRLabelModal(true);
  };

  const handleSaveEdit = () => {
    if (editingEquipment) {
      updateEquipmentDetail({
        ...editingEquipment,
        serialNo: serialNumberText.trim(),
        note: noteText.trim()
      });
      setEditingEquipment(null);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            ລາຍການອຸປະກອນຕາມເມືອງ (Equipment Info)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ຖານຂໍ້ມູນອຸປະກອນວັດແທກ ແລະ GNSS ແບ່ງຕາມ 148+ ເມືອງທົ່ວປະເທດ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Batch Printable QR Labels Button */}
          <button
            onClick={() => handleOpenQRLabel(null)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
            title="ສ້າງ ແລະ ດາວໂຫຼດປ້າຍ QR ອຸປະກອນສຳລັບພິມ"
          >
            <Tag className="w-4 h-4" />
            <span>ພິມປ້າຍ QR (QR Labels)</span>
          </button>

          {/* QR Code Scanner Button */}
          <button
            onClick={() => setShowQRScanner(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
            title="ສະແກນ QR Code ເພື່ອກວດປະຫວັດອຸປະກອນ"
          >
            <QrCode className="w-4 h-4" />
            <span>ສະແກນ QR ແທັກ</span>
          </button>

          {/* 3D Inspector Button */}
          <button
            onClick={() => setShow3DViewer(!show3DViewer)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
              show3DViewer
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-700 text-white'
            }`}
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>{show3DViewer ? 'ເຊື່ອງ 3D' : '3D Viewer'}</span>
          </button>
        </div>
      </div>

      {/* Printable QR Code Label Generator Modal */}
      <EquipmentQRLabelModal
        isOpen={showQRLabelModal}
        onClose={() => setShowQRLabelModal(false)}
        initialEquipment={selectedLabelEquipment}
        equipmentList={filteredEquipment.length > 0 ? filteredEquipment : equipment}
      />

      {/* QR Code Camera Scanner Modal */}
      <QRCodeScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        equipmentList={equipment}
        repairsList={repairs}
        onSelectRepair={(repair) => {
          selectRepair(repair);
          navigateTo('repair_details');
        }}
        onOpen3DViewer={(modelType) => {
          setModel3DTarget(modelType);
          setShow3DViewer(true);
        }}
      />

      {/* 3D Surveying Equipment Viewer Section */}
      {show3DViewer && (
        <div className="space-y-2">
          <Equipment3DViewer initialModel={model3DTarget} onClose={() => setShow3DViewer(false)} />
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ຄົ້ນຫາ Unique ID (EQ-0001), ລະຫັດເມືອງ, ຊື່ເມືອງ, ລຸ້ນອຸປະກອນ, S/N..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden focus:border-sky-500 shadow-2xs"
        />
      </div>

      {/* Horizontal scrolling Province Filters */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-500 block">
          ແຍກຕາມແຂວງ:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {provincesList.map((province) => {
            const isSelected = province === provinceFilter;
            return (
              <button
                key={province}
                onClick={() => setProvinceFilter(province)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {province}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment List */}
      {filteredEquipment.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          ບໍ່ພົບຂໍ້ມູນອຸປະກອນທີ່ກົງກັບເງື່ອນໄຂ
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEquipment.map((eq) => {
            const uniqueId = formatEquipmentUniqueId(eq.id);
            return (
              <div
                key={eq.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 hover:border-sky-400 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 dark:bg-amber-500/20 text-amber-400 dark:text-amber-300 font-mono font-bold text-[11px]">
                        {uniqueId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs">
                        ເມືອງ: {eq.districtCode}
                      </span>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        ສະຖານທີ່: {eq.districtNameLao}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      District Name: {eq.districtNameEng}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs shrink-0">
                    {eq.model}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 block mb-0.5">ແຂວງ:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {eq.provinceName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 block mb-0.5">
                      Serial Number (S/N):
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        eq.serialNo ? 'text-slate-900 dark:text-white' : 'text-red-500'
                      }`}
                    >
                      {eq.serialNo || 'ບໍ່ມີຂໍ້ມູນ S/N'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 flex-1 truncate">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      ບັນທຶກ: {eq.note || 'ບໍ່ມີບັນທຶກ'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenQRLabel(eq)}
                      title="ສ້າງ ແລະ ດາວໂຫຼດປ້າຍ QR ຂອງອຸປະກອນນີ້"
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>ປ້າຍ QR</span>
                      <Download className="w-3 h-3 opacity-75" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(eq)}
                      title="ແກ້ໄຂຂໍ້ມູນອຸປະກອນ"
                      className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shrink-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Equipment Modal */}
      {editingEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ແກ້ໄຂຂໍ້ມູນອຸປະກອນ (ເມືອງ {editingEquipment.districtNameLao})
            </h3>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl space-y-1">
                <p className="text-slate-500">
                  ລະຫັດເມືອງ: <strong>{editingEquipment.districtCode}</strong> ({editingEquipment.districtNameEng})
                </p>
                <p className="text-slate-500">
                  ແຂວງ: <strong>{editingEquipment.provinceName}</strong>
                </p>
                <p className="text-slate-500">
                  ລຸ້ນອຸປະກອນ: <strong className="text-amber-600">{editingEquipment.model}</strong>
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Serial Number (S/N)
                </label>
                <input
                  type="text"
                  value={serialNumberText}
                  onChange={(e) => setSerialNumberText(e.target.value)}
                  placeholder="SN-XXXX-XXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ບັນທຶກເພີ່ມເຕີມ / Note
                </label>
                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="ສະພາບເຄື່ອງ, ການມອບໝາຍ, ສະຖານະ..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingEquipment(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold text-xs transition-colors"
              >
                ຍົກເລີກ
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
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
