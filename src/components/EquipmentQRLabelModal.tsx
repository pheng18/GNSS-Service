import React, { useEffect, useRef, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  X,
  Check,
  Copy,
  Layers,
  Tag,
  Sparkles,
  CheckSquare,
  Square,
  FileDown,
  Sliders
} from 'lucide-react';
import { Equipment } from '../types';

interface EquipmentQRLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEquipment: Equipment | null;
  equipmentList: Equipment[];
}

type PayloadFormat = 'full_tag' | 'unique_id' | 'serial_only';
type LabelSize = 'standard' | 'large' | 'compact';
type LabelTheme = 'industrial' | 'thermal';

export const formatEquipmentUniqueId = (id: number): string => {
  return `EQ-${String(id).padStart(4, '0')}`;
};

export const buildEquipmentQRPayload = (
  eq: Equipment,
  format: PayloadFormat = 'full_tag'
): string => {
  const uniqueId = formatEquipmentUniqueId(eq.id);
  const sn = eq.serialNo?.trim() || uniqueId;
  if (format === 'unique_id') {
    return uniqueId;
  }
  if (format === 'serial_only') {
    return sn;
  }
  return `UNIQTEK|ID:${uniqueId}|SN:${sn}|DIST:${eq.districtCode}|MODEL:${eq.model}`;
};

export const EquipmentQRLabelModal: React.FC<EquipmentQRLabelModalProps> = ({
  isOpen,
  onClose,
  initialEquipment,
  equipmentList
}) => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [selectedEqId, setSelectedEqId] = useState<number>(
    initialEquipment?.id || equipmentList[0]?.id || 1
  );
  const [payloadFormat, setPayloadFormat] = useState<PayloadFormat>('full_tag');
  const [labelSize, setLabelSize] = useState<LabelSize>('standard');
  const [labelTheme, setLabelTheme] = useState<LabelTheme>('industrial');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Batch mode selection state
  const [selectedBatchIds, setSelectedBatchIds] = useState<number[]>([]);
  const [batchProvinceFilter, setBatchProvinceFilter] = useState<string>('ທັງໝົດ');

  const singleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (initialEquipment) {
      setSelectedEqId(initialEquipment.id);
      setMode('single');
    } else if (equipmentList.length > 0) {
      setSelectedEqId(equipmentList[0].id);
      setMode('batch');
    }
  }, [initialEquipment, equipmentList, isOpen]);

  // Initialize default batch selection (first 8 items)
  useEffect(() => {
    if (equipmentList.length > 0 && selectedBatchIds.length === 0) {
      setSelectedBatchIds(equipmentList.slice(0, 8).map((item) => item.id));
    }
  }, [equipmentList, selectedBatchIds.length]);

  const currentEquipment =
    equipmentList.find((e) => e.id === selectedEqId) ||
    initialEquipment ||
    equipmentList[0];

  const provinces = [
    'ທັງໝົດ',
    ...Array.from(new Set(equipmentList.map((e) => e.provinceName)))
  ];

  const filteredBatchEquipment = equipmentList.filter((eq) =>
    batchProvinceFilter === 'ທັງໝົດ'
      ? true
      : eq.provinceName.includes(batchProvinceFilter)
  );

  // Helper to draw a single printable label onto any 2D canvas context
  const drawSingleLabelOnContext = useCallback(
    async (
      ctx: CanvasRenderingContext2D,
      eq: Equipment,
      x: number,
      y: number,
      width: number,
      height: number,
      format: PayloadFormat,
      theme: LabelTheme
    ) => {
      const uniqueId = formatEquipmentUniqueId(eq.id);
      const qrData = buildEquipmentQRPayload(eq, format);

      // Generate QR code onto an offscreen canvas
      const qrSize = Math.floor(height * 0.66);
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, qrData, {
        width: qrSize,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });

      ctx.save();
      ctx.translate(x, y);

      // Card background
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, width - 8, height - 8, 16);
      ctx.fill();
      ctx.stroke();

      // Inner dashed cut / border frame
      ctx.strokeStyle = theme === 'industrial' ? '#f59e0b' : '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(12, 12, width - 24, height - 24);
      ctx.setLineDash([]);

      // Top Header Banner
      const headerHeight = Math.floor(height * 0.19);
      ctx.fillStyle = theme === 'industrial' ? '#0f172a' : '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(14, 14, width - 28, headerHeight, [10, 10, 0, 0]);
      ctx.fill();

      if (theme === 'thermal') {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(14, 14 + headerHeight);
        ctx.lineTo(width - 14, 14 + headerHeight);
        ctx.stroke();
      }

      // Brand stripe accent
      if (theme === 'industrial') {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(14, 14 + headerHeight - 5, width - 28, 5);
      }

      // Header Left: Brand title
      ctx.fillStyle = theme === 'industrial' ? '#f59e0b' : '#0f172a';
      ctx.font = `900 ${Math.floor(height * 0.062)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('UNIQTEK SURVEYING ASSET', 28, 14 + headerHeight / 2 - 2);

      // Header Right: Unique ID Pill
      const idBadgeWidth = Math.floor(width * 0.25);
      const idBadgeHeight = Math.floor(headerHeight * 0.64);
      const idBadgeX = width - 28 - idBadgeWidth;
      const idBadgeY = 14 + (headerHeight - idBadgeHeight) / 2 - 2;

      ctx.fillStyle = theme === 'industrial' ? '#f59e0b' : '#0f172a';
      ctx.beginPath();
      ctx.roundRect(idBadgeX, idBadgeY, idBadgeWidth, idBadgeHeight, 6);
      ctx.fill();

      ctx.fillStyle = theme === 'industrial' ? '#0f172a' : '#ffffff';
      ctx.font = `900 ${Math.floor(height * 0.055)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(uniqueId, idBadgeX + idBadgeWidth / 2, idBadgeY + idBadgeHeight / 2 + 1);

      // Body area coordinates
      const bodyTop = 18 + headerHeight;
      const bodyHeight = height - bodyTop - 36;

      // Draw QR Code Box on Left
      const qrBoxX = 26;
      const qrBoxY = bodyTop + Math.max(4, Math.floor((bodyHeight - qrSize) / 2));

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(qrBoxX - 4, qrBoxY - 4, qrSize + 8, qrSize + 8);
      ctx.drawImage(qrCanvas, qrBoxX, qrBoxY, qrSize, qrSize);

      // Equipment Metadata on Right
      const infoX = qrBoxX + qrSize + 22;
      const maxInfoWidth = width - infoX - 26;
      let cursorY = qrBoxY + 14;
      const lineStep = Math.floor(height * 0.095);

      ctx.textAlign = 'left';

      // 1. Equipment Unique ID + Model
      ctx.fillStyle = '#64748b';
      ctx.font = `700 ${Math.floor(height * 0.042)}px Inter, sans-serif`;
      ctx.fillText('MODEL / ລຸ້ນອຸປະກອນ:', infoX, cursorY);
      cursorY += Math.floor(lineStep * 0.85);

      ctx.fillStyle = '#0f172a';
      ctx.font = `900 ${Math.floor(height * 0.068)}px Inter, sans-serif`;
      ctx.fillText(eq.model || 'Surveying Instrument', infoX, cursorY, maxInfoWidth);
      cursorY += Math.floor(lineStep * 1.05);

      // 2. Serial Number
      ctx.fillStyle = '#64748b';
      ctx.font = `700 ${Math.floor(height * 0.042)}px Inter, sans-serif`;
      ctx.fillText('SERIAL NO (S/N):', infoX, cursorY);
      cursorY += Math.floor(lineStep * 0.85);

      ctx.fillStyle = '#0f172a';
      ctx.font = `800 ${Math.floor(height * 0.06)}px monospace`;
      ctx.fillText(eq.serialNo || uniqueId, infoX, cursorY, maxInfoWidth);
      cursorY += Math.floor(lineStep * 1.05);

      // 3. District & Code
      ctx.fillStyle = '#64748b';
      ctx.font = `700 ${Math.floor(height * 0.042)}px Inter, sans-serif`;
      ctx.fillText('LOCATION / ລະຫັດເມືອງ:', infoX, cursorY);
      cursorY += Math.floor(lineStep * 0.85);

      ctx.fillStyle = '#0f172a';
      ctx.font = `800 ${Math.floor(height * 0.052)}px Inter, sans-serif`;
      ctx.fillText(
        `[${eq.districtCode}] ເມືອງ${eq.districtNameLao}`,
        infoX,
        cursorY,
        maxInfoWidth
      );
      cursorY += Math.floor(lineStep * 0.82);

      ctx.fillStyle = '#334155';
      ctx.font = `600 ${Math.floor(height * 0.046)}px Inter, sans-serif`;
      ctx.fillText(
        `ແຂວງ: ${eq.provinceName} (${eq.districtNameEng})`,
        infoX,
        cursorY,
        maxInfoWidth
      );

      // Footer Bar
      const footerY = height - 24;
      ctx.fillStyle = '#475569';
      ctx.font = `700 ${Math.floor(height * 0.036)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(
        `SCAN QR TAG TO VIEW SERVICE & CALIBRATION LOG • ID: ${uniqueId}`,
        width / 2,
        footerY
      );

      ctx.restore();
    },
    []
  );

  // Render preview canvas whenever options change
  useEffect(() => {
    if (!isOpen || !currentEquipment || !singleCanvasRef.current) return;

    const canvas = singleCanvasRef.current;
    const dimensions =
      labelSize === 'large'
        ? { w: 800, h: 500 }
        : labelSize === 'compact'
        ? { w: 600, h: 360 }
        : { w: 720, h: 460 };

    canvas.width = dimensions.w;
    canvas.height = dimensions.h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, dimensions.w, dimensions.h);
    drawSingleLabelOnContext(
      ctx,
      currentEquipment,
      0,
      0,
      dimensions.w,
      dimensions.h,
      payloadFormat,
      labelTheme
    );
  }, [
    isOpen,
    currentEquipment,
    payloadFormat,
    labelSize,
    labelTheme,
    drawSingleLabelOnContext
  ]);

  if (!isOpen || !currentEquipment) return null;

  const uniqueIdString = formatEquipmentUniqueId(currentEquipment.id);
  const currentPayload = buildEquipmentQRPayload(currentEquipment, payloadFormat);

  // Download single label as PNG
  const handleDownloadSinglePNG = () => {
    if (!singleCanvasRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = singleCanvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const safeSn = (currentEquipment.serialNo || uniqueIdString).replace(
        /[^a-zA-Z0-9-_]/g,
        '_'
      );
      link.download = `UniqTek_QR_Label_${uniqueIdString}_${currentEquipment.districtCode}_${safeSn}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setIsDownloading(false), 300);
    }
  };

  // Download multi-label sheet as a high-res PNG for printing
  const handleDownloadBatchSheetPNG = async () => {
    const itemsToPrint = equipmentList.filter((e) =>
      selectedBatchIds.includes(e.id)
    );
    if (itemsToPrint.length === 0) return;

    setIsDownloading(true);
    try {
      const cols = 2;
      const rows = Math.ceil(itemsToPrint.length / cols);
      const cardW = 680;
      const cardH = 420;
      const pad = 28;
      const headerSpace = 90;

      const sheetCanvas = document.createElement('canvas');
      sheetCanvas.width = cols * cardW + (cols + 1) * pad;
      sheetCanvas.height = headerSpace + rows * cardH + (rows + 1) * pad;

      const ctx = sheetCanvas.getContext('2d');
      if (!ctx) return;

      // White sheet background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

      // Sheet Header Title
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 28px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        `UNIQTEK TECHNICAL SERVICE — PRINTABLE QR ASSET LABELS (${itemsToPrint.length} ITEMS)`,
        pad,
        46
      );

      ctx.fillStyle = '#64748b';
      ctx.font = '600 18px monospace';
      ctx.fillText(
        `Generated: ${new Date().toISOString().slice(0, 10)} • Cut along dashed lines`,
        pad,
        74
      );

      for (let i = 0; i < itemsToPrint.length; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = pad + col * (cardW + pad);
        const y = headerSpace + pad + row * (cardH + pad);

        await drawSingleLabelOnContext(
          ctx,
          itemsToPrint[i],
          x,
          y,
          cardW,
          cardH,
          payloadFormat,
          labelTheme
        );
      }

      const dataUrl = sheetCanvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `UniqTek_QR_Labels_Sheet_${itemsToPrint.length}_Items.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setIsDownloading(false), 400);
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(currentPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBatchItem = (id: number) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredBatchEquipment.map((e) => e.id);
    const allSelected = filteredIds.every((id) => selectedBatchIds.includes(id));
    if (allSelected) {
      setSelectedBatchIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedBatchIds, ...filteredIds]));
      setSelectedBatchIds(merged);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                ສ້າງ ແລະ ດາວໂຫຼດປ້າຍ QR ອຸປະກອນ (Printable QR Code Labels)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ສ້າງສະຕິກເກີ QR ຕາມລະຫັດ Unique ID ເພື່ອຕິດໃສ່ອຸປະກອນສຳລັບສະແກນກວດປະຫວັດໄວຂຶ້ນ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-4 pt-3 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'single'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>ປ້າຍ QR ລາຍເຄື່ອງ (Single Label)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('batch')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'batch'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ພິມແຜ່ນປ້າຍລວມ (Batch Sheet • {selectedBatchIds.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Shared Label Customization Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-amber-500" />
                <span>ຂໍ້ມູນໃນລະຫັດ QR:</span>
              </label>
              <select
                value={payloadFormat}
                onChange={(e) => setPayloadFormat(e.target.value as PayloadFormat)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs outline-hidden focus:border-amber-500"
              >
                <option value="full_tag">Full Tag (Unique ID + S/N + ເມືອງ)</option>
                <option value="unique_id">Unique ID ເທົ່ານັ້ນ (EQ-XXXX)</option>
                <option value="serial_only">Serial Number ເທົ່ານັ້ນ (S/N)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                ຂະໜາດປ້າຍສະຕິກເກີ:
              </label>
              <select
                value={labelSize}
                onChange={(e) => setLabelSize(e.target.value as LabelSize)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs outline-hidden focus:border-amber-500"
              >
                <option value="standard">ມາດຕະຖານ 60 × 40 mm (300 DPI)</option>
                <option value="large">ປ້າຍຊັບສິນໃຫຍ່ 80 × 50 mm</option>
                <option value="compact">ກະທັດຮັດ 50 × 30 mm</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                ຮູບແບບສີປ້າຍ (Theme):
              </label>
              <select
                value={labelTheme}
                onChange={(e) => setLabelTheme(e.target.value as LabelTheme)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs outline-hidden focus:border-amber-500"
              >
                <option value="industrial">UniqTek Industrial (ດຳ-ເຫຼືອງ)</option>
                <option value="thermal">ຂາວ-ດຳ (Thermal Printer)</option>
              </select>
            </div>
          </div>

          {mode === 'single' ? (
            <div className="space-y-4">
              {/* Equipment Selector Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ເລືອກອຸປະກອນທີ່ຕ້ອງການສ້າງປ້າຍ QR:
                </label>
                <select
                  value={currentEquipment.id}
                  onChange={(e) => setSelectedEqId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white outline-hidden focus:border-amber-500"
                >
                  {equipmentList.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {formatEquipmentUniqueId(eq.id)} • [{eq.districtCode}] ເມືອງ{eq.districtNameLao} ({eq.provinceName}) — {eq.model} ({eq.serialNo || 'ບໍ່ມີ S/N'})
                    </option>
                  ))}
                </select>
              </div>

              {/* High-Resolution Printable Label Preview */}
              <div className="bg-slate-100 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center justify-between w-full text-[11px] text-slate-500 dark:text-slate-400 px-1">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>ຕົວຢ່າງປ້າຍສະຕິກເກີພ້ອມພິມ (Live High-DPI Label Preview)</span>
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    Unique ID: {uniqueIdString}
                  </span>
                </div>

                <div className="w-full max-w-md bg-white p-2 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center">
                  <canvas
                    ref={singleCanvasRef}
                    className="w-full h-auto rounded-xl"
                  />
                </div>

                {/* Encoded QR Payload String + Copy */}
                <div className="w-full flex items-center justify-between gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="truncate flex-1">
                    <span className="text-slate-400 text-[10px] block">
                      ລະຫັດ QR ທີ່ຝັງຢູ່ໃນປ້າຍ (Encoded QR Payload):
                    </span>
                    <code className="font-mono font-bold text-[11px] text-slate-800 dark:text-slate-200">
                      {currentPayload}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPayload}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1 shrink-0 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">ຄັດລອກແລ້ວ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>ຄັດລອກລະຫັດ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Download Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  ປິດໜ້າຕ່າງ
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSinglePNG}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isDownloading
                      ? 'ກຳລັງສ້າງໄຟລ໌ PNG...'
                      : `ດາວໂຫຼດປ້າຍ QR (${uniqueIdString}.png)`}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Batch Printable Sheet Mode */
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/70 dark:bg-amber-950/20 p-3 rounded-2xl border border-amber-200/70 dark:border-amber-800/40 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    ເລືອກລາຍການອຸປະກອນເພື່ອລວມເປັນແຜ່ນພິມດຽວ (Printable Multi-Label Sheet)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    ເລືອກແລ້ວ <strong>{selectedBatchIds.length}</strong> ລາຍການ • ດາວໂຫຼດເປັນໄຟລ໌ PNG ຄວາມລະອຽດສູງພ້ອມເສັ້ນຕັດສະຕິກເກີ
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={batchProvinceFilter}
                    onChange={(e) => setBatchProvinceFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleSelectAllFiltered}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
                  >
                    ເລືອກ/ຍົກເລີກທັງໝົດໃນແຂວງນີ້
                  </button>
                </div>
              </div>

              {/* Equipment Multi-Select Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredBatchEquipment.map((eq) => {
                  const isChecked = selectedBatchIds.includes(eq.id);
                  const uid = formatEquipmentUniqueId(eq.id);
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => toggleBatchItem(eq.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                        isChecked
                          ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="mt-0.5 text-amber-600 dark:text-amber-400 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-xs">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                            {uid} • [{eq.districtCode}]
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {eq.model}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          ເມືອງ{eq.districtNameLao} ({eq.provinceName})
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 truncate">
                          S/N: {eq.serialNo || 'ບໍ່ມີ S/N'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Batch Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500">
                  ແຜ່ນປ້າຍລວມຈັດລຽງແບບ 2 ຖັນ (2 Columns Grid) ພ້ອມພິມລົງເຈ້ຍສະຕິກເກີ A4
                </span>

                <button
                  type="button"
                  onClick={handleDownloadBatchSheetPNG}
                  disabled={selectedBatchIds.length === 0 || isDownloading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>
                    {isDownloading
                      ? 'ກຳລັງສ້າງແຜ່ນປ້າຍ QR...'
                      : `ດາວໂຫຼດແຜ່ນປ້າຍ QR ລວມ (${selectedBatchIds.length} ລາຍການ)`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
