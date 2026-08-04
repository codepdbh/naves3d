import React from 'react';

interface HealthGaugeProps {
  label: string;
  current: number;
  max: number;
  color: string;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({ label, current, max, color }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const blocks = 16;
  const filledBlocks = Math.round((percentage / 100) * blocks);

  return (
    <div style={{ marginBottom: '6px', fontSize: '11px', letterSpacing: '1px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
        <span>{label}</span>
        <span>
          {Math.ceil(current)}/{max}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '2px',
          padding: '2px',
          background: '#000000',
          border: '2px solid #ffffff',
          boxShadow: '0 0 0 2px #000',
        }}
      >
        {Array.from({ length: blocks }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '10px',
              backgroundColor: i < filledBlocks ? color : '#1a1a2e',
              transition: 'background-color 0.1s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};
