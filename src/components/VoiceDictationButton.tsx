import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Sparkles, Volume2, AlertCircle } from 'lucide-react';

interface VoiceDictationButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  fieldLabel?: string;
}

// Common technical service voice presets for fast technician dictation
const TECH_SERVICE_PRESETS = [
  "EDM Error E102 ບໍ່ສາມາດວັດແທກໄລຍະທາງໃນໂໝດ Prism ໄດ້",
  "ຈໍ LCD ເສຍຫາຍ ລະບົບສຳຜັດບໍ່ຕອບສະໜອງ ຕ້ອງການປ່ຽນຈໍໃໝ່",
  "ບໍ່ຮັບສັນຍານດາວທຽມ RTK ບອດ GPS ພາຍໃນມີຄວາມຊື້ນ",
  "ແບັດເຕີຣີເສື່ອມ ແລະ ສາຍສາກບໍ່ເຂົ້າ ຕ້ອງການກວດເຊັກລະບົບໄຟ",
  "Optical Alignment ເຄື່ອນຍ້າຍຈາກມາດຕະຖານ ຕ້ອງການປັບຈູນ Calibration ໃໝ່"
];

export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  onTranscript,
  className = '',
  fieldLabel = 'ອາການເສຍຫາຍ'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        // Lao language primary, fallback if engine allows
        recognition.lang = 'lo-LA';

        recognition.onstart = () => {
          setIsRecording(true);
          setErrorMessage(null);
          setRecordingSeconds(0);
          timerRef.current = setInterval(() => {
            setRecordingSeconds((prev) => prev + 1);
          }, 1000);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          if (currentTranscript.trim()) {
            onTranscript(currentTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setErrorMessage('ກະລຸນາອະນຸຍາດໄມໂຄຣໂຟນໃນບຣາວເຊີ');
          } else if (event.error === 'no-speech') {
            // benign
          } else {
            setErrorMessage(`ສຽງບໍ່ຊັດເຈນ ຫຼື ບໍ່ຮອງຮັບ: ${event.error}`);
          }
          stopRecording();
        };

        recognition.onend = () => {
          stopRecording();
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Could not initialize SpeechRecognition:', err);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort errors
        }
      }
    };
  }, [onTranscript]);

  const startRecording = () => {
    setErrorMessage(null);
    if (!recognitionRef.current) {
      // If browser doesn't have Web Speech API, show voice presets & warning
      setErrorMessage('ບຣາວເຊີບໍ່ຮອງຮັບ Web Speech API ໂດຍກົງ. ເລືອກຂໍ້ຄວາມສຽງດ່ວນໄດ້:');
      setShowPresets(true);
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Error starting speech recognition:', err);
      // If already started or restricted, try restarting
      try {
        recognitionRef.current.abort();
        recognitionRef.current.start();
      } catch {
        setShowPresets(true);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore stop errors
      }
    }
  };

  const toggleRecording = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSelectPreset = (presetText: string) => {
    onTranscript(presetText);
    setShowPresets(false);
  };

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          data-testid="voice_to_text_button"
          onClick={toggleRecording}
          title={isRecording ? "ກົດເພື່ອຢຸດບັນທຶກສຽງ" : "ກົດເພື່ອເວົ້າບັນທຶກສຽງ (Voice-to-Text)"}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-2 ring-red-300'
              : 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>ຢຸດບັນທຶກ ({recordingSeconds}s)</span>
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>ເວົ້າບັນທຶກສຽງ (Voice)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          title="ຂໍ້ຄວາມສຽງດ່ວນທາງເຕັກນິກ"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recording status banner */}
      {isRecording && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>ກຳລັງຟັງສຽງເວົ້າຂອງຊ່າງເຕັກນິກ... ກະລຸນາເວົ້າບັນທຶກອາການ</span>
        </div>
      )}

      {/* Error / Fallback alert */}
      {errorMessage && !isRecording && (
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Voice Dictation Presets Dropdown/Drawer */}
      {showPresets && (
        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-xs space-y-1.5 max-w-sm z-20">
          <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300 text-[11px]">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-blue-600" />
              <span>ຂໍ້ຄວາມສຽງທາງເຕັກນິກດ່ວນ (Quick Voice Templates):</span>
            </span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1">
            {TECH_SERVICE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="w-full text-left p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40 text-[11px] text-slate-700 dark:text-slate-300 font-medium transition-colors border border-transparent hover:border-blue-200"
              >
                • {preset}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
