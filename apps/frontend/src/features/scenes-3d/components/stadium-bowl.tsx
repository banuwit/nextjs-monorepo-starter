"use client";

import { useMemo } from "react";
import { useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Sector, Tier } from "../types/stadium";
import type { SceneColors } from "../utils/scene-colors";
import { isOpen, tierById } from "../utils/stadium";

type StadiumBowlProps = {
  tiers: Tier[];
  sectors: Sector[];
  colors: SceneColors;
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (sector: Sector) => void;
};

const tierMix: Record<"light" | "dark", Record<Tier["id"], number>> = {
  light: { lower: 0.15, middle: 0.4, upper: 0.6 },
  dark: { lower: 0.45, middle: 0.6, upper: 0.72 },
};

function sectorGeometry(tier: Tier, sector: Sector) {
  const start = (sector.startAngle * Math.PI) / 180;
  const end = (sector.endAngle * Math.PI) / 180;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, tier.outerRadius, start, end, false);
  shape.absarc(0, 0, tier.innerRadius, end, start, true);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: tier.height,
    bevelEnabled: false,
    curveSegments: 6,
  });
  // Extruded along +Z; rotate so the slab rises along +Y and north points away.
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, tier.baseY, 0);
  return geometry;
}

function SectorMesh({
  tier,
  sector,
  colors,
  selected,
  hovered,
  onHover,
  onSelect,
}: {
  tier: Tier;
  sector: Sector;
  colors: SceneColors;
  selected: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (sector: Sector) => void;
}) {
  const open = isOpen(sector);
  const geometry = useMemo(() => sectorGeometry(tier, sector), [tier, sector]);
  const color = useMemo(() => {
    if (!open) return new THREE.Color(colors.muted);
    const base = new THREE.Color(colors.primary).lerp(
      new THREE.Color(colors.card),
      tierMix[colors.dark ? "dark" : "light"][tier.id],
    );
    if (selected) return new THREE.Color(colors.primary);
    if (hovered) return base.lerp(new THREE.Color(colors.primary), 0.6);
    return base;
  }, [open, selected, hovered, colors, tier.id]);

  useCursor(hovered && open, "pointer", "auto");

  const stop = (event: ThreeEvent<PointerEvent | MouseEvent>) =>
    event.stopPropagation();

  return (
    <mesh
      geometry={geometry}
      position-y={selected ? 0.35 : 0}
      onPointerOver={(event) => {
        stop(event);
        onHover(sector.id);
      }}
      onPointerOut={(event) => {
        stop(event);
        onHover(null);
      }}
      onClick={(event) => {
        stop(event);
        if (open) onSelect(sector);
      }}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.85}
        metalness={0.05}
        emissive={selected ? color : "#000000"}
        emissiveIntensity={selected ? 0.35 : 0}
        transparent={!open}
        opacity={open ? 1 : colors.dark ? 0.55 : 0.8}
      />
    </mesh>
  );
}

function Pitch({ colors }: { colors: SceneColors }) {
  const lineColor = colors.pitchLine;
  return (
    <group position-y={0.02}>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[16.4, 11.4]} />
        <meshStandardMaterial color={lineColor} roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}>
        <planeGeometry args={[16, 11]} />
        <meshStandardMaterial color={colors.pitch} roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.02}>
        <ringGeometry args={[1.7, 1.85, 48]} />
        <meshBasicMaterial color={lineColor} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.02}>
        <planeGeometry args={[0.15, 11]} />
        <meshBasicMaterial color={lineColor} />
      </mesh>
      {[-6.2, 6.2].map((x) => (
        <mesh
          key={x}
          rotation-x={-Math.PI / 2}
          position={[x, 0.02, 0]}
        >
          <planeGeometry args={[3.4, 6]} />
          <meshBasicMaterial color={lineColor} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export function StadiumBowl({
  tiers,
  sectors,
  colors,
  selectedId,
  hoveredId,
  onHover,
  onSelect,
}: StadiumBowlProps) {
  const plinth = tiers[tiers.length - 1]!;
  return (
    <group>
      <ambientLight intensity={colors.dark ? 0.7 : 1.3} />
      <directionalLight position={[18, 30, 14]} intensity={colors.dark ? 1.2 : 2} />
      <directionalLight position={[-20, 12, -16]} intensity={0.5} />
      <mesh position-y={-0.3}>
        <cylinderGeometry
          args={[plinth.outerRadius + 1.2, plinth.outerRadius + 2.4, 0.6, 72]}
        />
        <meshStandardMaterial color={colors.border} roughness={1} />
      </mesh>
      <Pitch colors={colors} />
      {sectors.map((sector) => (
        <SectorMesh
          key={sector.id}
          tier={tierById(tiers, sector.tier)}
          sector={sector}
          colors={colors}
          selected={sector.id === selectedId}
          hovered={sector.id === hoveredId}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
