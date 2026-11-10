import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Zap,
  Sliders,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Compass,
  X,
  Eye,
  Info
} from 'lucide-react';

interface Equipment3DViewerProps {
  initialModel?: 'TS16' | 'GNSS' | 'LEVEL';
  onClose?: () => void;
}

// Procedural LCD Display Texture
function createLcdTexture(modelType: string, angleH: string, angleV: string, dist: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Screen background (illuminated LCD amber/green matrix)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 256);

    // Inner bevel border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 496, 240);

    // Header banner
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(12, 12, 488, 36);
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`UNIQTEK GEO-SYSTEMS • [${modelType}]`, 24, 38);

    // Survey readings
    ctx.font = 'bold 28px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`HAR: ${angleH}`, 28, 90);
    ctx.fillText(`VA : ${angleV}`, 28, 135);

    ctx.fillStyle = '#4ade80';
    ctx.fillText(`EDM: ${dist} m`, 28, 180);

    // Status footer
    ctx.font = '16px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('PRISM: 0.0mm | BAT: 98% | RTK: FIX', 28, 225);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural Contact Shadow Texture
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.7)');
    gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.3)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export const Equipment3DViewer: React.FC<Equipment3DViewerProps> = ({
  initialModel = 'TS16',
  onClose
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const [activeModel, setActiveModel] = useState<'TS16' | 'GNSS' | 'LEVEL'>(initialModel);
  const [explodedVal, setExplodedVal] = useState<number>(0);
  const [laserActive, setLaserActive] = useState<boolean>(true);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedPart, setSelectedPart] = useState<string>('Overview');

  // Three.js instance references
  const animFrameId = useRef<number>(0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const laserBeamRef = useRef<THREE.Mesh | null>(null);
  const telescopePartRef = useRef<THREE.Group | null>(null);
  const alidadePartRef = useRef<THREE.Group | null>(null);
  const tribrachPartRef = useRef<THREE.Group | null>(null);
  const batteryPartRef = useRef<THREE.Group | null>(null);

  // Build Procedural Survey Instrument Model
  const buildModel = useCallback((type: 'TS16' | 'GNSS' | 'LEVEL', scene: THREE.Scene) => {
    if (modelGroupRef.current) {
      scene.remove(modelGroupRef.current);
    }

    const rootGroup = new THREE.Group();
    rootGroup.name = 'SurveyInstrument';

    // PBR Shared Materials with varying roughness & metalness
    const metallicBodyMat = new THREE.MeshStandardMaterial({
      color: type === 'TS16' ? 0xe2e8f0 : type === 'GNSS' ? 0x0284c7 : 0xf59e0b,
      metalness: 0.7,
      roughness: 0.25
    });

    const darkAnodizedMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.2
    });

    const rubberGripMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.05,
      roughness: 0.85
    });

    const brassKnobMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.15
    });

    const glassLensMat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 1.2,
      ior: 1.6
    });

    const lcdMat = new THREE.MeshStandardMaterial({
      map: createLcdTexture(
        type === 'TS16' ? 'TS16-TOTAL STATION' : type === 'GNSS' ? 'UG-80 GNSS RTK' : 'DL-32 DIGITAL LEVEL',
        "142°28'10\"",
        "89°15'32\"",
        '254.320'
      ),
      roughness: 0.3,
      metalness: 0.1
    });

    // 1. TRIBRACH BASE (Leveling Foot Screws + Base Plate + Spirit Bubble)
    const tribrachGroup = new THREE.Group();
    tribrachPartRef.current = tribrachGroup;

    // Triangular base plate
    const basePlateGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.2, 6);
    const basePlate = new THREE.Mesh(basePlateGeo, darkAnodizedMat);
    basePlate.position.y = 0.1;
    basePlate.castShadow = true;
    basePlate.receiveShadow = true;
    tribrachGroup.add(basePlate);

    // 3 Leveling Foot Screws
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const screwGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.45, 16);
      const screw = new THREE.Mesh(screwGeo, brassKnobMat);
      screw.position.set(Math.cos(angle) * 0.95, 0.3, Math.sin(angle) * 0.95);
      tribrachGroup.add(screw);

      const footPadGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.12, 16);
      const footPad = new THREE.Mesh(footPadGeo, rubberGripMat);
      footPad.position.set(Math.cos(angle) * 0.95, 0.06, Math.sin(angle) * 0.95);
      tribrachGroup.add(footPad);
    }

    // Circular Spirit Bubble
    const bubbleGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16);
    const bubbleMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.1 });
    const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    bubble.position.set(0.6, 0.24, 0.4);
    tribrachGroup.add(bubble);

    rootGroup.add(tribrachGroup);

    if (type === 'TS16') {
      // 2. ALIDADE MAIN BODY (Housing + LCD screen + Horizontal clamp + Battery)
      const alidadeGroup = new THREE.Group();
      alidadePartRef.current = alidadeGroup;

      const bodyGeo = new THREE.BoxGeometry(1.6, 2.2, 1.3);
      const body = new THREE.Mesh(bodyGeo, metallicBodyMat);
      body.position.y = 1.35;
      body.castShadow = true;
      body.receiveShadow = true;
      alidadeGroup.add(body);

      // Display Screen on Front Face
      const screenGeo = new THREE.PlaneGeometry(1.1, 0.65);
      const screen = new THREE.Mesh(screenGeo, lcdMat);
      screen.position.set(0, 1.35, 0.66);
      alidadeGroup.add(screen);

      // Dual Knobs (Horizontal & Vertical Clamp)
      const hKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.3, 16), brassKnobMat);
      hKnob.rotation.z = Math.PI / 2;
      hKnob.position.set(0.9, 0.7, 0.3);
      alidadeGroup.add(hKnob);

      // Battery Compartment on Side
      const batteryGroup = new THREE.Group();
      batteryPartRef.current = batteryGroup;
      const batteryGeo = new THREE.BoxGeometry(0.2, 0.8, 0.6);
      const battery = new THREE.Mesh(batteryGeo, darkAnodizedMat);
      battery.position.set(-0.85, 1.2, 0);
      batteryGroup.add(battery);
      alidadeGroup.add(batteryGroup);

      // Top Carry Handle
      const handleArmGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12);
      const handleArm1 = new THREE.Mesh(handleArmGeo, darkAnodizedMat);
      handleArm1.position.set(0.5, 2.65, 0);
      alidadeGroup.add(handleArm1);

      const handleArm2 = new THREE.Mesh(handleArmGeo, darkAnodizedMat);
      handleArm2.position.set(-0.5, 2.65, 0);
      alidadeGroup.add(handleArm2);

      const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 16), rubberGripMat);
      handleBar.rotation.z = Math.PI / 2;
      handleBar.position.set(0, 2.95, 0);
      alidadeGroup.add(handleBar);

      rootGroup.add(alidadeGroup);

      // 3. OPTICAL TELESCOPE & EDM UNIT
      const telescopeGroup = new THREE.Group();
      telescopePartRef.current = telescopeGroup;
      telescopeGroup.position.set(0, 1.65, 0);

      // Main Telescope Barrel
      const barrelGeo = new THREE.CylinderGeometry(0.38, 0.32, 2.2, 24);
      const barrel = new THREE.Mesh(barrelGeo, darkAnodizedMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.castShadow = true;
      telescopeGroup.add(barrel);

      // Objective Front Lens
      const lensGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.08, 24);
      const lens = new THREE.Mesh(lensGeo, glassLensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.z = 1.12;
      telescopeGroup.add(lens);

      // Focus Ring (Rubber Ribbed)
      const focusRing = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.35, 24), rubberGripMat);
      focusRing.rotation.x = Math.PI / 2;
      focusRing.position.z = 0.1;
      telescopeGroup.add(focusRing);

      // Eyepiece at back
      const eyepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.4, 24), darkAnodizedMat);
      eyepiece.rotation.x = Math.PI / 2;
      eyepiece.position.z = -1.2;
      telescopeGroup.add(eyepiece);

      // EDM Collimator Red Laser Beam
      const laserGeo = new THREE.CylinderGeometry(0.015, 0.015, 8.0, 8);
      const laserMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.85
      });
      const laserBeam = new THREE.Mesh(laserGeo, laserMat);
      laserBeam.rotation.x = Math.PI / 2;
      laserBeam.position.z = 5.15;
      laserBeamRef.current = laserBeam;
      laserBeam.visible = laserActive;
      telescopeGroup.add(laserBeam);

      rootGroup.add(telescopeGroup);
    } else if (type === 'GNSS') {
      // GNSS RTK ROVER (Antenna Dome + Range Pole Connector + Radio Antenna + Receiver Body)
      const gnssGroup = new THREE.Group();
      alidadePartRef.current = gnssGroup;

      // Circular Antenna Saucer Dome
      const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.4, 0.4, 32), metallicBodyMat);
      domeBase.position.y = 1.2;
      domeBase.castShadow = true;
      gnssGroup.add(domeBase);

      const domeTop = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2), darkAnodizedMat);
      domeTop.position.y = 1.4;
      domeTop.castShadow = true;
      gnssGroup.add(domeTop);

      // Status LED & Power Button Bar
      const statusBar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.1), rubberGripMat);
      statusBar.position.set(0, 1.2, 1.45);
      gnssGroup.add(statusBar);

      // UHF Radio Whip Antenna
      const whipGeo = new THREE.CylinderGeometry(0.04, 0.02, 1.8, 12);
      const whip = new THREE.Mesh(whipGeo, rubberGripMat);
      whip.position.set(1.1, 2.2, 0);
      gnssGroup.add(whip);

      // Survey Range Pole Base
      const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 16);
      const pole = new THREE.Mesh(poleGeo, brassKnobMat);
      pole.position.y = 0.5;
      gnssGroup.add(pole);

      rootGroup.add(gnssGroup);
    } else {
      // DIGITAL AUTO LEVEL (DL-32)
      const levelGroup = new THREE.Group();
      alidadePartRef.current = levelGroup;

      const bodyGeo = new THREE.BoxGeometry(1.3, 1.2, 2.6);
      const body = new THREE.Mesh(bodyGeo, metallicBodyMat);
      body.position.y = 1.0;
      body.castShadow = true;
      levelGroup.add(body);

      // Objective Lens
      const objLens = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.1, 24), glassLensMat);
      objLens.rotation.x = Math.PI / 2;
      objLens.position.set(0, 1.0, 1.35);
      levelGroup.add(objLens);

      // Eyepiece
      const eyeLens = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.3, 24), darkAnodizedMat);
      eyeLens.rotation.x = Math.PI / 2;
      eyeLens.position.set(0, 1.0, -1.45);
      levelGroup.add(eyeLens);

      // Large Side Focus Knob
      const focusKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.4, 24), rubberGripMat);
      focusKnob.rotation.z = Math.PI / 2;
      focusKnob.position.set(0.8, 1.1, 0);
      levelGroup.add(focusKnob);

      // Optical Sight Gun on Top
      const gunSight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.8), darkAnodizedMat);
      gunSight.position.set(0, 1.65, 0);
      levelGroup.add(gunSight);

      rootGroup.add(levelGroup);
    }

    // Soft Radial Contact Shadow Ground Plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0.65
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.005;
    rootGroup.add(contactShadow);

    modelGroupRef.current = rootGroup;
    scene.add(rootGroup);
  }, [laserActive]);

  // Handle Exploded View separation
  useEffect(() => {
    const factor = explodedVal / 100;
    if (telescopePartRef.current) {
      telescopePartRef.current.position.y = 1.65 + factor * 1.5;
    }
    if (alidadePartRef.current) {
      alidadePartRef.current.position.y = factor * 0.8;
    }
    if (batteryPartRef.current) {
      batteryPartRef.current.position.x = -0.85 - factor * 1.2;
    }
    if (tribrachPartRef.current) {
      tribrachPartRef.current.position.y = -factor * 0.5;
    }
  }, [explodedVal]);

  // Handle Laser Toggle
  useEffect(() => {
    if (laserBeamRef.current) {
      laserBeamRef.current.visible = laserActive;
    }
  }, [laserActive]);

  // Camera Presets
  const setCameraPreset = (view: 'front' | 'side' | 'top' | 'reset') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (view) {
      case 'front':
        camera.position.set(0, 2.0, 5.0);
        controls.target.set(0, 1.4, 0);
        setSelectedPart('Front Display Panel');
        break;
      case 'side':
        camera.position.set(5.0, 1.8, 0);
        controls.target.set(0, 1.4, 0);
        setSelectedPart('Side Calibration Knobs');
        break;
      case 'top':
        camera.position.set(0, 6.0, 0.5);
        controls.target.set(0, 1.2, 0);
        setSelectedPart('Tribrach Base Bubble');
        break;
      case 'reset':
      default:
        camera.position.set(3.2, 2.8, 4.2);
        controls.target.set(0, 1.3, 0);
        setSelectedPart('Full Instrument Overview');
        break;
    }
    controls.update();
  };

  // Main Three.js Initialization
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.Fog(0x090d16, 12, 35);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.4, 2.8, 4.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Warm Directional Key Light with shadows
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.2);
    scene.add(hemiLight);

    // Studio Rim Light
    const rimLight = new THREE.DirectionalLight(0x3b82f6, 1.4);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // 5. OrbitControls with Damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent camera from going under ground
    controls.minDistance = 1.5;
    controls.maxDistance = 14;
    controls.target.set(0, 1.3, 0);
    controlsRef.current = controls;

    // 6. Build initial instrument
    buildModel(activeModel, scene);

    // 7. Render Loop with smooth damping
    let isRunning = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isRunning) return;
      const delta = clock.getDelta();

      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotate;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }

      // Laser pulse intensity
      if (laserBeamRef.current && laserBeamRef.current.visible) {
        const time = clock.getElapsedTime();
        const laserMat = laserBeamRef.current.material as THREE.MeshBasicMaterial;
        laserMat.opacity = 0.75 + Math.sin(time * 6) * 0.15;
      }

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeModel, buildModel, isAutoRotate]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[620px]'
      }`}
    >
      {/* Top Header HUD (Minimal Spec Badge - Non Obstructive) */}
      <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3.5 py-2 rounded-xl shadow-lg">
          <Compass className="w-4 h-4 text-amber-500 animate-spin-slow" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                UniqTek 3D Instrument Inspector
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PBR 60FPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              ກວດເຊັກລະບົບ Optical & Calibration: <span className="text-sky-400 font-semibold">{selectedPart}</span>
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-xl shadow-lg">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isFullscreen ? 'ອອກຈາກເຕັມຈໍ' : 'ເຕັມຈໍ'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="ປິດໜ້າຕ່າງ"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />

      {/* Viewport-First Collapsible Bottom Control Dock (Strictly Centered & Solid/RGBA) */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-20 transition-all duration-300 ${
          isControlsCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Collapse Bar */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="px-4 py-1 bg-slate-900 border border-b-0 border-slate-700 rounded-t-xl text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 shadow-md transition-colors"
          >
            {isControlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-amber-500" />
                <span>ສະແດງເມນູຄວບຄຸມ 3D (Show Controls)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-amber-500" />
                <span>ເຊື່ອງເມນູ (Cinema Mode)</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Body */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl space-y-3">
          {/* Row 1: Model Switcher & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            {/* Model Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveModel('TS16')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeModel === 'TS16'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Leica TS16 Total Station
              </button>
              <button
                onClick={() => setActiveModel('GNSS')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeModel === 'GNSS'
                    ? 'bg-sky-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Trimble R12i GNSS
              </button>
              <button
                onClick={() => setActiveModel('LEVEL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeModel === 'LEVEL'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Digital Level LS15
              </button>
            </div>

            {/* Auto-rotate & Laser Beam Buttons */}
            <div className="flex items-center gap-1.5">
              {activeModel === 'TS16' && (
                <button
                  onClick={() => setLaserActive(!laserActive)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    laserActive
                      ? 'bg-red-500 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="ເປີດ/ປິດ ແສງເລເຊີ EDM"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>EDM Laser</span>
                </button>
              )}

              <button
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isAutoRotate
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="ໝູນອັດຕະໂນມັດ 360°"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ໝູນ 360°</span>
              </button>
            </div>
          </div>

          {/* Row 2: Exploded Calibration Slider & Camera Presets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            {/* Exploded View Slider */}
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
              <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300 font-bold">Exploded View (ແຍກຊິ້ນສ່ວນກວດເຊັກ):</span>
                  <span className="font-mono text-amber-400 font-bold">{explodedVal}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={explodedVal}
                  onChange={(e) => setExplodedVal(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* Camera Angles */}
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-[11px] text-slate-400 font-bold mr-1 hidden sm:inline">ມຸມກ້ອງ:</span>
              <button
                onClick={() => setCameraPreset('front')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors"
              >
                ດ້ານໜ້າ
              </button>
              <button
                onClick={() => setCameraPreset('side')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors"
              >
                ດ້ານຂ້າງ
              </button>
              <button
                onClick={() => setCameraPreset('top')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors"
              >
                ດ້ານເທິງ
              </button>
              <button
                onClick={() => setCameraPreset('reset')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg transition-colors"
              >
                ມາດຕະຖານ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
