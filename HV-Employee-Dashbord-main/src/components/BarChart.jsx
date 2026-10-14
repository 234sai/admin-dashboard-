import React from 'react';

export default function BarChart({ vals, labels, tips, hl = [] }) {
  const max = Math.max(...vals, 1);

  return (
    <div className="bars">
      {vals.map((v, i) => {
        const h = Math.max(18, Math.round((v / max) * 100));
        const cls = hl[i] ? ` on${hl[i]}` : '';
        const tipPos = Math.round(104 - 1.38 * h);
        const heightCalc = `calc((100% - 26px) * ${(h / 100).toFixed(2)})`;

        return (
          <div
            key={i}
            className="bar"
            style={{ '--i': i, '--tip': `${tipPos}px` }}
            data-tip={tips[i]}
          >
            <div
              className={`pl${cls}`}
              style={{ height: heightCalc }}
            />
            <small>{labels[i]}</small>
          </div>
        );
      })}
    </div>
  );
}
