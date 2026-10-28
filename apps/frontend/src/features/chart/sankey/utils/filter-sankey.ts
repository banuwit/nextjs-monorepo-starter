export type SankeyInput = {
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
};

/** Source nodes: nodes that never appear as a link target. */
export function getSankeySources(data: SankeyInput) {
  const targets = new Set(data.links.map((link) => link.target));
  return data.nodes.filter((_, index) => !targets.has(index));
}

/**
 * Removes hidden source nodes and scales every downstream link by the share
 * of inflow that remains, so totals stay consistent. Nodes left without
 * links are dropped and indexes are remapped. Each node keeps a stable
 * `colorIndex` (its original position) for coloring.
 *
 * Assumes nodes are ordered so a node's sources come before it.
 */
export function filterSankeySources(
  data: SankeyInput,
  hidden: ReadonlySet<string>,
) {
  const ratio: number[] = data.nodes.map((node) =>
    hidden.has(node.name) ? 0 : 1,
  );

  data.nodes.forEach((_, index) => {
    const incoming = data.links.filter((link) => link.target === index);
    if (!incoming.length) return;
    const total = incoming.reduce((sum, link) => sum + link.value, 0);
    const kept = incoming.reduce(
      (sum, link) => sum + link.value * (ratio[link.source] ?? 0),
      0,
    );
    ratio[index] = total ? kept / total : 0;
  });

  const links = data.links
    .map((link) => ({
      ...link,
      value: Math.round(link.value * (ratio[link.source] ?? 0)),
    }))
    .filter((link) => link.value > 0);

  const used = new Set(links.flatMap((link) => [link.source, link.target]));
  const remap = new Map<number, number>();
  const nodes = data.nodes.flatMap((node, index) => {
    if (!used.has(index)) return [];
    remap.set(index, remap.size);
    return [{ ...node, colorIndex: index }];
  });

  return {
    nodes,
    links: links.map((link) => ({
      ...link,
      source: remap.get(link.source) ?? 0,
      target: remap.get(link.target) ?? 0,
    })),
  };
}
