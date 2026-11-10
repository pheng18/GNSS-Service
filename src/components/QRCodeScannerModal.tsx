import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  X,
  FlipHorizontal,
  Upload,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Calendar,
  User,
  Clock,
  Box,
  ExternalLink,
  RefreshCw,
  QrCode,
  Tag,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Equipment, Repair } from '../types';

interface QRCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  repairsList: Repair[];
  onSelectRepair?: (repair: Repair) => void;
  onOpen3DViewer?: (modelType: 'TS16' | 'GNSS' | 'LEVEL') => void;
}

export const QRCodeScannerModal: React.FC<QRCodeScannerModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  repairsList,
  onSelectRepair,
  onOpen3DViewer
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  // Matched Result State
  const [matchedEquipment, setMatchedEquipment] = useState<Equipment | null>(null);
  const [matchedRepairs, setMatchedRepairs] = useState<Repair[]>([]);

  // Sound beep feedback using Web Audio API
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Find matching equipment and repairs from raw QR text
  const processScannedCode = useCallback(
    (rawCode: string) => {
      const trimmed = rawCode.trim();
      setScannedCode(trimmed);
      setIsScanning(false);
      playBeep();

      // Search equipment by Unique ID (EQ-XXXX), Serial Number, or District Code
      const cleanSearch = trimmed.toLowerCase().replace(/^sn[:\s-]*/i, '');
      const eqIdMatch = trimmed.match(/EQ-0*(\d+)/i);
      const parsedNumericId = eqIdMatch ? Number(eqIdMatch[1]) : Number.NaN;

      const foundEq = equipmentList.find((eq) => {
        const eqSn = eq.serialNo.toLowerCase().replace(/^sn[:\s-]*/i, '');
        const formattedUid = `eq-${String(eq.id).padStart(4, '0')}`;
        return (
          (!Number.isNaN(parsedNumericId) && eq.id === parsedNumericId) ||
          cleanSearch === formattedUid ||
          cleanSearch === `eq-${eq.id}` ||
          (eqSn &&
            (eqSn === cleanSearch ||
              cleanSearch.includes(eqSn) ||
              eq.serialNo.toLowerCase().includes(cleanSearch))) ||
          eq.districtCode === trimmed ||
          trimmed.includes(`DIST:${eq.districtCode}`) ||
          cleanSearch.includes(eq.districtCode.toLowerCase()) ||
          trimmed.toLowerCase().includes(eq.districtNameEng.toLowerCase())
        );
      });

      // Search linked repair history
      const linkedRepairs = repairsList.filter((r) => {
        const rSn = r.serialNo.toLowerCase().replace(/^sn[:\s-]*/i, '');
        const rId = r.id.toLowerCase();
        return (
          rSn === cleanSearch ||
          rId === cleanSearch ||
          (foundEq &&
            foundEq.serialNo &&
            r.serialNo.toLowerCase().includes(foundEq.serialNo.toLowerCase())) ||
          r.model.toLowerCase().includes(cleanSearch)
        );
      });

      setMatchedEquipment(foundEq || null);
      setMatchedRepairs(linkedRepairs);
    },
    [equipmentList, repairsList]
  );

  // Camera stream setup
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('ກ້ອງຖ່າຍຮູບບໍ່ຮອງຮັບໃນ Browser ນີ້ (getUserMedia not supported)');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError(
        'ບໍ່ສາມາດເປີດກ້ອງໄດ້ ກະລຸນາກວດສອບສິດອະນຸຍາດ Camera Permissions ຫຼື ທົດລອງເລືອກ QR Sample ດ້ານລຸ່ມ'
      );
    }
  }, [cameraFacing]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Continuous frame analysis loop with jsQR
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    const scanFrame = () => {
      if (
        isScanning &&
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            processScannedCode(code.data);
            return;
          }
        }
      }
      animationFrameId.current = requestAnimationFrame(scanFrame);
    };

    animationFrameId.current = requestAnimationFrame(scanFrame);

    return () => {
      stopCamera();
    };
  }, [isOpen, isScanning, startCamera, stopCamera, processScannedCode]);

  // Image file QR decoder
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            processScannedCode(code.data);
          } else {
            setCameraError('ບໍ່ພົບ QR Code ໃນຮູບພາບທີ່ເລືອກ ກະລຸນາເລືອກຮູບປ້າຍ QR ໃໝ່');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Reset to scan again
  const handleScanAgain = () => {
    setScannedCode(null);
    setMatchedEquipment(null);
    setMatchedRepairs([]);
    setIsScanning(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                ສະແກນ QR Code ກວດສອບອຸປະກອນ
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ກວດປະຫວັດການສ້ອມແປງ & Calibration ຜ່ານກ້ອງຖ່າຍຮູບ
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

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Active Scanner Viewfinder */}
          {isScanning ? (
            <div className="space-y-3">
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700 shadow-inner flex items-center justify-center">
                {/* Live Video Element */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  autoPlay
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Reticle / Viewfinder Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-56 h-56 border-2 border-amber-400/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                    {/* Reticle Corners */}
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

                    {/* Animated Scanning Laser Line */}
                    <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ef4444] animate-pulse top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Camera Overlay Controls */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white">
                  <button
                    onClick={() =>
                      setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'))
                    }
                    className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 hover:bg-black/80 flex items-center gap-1.5 font-bold transition-colors"
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>ສັບປ່ຽນກ້ອງ</span>
                  </button>

                  <label className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 hover:bg-black/80 flex items-center gap-1.5 font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>ອັບໂຫລດຮູບ</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Error Banner if Camera unavailable */}
                {cameraError && (
                  <div className="absolute inset-0 bg-slate-900/90 p-6 flex flex-col items-center justify-center text-center space-y-2 z-10">
                    <AlertCircle className="w-8 h-8 text-amber-400" />
                    <p className="text-xs text-slate-200 max-w-xs">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="mt-2 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>ລອງເປີດກ້ອງໃໝ່</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Sample Tags for Instant Testing */}
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>ຄລິກທົດສອບແທັກຕົວຢ່າງ (Sample Equipment Tags):</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { code: 'SN: 894521', label: 'Leica TS16 (ມີປະຫວັດສ້ອມ EDM)' },
                    { code: 'SN: 624190', label: 'Trimble R12i (ມີປະຫວັດປ່ຽນບອດ RTK)' },
                    { code: 'SN: 431055', label: 'Digital Level LS15 (ປ່ຽນຈໍ LCD)' },
                    { code: 'SN-AA450-101', label: 'AA450 (ຈັນທະບູລີ)' },
                    { code: 'SN-C500-104', label: 'C5 (ສີສັດຕະນາກ)' },
                  ].map((sample) => (
                    <button
                      key={sample.code}
                      onClick={() => processScannedCode(sample.code)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-medium hover:border-amber-400 hover:text-amber-600 transition-colors"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Scanned Result & Maintenance History View */
            <div className="space-y-4">
              {/* Scan Success Header Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                      ກວດພົບ QR Tag ສຳເລັດແລ້ວ!
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                      ລະຫັດ: {scannedCode}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleScanAgain}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ສະແກນໃໝ່</span>
                </button>
              </div>

              {/* Matched Equipment Details Card */}
              {matchedEquipment ? (
                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-mono font-bold text-xs">
                          {matchedEquipment.districtCode}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          ເມືອງ {matchedEquipment.districtNameLao} ({matchedEquipment.districtNameEng})
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500">
                        ແຂວງ: <strong>{matchedEquipment.provinceName}</strong>
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
                      {matchedEquipment.model}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Serial Number:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {matchedEquipment.serialNo || 'ບໍ່ມີຂໍ້ມູນ S/N'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">ສະພາບປະຈຸບັນ:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {matchedEquipment.note || 'ປົກກະຕິ'}
                      </span>
                    </div>
                  </div>

                  {onOpen3DViewer && (
                    <button
                      onClick={() => {
                        const m = matchedEquipment.model.toLowerCase();
                        let target: 'TS16' | 'GNSS' | 'LEVEL' = 'TS16';
                        if (m.includes('gnss') || m.includes('rtk') || m.includes('r12') || m.includes('ug')) {
                          target = 'GNSS';
                        } else if (m.includes('level') || m.includes('ls')) {
                          target = 'LEVEL';
                        }
                        onClose();
                        onOpen3DViewer(target);
                      }}
                      className="w-full py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Box className="w-4 h-4 text-amber-400" />
                      <span>ເບິ່ງໂຄງສ້າງ ແລະ ກວດສອບອຸປະກອນ 3D (Open 3D Inspector)</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-xs text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  ບໍ່ພົບລາຍຊື່ອຸປະກອນຕົ້ນສະບັບໃນຖານຂໍ້ມູນເມືອງ, ແຕ່ກວດພົບປະຫວັດການສ້ອມແປງທີ່ກ່ຽວຂ້ອງດ້ານລຸ່ມ:
                </div>
              )}

              {/* Maintenance & Repair History Timeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-blue-500" />
                    <span>ປະຫວັດການສ້ອມແປງ & Calibration ({matchedRepairs.length} ລາຍການ)</span>
                  </h4>
                </div>

                {matchedRepairs.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                    ບໍ່ມີປະຫວັດການສ້ອມແປງຄົງຄ້າງສຳລັບອຸປະກອນນີ້ (ອຸປະກອນຢູ່ໃນສະພາບປົກກະຕິ)
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {matchedRepairs.map((repair) => (
                      <div
                        key={repair.id}
                        className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5 hover:border-blue-400 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                              {repair.id}
                            </span>
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                              {repair.title}
                            </h5>
                            <p className="text-[11px] text-slate-400">
                              ລູກຄ້າ: {repair.client} • ວັນທີຮັບ: {repair.receivedDate}
                            </p>
                          </div>

                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 shrink-0">
                            {repair.status}
                          </span>
                        </div>

                        <div className="text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl space-y-1">
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong>ອາການເສຍ:</strong> {repair.problem}
                          </p>
                          {repair.solution && (
                            <p className="text-emerald-700 dark:text-emerald-400">
                              <strong>ວິທີແກ້ໄຂ:</strong> {repair.solution}
                            </p>
                          )}
                          <p className="text-slate-500 text-[11px] flex items-center gap-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>ຊ່າງຮັບຜິດຊອບ: {repair.assignedTech}</span>
                          </p>
                        </div>

                        {/* Timeline snippet */}
                        {repair.timeline && repair.timeline.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] font-bold text-slate-400 block">
                              ຂັ້ນຕອນການດຳເນີນງານ:
                            </span>
                            <div className="space-y-1">
                              {repair.timeline.map((step) => (
                                <div
                                  key={step.id}
                                  className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        step.status === 'done'
                                          ? 'bg-emerald-500'
                                          : step.status === 'active'
                                          ? 'bg-blue-500'
                                          : 'bg-slate-300'
                                      }`}
                                    />
                                    <span>{step.title}</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400">{step.date}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {onSelectRepair && (
                          <button
                            onClick={() => {
                              onSelectRepair(repair);
                              onClose();
                            }}
                            className="w-full py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>ເປີດເບິ່ງລາຍລະອຽດໃບສ້ອມແປງເຕັມ</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
