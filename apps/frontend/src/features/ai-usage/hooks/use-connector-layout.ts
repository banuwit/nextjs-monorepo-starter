import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export type ConnectorLink = {
  from: string;
  to: string;
  active: boolean;
};

export type ConnectorPath = ConnectorLink & {
  d: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
};

const CORNER = 10;

/** Elbow path: horizontal out of `start`, vertical at the midpoint, horizontal into `end`. */
function elbowPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  const midX = (start.x + end.x) / 2;
  const dy = end.y - start.y;
  if (Math.abs(dy) < CORNER * 2) {
    return `M${start.x},${start.y} H${midX} V${end.y} H${end.x}`;
  }
  const direction = Math.sign(dy);
  return [
    `M${start.x},${start.y}`,
    `H${midX - CORNER}`,
    `Q${midX},${start.y} ${midX},${start.y + CORNER * direction}`,
    `V${end.y - CORNER * direction}`,
    `Q${midX},${end.y} ${midX + CORNER},${end.y}`,
    `H${end.x}`,
  ].join(" ");
}

/**
 * Measures registered nodes inside `container` and returns an elbow path for
 * each link, from the right edge of `from` to the left edge of `to`.
 */
export function useConnectorLayout(
  container: RefObject<HTMLElement | null>,
  links: ConnectorLink[],
) {
  const nodes = useRef(new Map<string, HTMLElement>());
  const [paths, setPaths] = useState<ConnectorPath[]>([]);
  const register = useCallback(
    (id: string) => (element: HTMLElement | null) => {
      if (element) nodes.current.set(id, element);
      else nodes.current.delete(id);
    },
    [],
  );

  // Serialized so a fresh `links` array with the same content does not re-run the effect.
  const linksKey = JSON.stringify(links);

  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const currentLinks = JSON.parse(linksKey) as ConnectorLink[];

    // ResizeObserver fires once on observe, which also runs the first measurement.
    const observer = new ResizeObserver(() => {
      const origin = root.getBoundingClientRect();
      const next: ConnectorPath[] = [];
      for (const link of currentLinks) {
        const from = nodes.current.get(link.from)?.getBoundingClientRect();
        const to = nodes.current.get(link.to)?.getBoundingClientRect();
        if (!from || !to) continue;
        const start = {
          x: from.right - origin.left,
          y: from.top + from.height / 2 - origin.top,
        };
        const end = {
          x: to.left - origin.left,
          y: to.top + to.height / 2 - origin.top,
        };
        next.push({ ...link, start, end, d: elbowPath(start, end) });
      }
      setPaths(next);
    });

    observer.observe(root);
    for (const element of nodes.current.values()) observer.observe(element);
    return () => observer.disconnect();
  }, [container, linksKey]);

  return { register, paths };
}
