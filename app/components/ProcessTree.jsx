"use client";

import { useMemo, useState } from 'react';

function generateBinaryGenerations(iterations) {
  const levels = [];
  for (let level = 0; level <= iterations; level++) {
    const count = 2 ** level;
    const nodes = Array.from({ length: count }, (_, i) => ({
      id: `${level}-${i}`,
      level,
      index: i,
    }));
    levels.push(nodes);
  }
  return levels;
}

function computeSvgLayout(levels) {
  const depth = levels.length - 1;
  const width = Math.max(800, 80 * (2 ** depth));
  const vGap = 110;
  const r = 16;

  const positioned = levels.map((nodes, level) => {
    const columns = 2 ** level;
    const step = width / columns;
    return nodes.map((n, i) => ({
      ...n,
      x: (i + 0.5) * step,
      y: 40 + level * vGap,
      r,
    }));
  });

  const edges = [];
  for (let level = 1; level < positioned.length; level++) {
    const prev = positioned[level - 1];
    const curr = positioned[level];
    for (let i = 0; i < curr.length; i++) {
      const parentIndex = Math.floor(i / 2);
      edges.push({
        from: prev[parentIndex],
        to: curr[i],
      });
    }
  }

  const height = 80 + vGap * depth + r * 2;
  return { nodes: positioned.flat(), edges, width, height };
}

function metrics(iterations) {
  const totalProcesses = 2 ** iterations; // after all forks finish
  const totalChildrenCreated = (2 ** iterations) - 1; // sum of new processes created across iterations
  return { totalProcesses, totalChildrenCreated };
}

export default function ProcessTree({ defaultIterations = 4 }) {
  const [iters, setIters] = useState(defaultIterations);
  const gens = useMemo(() => generateBinaryGenerations(iters), [iters]);
  const layout = useMemo(() => computeSvgLayout(gens), [gens]);
  const m = metrics(iters);

  return (
    <div className="card">
      <div className="controls">
        <span className="label">Iterations (i &lt; n):</span>
        <input
          type="range"
          min={0}
          max={8}
          step={1}
          value={iters}
          onChange={(e) => setIters(parseInt(e.target.value))}
        />
        <span className="badge">n = {iters}</span>
      </div>

      <div className="metrics">
        <div><span className="label">Processes after loop:</span> 2^n = {m.totalProcesses}</div>
        <div><span className="label">printf executions:</span> {m.totalChildrenCreated}</div>
      </div>

      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label="Process tree visualization">
        {layout.edges.map((e, idx) => (
          <line key={idx} className="edge" x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} />
        ))}
        {layout.nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x},${n.y})`}>
            <circle className="node" r={n.r} />
            <text className="nodeText" textAnchor="middle" dy="4">{n.level}</text>
          </g>
        ))}
      </svg>

      <div style={{ marginTop: 12 }} className="subtle">
        Based on code equivalent to: for (int i = 0; i &lt; n; i++) fork(); child prints only.
      </div>
    </div>
  );
}
