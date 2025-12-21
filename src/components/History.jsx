import React from 'react';

export default function History({ history = [], onSelect, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="history">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Recent searches</strong>
        <button className="chip" onClick={onClear}>Clear</button>
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {history.map((h) => (
          <button key={h.at} className="chip" onClick={() => onSelect(h.city)}>
            {h.city}
          </button>
        ))}
      </div>
    </div>
  );
}
