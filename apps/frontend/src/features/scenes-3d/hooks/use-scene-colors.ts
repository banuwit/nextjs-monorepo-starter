"use client";

import { useEffect, useState } from "react";
import {
  fallbackSceneColors,
  readSceneColors,
  type SceneColors,
} from "../utils/scene-colors";

/**
 * Snapshot of the theme tokens the 3D scene paints with.
 * Re-reads whenever the root element changes class, style or data attributes,
 * which is how the Preferences provider applies theme and primary color.
 */
export function useSceneColors(): SceneColors {
  const [colors, setColors] = useState<SceneColors>(fallbackSceneColors);

  useEffect(() => {
    const update = () => setColors(readSceneColors());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return colors;
}
