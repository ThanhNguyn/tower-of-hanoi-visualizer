import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import type { HanoiRods, Rod as RodType } from "../types/hanoi";
import { sound } from "../utils/audio";
import { useLanguage } from "../i18n/LanguageContext";
import { Camera, Eye, Layers } from "lucide-react";

interface Hanoi3DCanvasProps {
  rods: HanoiRods;
  totalDisks: number;
  selectedRod: RodType | null;
  shakeRod?: RodType | null;
  hintMove?: { from: RodType; to: RodType; disk: number } | null;
  isInteractive: boolean;
  speed?: number;
  onSelectRod: (rod: RodType) => void;
}

type CameraViewPreset = "isometric" | "front" | "top";

const ROD_X_POSITIONS: Record<RodType, number> = {
  A: -7.8,
  B: 0,
  C: 7.8
};

const DISK_COLORS: Record<number, number> = {
  1: 0xf59e0b, // Amber Gold
  2: 0xea580c, // Tangerine Flame
  3: 0xe11d48, // Crimson Rose
  4: 0x9333ea, // Amethyst Purple
  5: 0x2563eb, // Sapphire Royal
  6: 0x059669, // Emerald Jade
  7: 0x65a30d, // Olive Lime
  8: 0x475569  // Titanium Slate
};

const CAMERA_POSITIONS: Record<CameraViewPreset, { x: number; y: number; z: number }> = {
  isometric: { x: 17, y: 17, z: 22 },
  front: { x: 0, y: 10, z: 25 },
  top: { x: 0, y: 26, z: 6 }
};

export function Hanoi3DCanvas({
  rods,
  totalDisks,
  selectedRod,
  shakeRod,
  hintMove,
  isInteractive,
  speed = 1,
  onSelectRod
}: Hanoi3DCanvasProps) {
  const { t } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>("isometric");
  const shakeRodRef = useRef<RodType | null | undefined>(shakeRod);
  shakeRodRef.current = shakeRod;

  // State refs for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Mesh registries
  const diskMeshesRef = useRef<Map<number, THREE.Group>>(new Map());
  const rodHitboxesRef = useRef<Map<RodType, THREE.Mesh>>(new Map());
  const selectionRingsRef = useRef<Map<RodType, THREE.Mesh>>(new Map());

  // Animation states for disks: target vs current
  const diskStateRef = useRef<
    Map<
      number,
      {
        currentPos: THREE.Vector3;
        targetPos: THREE.Vector3;
        isAnimating: boolean;
        animProgress: number;
        animStartPos: THREE.Vector3;
        animApexPos: THREE.Vector3;
        animDuration: number;
      }
    >
  >(new Map());

  // Mouse interaction
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Camera animation interpolation
  const targetCamPosRef = useRef(new THREE.Vector3(17, 17, 22));

  const poleHeight = useMemo(() => Math.max(8.5, totalDisks * 1.35 + 2.5), [totalDisks]);
  const diskThickness = 0.95;
  const basePlinthY = 0.7; // top surface of base

  // Generate disk top-face canvas texture with inscribed number
  const createDiskTexture = useCallback((diskNum: number, colorHex: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Fill background with subtle radial gradient
    const rGrad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    const colorStr = "#" + colorHex.toString(16).padStart(6, "0");
    rGrad.addColorStop(0, "#ffffff");
    rGrad.addColorStop(0.3, colorStr);
    rGrad.addColorStop(1, "#000000");
    ctx.fillStyle = rGrad;
    ctx.beginPath();
    ctx.arc(128, 128, 126, 0, Math.PI * 2);
    ctx.fill();

    // Inscribed center peg hole ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(128, 128, 36, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#0a0d14";
    ctx.beginPath();
    ctx.arc(128, 128, 30, 0, Math.PI * 2);
    ctx.fill();

    // Crisp numbered label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(diskNum), 128, 86);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Update camera view preset
  const handleSetPreset = useCallback((preset: CameraViewPreset) => {
    setCameraPreset(preset);
    const pos = CAMERA_POSITIONS[preset];
    targetCamPosRef.current.set(pos.x, pos.y, pos.z);
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = Math.max(380, Math.min(520, Math.round(width * 0.52)));

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e17);

    // Subtle atmospheric fog for dramatic depth
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    const initialPos = CAMERA_POSITIONS[cameraPreset];
    camera.position.set(initialPos.x, initialPos.y, initialPos.z);
    camera.lookAt(0, 3.5, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.85);
    scene.add(ambientLight);

    // Warm Sun Directional Light with soft shadows
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    dirLight.position.set(16, 28, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 5;
    dirLight.shadow.camera.far = 70;
    dirLight.shadow.camera.left = -18;
    dirLight.shadow.camera.right = 18;
    dirLight.shadow.camera.top = 18;
    dirLight.shadow.camera.bottom = -18;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Cool Rim Light
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.45);
    rimLight.position.set(-16, 12, -14);
    scene.add(rimLight);

    // Center Peg Warm Glow
    const pointLight = new THREE.PointLight(0xf59e0b, 0.6, 25);
    pointLight.position.set(0, 14, 5);
    scene.add(pointLight);

    // 5. Wooden Plinth Base
    const plinthGroup = new THREE.Group();

    // Main mahogany body
    const baseGeo = new THREE.BoxGeometry(25.5, 1.4, 10.5);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1b130e,
      roughness: 0.45,
      metalness: 0.08
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0;
    baseMesh.receiveShadow = true;
    plinthGroup.add(baseMesh);

    // Inset beveled top accent plate
    const topPlateGeo = new THREE.BoxGeometry(24.5, 0.1, 9.5);
    const topPlateMat = new THREE.MeshStandardMaterial({
      color: 0x271c15,
      roughness: 0.35,
      metalness: 0.15
    });
    const topPlateMesh = new THREE.Mesh(topPlateGeo, topPlateMat);
    topPlateMesh.position.y = 0.75;
    topPlateMesh.receiveShadow = true;
    plinthGroup.add(topPlateMesh);

    // Subtle brushed brass perimeter chamfer rim
    const rimGeo = new THREE.BoxGeometry(25.6, 0.08, 10.6);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.8
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = 0.68;
    plinthGroup.add(rimMesh);

    scene.add(plinthGroup);

    // 6. Rods & Collars
    const rodsList: RodType[] = ["A", "B", "C"];
    rodsList.forEach((rodId) => {
      const xPos = ROD_X_POSITIONS[rodId];

      // Milled Brass Socket Collar
      const collarGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.35, 32);
      const collarMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.22,
        metalness: 0.85
      });
      const collarMesh = new THREE.Mesh(collarGeo, collarMat);
      collarMesh.position.set(xPos, basePlinthY + 0.18, 0);
      collarMesh.receiveShadow = true;
      collarMesh.castShadow = true;
      scene.add(collarMesh);

      // Polished Stainless Steel Peg Pole
      const poleGeo = new THREE.CylinderGeometry(0.34, 0.34, poleHeight, 32);
      const poleMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.15,
        metalness: 0.92
      });
      const poleMesh = new THREE.Mesh(poleGeo, poleMat);
      poleMesh.position.set(xPos, basePlinthY + poleHeight / 2, 0);
      poleMesh.castShadow = true;
      poleMesh.receiveShadow = true;
      scene.add(poleMesh);

      // Spherical Pole Top Cap
      const capGeo = new THREE.SphereGeometry(0.35, 24, 16);
      const capMesh = new THREE.Mesh(capGeo, poleMat);
      capMesh.position.set(xPos, basePlinthY + poleHeight, 0);
      capMesh.castShadow = true;
      scene.add(capMesh);

      // Invisible Click Hitbox (Generous cylinder for effortless click interaction)
      const hitboxGeo = new THREE.CylinderGeometry(2.4, 2.4, poleHeight + 4, 16);
      const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitboxMesh = new THREE.Mesh(hitboxGeo, hitboxMat);
      hitboxMesh.position.set(xPos, basePlinthY + poleHeight / 2, 0);
      hitboxMesh.userData = { rod: rodId };
      scene.add(hitboxMesh);
      rodHitboxesRef.current.set(rodId, hitboxMesh);

      // Selection Indicator Ring on Plinth
      const selRingGeo = new THREE.RingGeometry(1.5, 2.1, 32);
      selRingGeo.rotateX(-Math.PI / 2);
      const selRingMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      const selRingMesh = new THREE.Mesh(selRingGeo, selRingMat);
      selRingMesh.position.set(xPos, basePlinthY + 0.22, 0);
      scene.add(selRingMesh);
      selectionRingsRef.current.set(rodId, selRingMesh);
    });

    // 7. Initialize 3D Disks
    for (let d = 1; d <= totalDisks; d++) {
      const diskGroup = new THREE.Group();

      // Radius proportionally scaled from 1.4 to 4.2
      const minRadius = 1.35;
      const maxRadius = 4.15;
      const radius =
        totalDisks <= 1
          ? 2.5
          : minRadius + ((d - 1) / (totalDisks - 1)) * (maxRadius - minRadius);

      const colorHex = DISK_COLORS[d] || 0x64748b;
      const diskTexture = createDiskTexture(d, colorHex);

      // Cylinder with distinct top, bottom, and side materials
      const diskGeo = new THREE.CylinderGeometry(radius, radius, diskThickness, 48);

      const sideMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.3,
        metalness: 0.25
      });

      const topMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        map: diskTexture ?? undefined,
        roughness: 0.22,
        metalness: 0.2
      });

      const bottomMat = new THREE.MeshStandardMaterial({
        color: 0x090d14,
        roughness: 0.7,
        metalness: 0.1
      });

      const diskMesh = new THREE.Mesh(diskGeo, [sideMat, topMat, bottomMat]);
      diskMesh.castShadow = true;
      diskMesh.receiveShadow = true;
      diskMesh.userData = { disk: d };
      diskGroup.add(diskMesh);

      // Specular Top Chamfer Ring Accent
      const bevelGeo = new THREE.TorusGeometry(radius * 0.98, 0.05, 12, 48);
      bevelGeo.rotateX(Math.PI / 2);
      const bevelMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.4
      });
      const bevelMesh = new THREE.Mesh(bevelGeo, bevelMat);
      bevelMesh.position.y = diskThickness / 2;
      diskGroup.add(bevelMesh);

      // Initial position on rod A
      const slotIndex = totalDisks - d;
      const initialY = basePlinthY + 0.35 + slotIndex * diskThickness + diskThickness / 2;
      diskGroup.position.set(ROD_X_POSITIONS.A, initialY, 0);

      scene.add(diskGroup);
      diskMeshesRef.current.set(d, diskGroup);

      diskStateRef.current.set(d, {
        currentPos: diskGroup.position.clone(),
        targetPos: diskGroup.position.clone(),
        isAnimating: false,
        animProgress: 1,
        animStartPos: diskGroup.position.clone(),
        animApexPos: diskGroup.position.clone(),
        animDuration: 0.45
      });
    }

    // 8. Animation & Render Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      reqIdRef.current = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      // Smooth camera interpolation
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.08);
        if (shakeRodRef.current) {
          cameraRef.current.position.x += Math.sin(time * 0.04) * 0.15;
        }
        cameraRef.current.lookAt(0, 3.5, 0);
      }

      // Update disk flight animations
      diskStateRef.current.forEach((state, diskNum) => {
        const mesh = diskMeshesRef.current.get(diskNum);
        if (!mesh) return;

        if (state.isAnimating) {
          state.animProgress += dt / state.animDuration;

          if (state.animProgress >= 1) {
            state.animProgress = 1;
            state.isAnimating = false;
            state.currentPos.copy(state.targetPos);
            mesh.position.copy(state.targetPos);
          } else {
            // Quadratic Bezier interpolation: P(t) = (1-t)^2 * P0 + 2(1-t)t * P_apex + t^2 * P1
            const t = state.animProgress;
            // Smooth ease-in-out curve
            const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            const u = 1 - easeT;
            const tt = easeT * easeT;
            const uu = u * u;

            mesh.position.x = uu * state.animStartPos.x + 2 * u * easeT * state.animApexPos.x + tt * state.targetPos.x;
            mesh.position.y = uu * state.animStartPos.y + 2 * u * easeT * state.animApexPos.y + tt * state.targetPos.y;
            mesh.position.z = uu * state.animStartPos.z + 2 * u * easeT * state.animApexPos.z + tt * state.targetPos.z;

            // Subtle bank/tilt while flying through the air
            mesh.rotation.z = Math.sin(t * Math.PI) * (state.targetPos.x > state.animStartPos.x ? -0.1 : 0.1);
          }
        } else {
          // Floating levitation bob if selected
          mesh.position.copy(state.targetPos);
          mesh.rotation.z = 0;
        }
      });

      // Pulse Selection Rings
      selectionRingsRef.current.forEach((ring) => {
        if ((ring.material as THREE.MeshBasicMaterial).opacity > 0) {
          const pulse = 0.55 + Math.sin(time * 0.006) * 0.35;
          (ring.material as THREE.MeshBasicMaterial).opacity = pulse;
        }
      });

      renderer.render(scene, camera);
    };

    reqIdRef.current = requestAnimationFrame(animate);

    // 9. Resize Observer
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = Math.max(380, Math.min(520, Math.round(newW * 0.52)));
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    ro.observe(container);

    // Cleanup
    return () => {
      ro.disconnect();
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      diskMeshesRef.current.clear();
      rodHitboxesRef.current.clear();
      selectionRingsRef.current.clear();
    };
  }, [totalDisks, poleHeight, createDiskTexture]);

  // Update target positions of disks whenever rods state or selection changes
  useEffect(() => {
    const hoverY = basePlinthY + poleHeight + 2.2;
    const moveDuration = Math.max(0.14, Math.min(0.75, 0.65 / (speed || 1)));

    (["A", "B", "C"] as RodType[]).forEach((rodId) => {
      const rodDisks = rods[rodId];
      rodDisks.forEach((diskNum, slotIdx) => {
        const state = diskStateRef.current.get(diskNum);
        if (!state) return;

        const isTop = slotIdx === rodDisks.length - 1;
        const isHovered = selectedRod === rodId && isTop;

        const targetX = ROD_X_POSITIONS[rodId];
        const targetY = isHovered
          ? hoverY
          : basePlinthY + 0.35 + slotIdx * diskThickness + diskThickness / 2;
        const targetZ = 0;

        const newTarget = new THREE.Vector3(targetX, targetY, targetZ);

        // Check if destination rod changed -> trigger parabolic flight arc
        if (state.targetPos.distanceTo(newTarget) > 0.4) {
          state.animStartPos = state.currentPos.clone();
          state.targetPos = newTarget;

          // Apex height: reaches top of pole + breathing clearance
          const apexY = Math.max(state.animStartPos.y, targetY, hoverY) + 1.2;
          const apexX = (state.animStartPos.x + targetX) / 2;
          state.animApexPos = new THREE.Vector3(apexX, apexY, 0);

          state.animProgress = 0;
          state.animDuration = moveDuration;
          state.isAnimating = true;
        } else {
          // Stationary or hovering in place
          state.targetPos.copy(newTarget);
          if (!state.isAnimating) {
            state.currentPos.copy(newTarget);
          }
        }
      });
    });
  }, [rods, selectedRod, poleHeight, speed]);

  // Update Selection Rings visibility
  useEffect(() => {
    selectionRingsRef.current.forEach((ring, rodId) => {
      const isSelected = selectedRod === rodId;
      const isHintTarget = hintMove?.to === rodId;
      const mat = ring.material as THREE.MeshBasicMaterial;

      if (isSelected) {
        mat.color.setHex(0x38bdf8); // Cyan
        mat.opacity = 0.8;
      } else if (isHintTarget) {
        mat.color.setHex(0xfbbf24); // Amber
        mat.opacity = 0.8;
      } else {
        mat.opacity = 0;
      }
    });
  }, [selectedRod, hintMove]);

  // Mouse Click Raycast Handler
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isInteractive || !rendererRef.current || !cameraRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      const hitboxes: THREE.Mesh[] = [];
      rodHitboxesRef.current.forEach((mesh) => hitboxes.push(mesh));

      const intersects = raycasterRef.current.intersectObjects(hitboxes, false);
      if (intersects.length > 0) {
        const clickedRod = intersects[0].object.userData.rod as RodType;
        if (clickedRod) {
          sound.playPickup();
          onSelectRod(clickedRod);
        }
      }
    },
    [isInteractive, onSelectRod]
  );

  return (
    <div className="relative w-full rounded-2xl border border-white/[0.1] bg-[#090d14] overflow-hidden shadow-2xl select-none">
      {/* 3D View Controls Floating Toolbar */}
      <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-[#0c121d]/85 p-1 backdrop-blur-md shadow-lg">
        <button
          type="button"
          onClick={() => handleSetPreset("isometric")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
            cameraPreset === "isometric"
              ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title={t("cameraIsometricTitle")}
        >
          <Camera size={13} />
          <span>{t("cameraIsometric")}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetPreset("front")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
            cameraPreset === "front"
              ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title={t("cameraFrontTitle")}
        >
          <Eye size={13} />
          <span>{t("cameraFront")}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetPreset("top")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
            cameraPreset === "top"
              ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title={t("cameraTopTitle")}
        >
          <Layers size={13} />
          <span>{t("cameraTop")}</span>
        </button>
      </div>

      {/* Top Rod Identifier Status Chips */}
      <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
        {(["A", "B", "C"] as RodType[]).map((rodId) => {
          const isSelected = selectedRod === rodId;
          const isHintTarget = hintMove?.to === rodId;
          const count = rods[rodId].length;

          return (
            <div
              key={rodId}
              onClick={() => isInteractive && onSelectRod(rodId)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer backdrop-blur-md ${
                isSelected
                  ? "bg-sky-500/20 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400/50"
                  : isHintTarget
                  ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/50 animate-pulse"
                  : "bg-[#0f1420]/80 border-white/[0.08] text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              <span className="font-bold text-xs">{t(rodId === "A" ? "pegA" : rodId === "B" ? "pegB" : "pegC")}</span>
              <span className="font-mono text-[10px] text-slate-400 bg-white/[0.08] px-1.5 py-0.5 rounded">
                {count} {t(count === 1 ? "diskSingular" : "diskPlural")}
              </span>
            </div>
          );
        })}
      </div>

      {/* WebGL Canvas Container */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        className="w-full flex items-center justify-center cursor-pointer active:cursor-grabbing"
        style={{ minHeight: "420px" }}
      />
    </div>
  );
}
