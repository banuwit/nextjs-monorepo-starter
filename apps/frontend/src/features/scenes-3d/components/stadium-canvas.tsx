"use client";

import { useEffect, useRef, type ComponentRef } from "react";
import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { RenderMode, Sector, Tier } from "../types/stadium";
import type { SceneColors } from "../utils/scene-colors";
import { midAngleRadians, tierById } from "../utils/stadium";
import { StadiumBowl } from "./stadium-bowl";

export type StadiumCanvasProps = {
  tiers: Tier[];
  sectors: Sector[];
  colors: SceneColors;
  renderMode: RenderMode;
  selectedId: string | null;
  hoveredId: string | null;
  /** Bumped by the parent to ask the camera to return to the overview. */
  resetToken: number;
  onHover: (id: string | null) => void;
  onSelect: (sector: Sector) => void;
};

const overview = [0, 36, 46, 0, 1, 0] as const;

/** camera-controls ACTION flags; the package is a transitive dependency so the enum is inlined. */
const ACTION = { NONE: 0, DOLLY: 16, TOUCH_DOLLY: 1024 } as const;

export default function StadiumCanvas({
  tiers,
  sectors,
  colors,
  renderMode,
  selectedId,
  hoveredId,
  resetToken,
  onHover,
  onSelect,
}: StadiumCanvasProps) {
  const controls = useRef<ComponentRef<typeof CameraControls>>(null);

  // Keep the orbit pivot on the pitch centre: no panning (truck) by mouse or touch,
  // so rotating and zooming always revolve around the middle of the bowl.
  useEffect(() => {
    const instance = controls.current;
    if (!instance) return;
    instance.mouseButtons.right = ACTION.DOLLY;
    instance.mouseButtons.middle = ACTION.NONE;
    instance.touches.two = ACTION.TOUCH_DOLLY;
    instance.touches.three = ACTION.NONE;
  }, []);

  useEffect(() => {
    const selected = sectors.find((sector) => sector.id === selectedId);
    if (!selected) {
      void controls.current?.setLookAt(...overview, true);
      return;
    }
    const tier = tierById(tiers, selected.tier);
    const angle = midAngleRadians(selected);
    const radius = tier.outerRadius + 7;
    void controls.current?.setLookAt(
      radius * Math.cos(angle),
      tier.baseY + tier.height + 8,
      -radius * Math.sin(angle),
      0,
      0.5,
      0,
      true,
    );
  }, [selectedId, sectors, tiers, resetToken]);

  return (
    <Canvas
      frameloop={renderMode === "demand" ? "demand" : "always"}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [overview[0], overview[1], overview[2]], fov: 38 }}
      onPointerMissed={() => onHover(null)}
    >
      <CameraControls
        ref={controls}
        minDistance={14}
        maxDistance={90}
        maxPolarAngle={Math.PI / 2.1}
        smoothTime={0.45}
      />
      <StadiumBowl
        tiers={tiers}
        sectors={sectors}
        colors={colors}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onHover={onHover}
        onSelect={onSelect}
      />
    </Canvas>
  );
}
