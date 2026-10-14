import React from 'react';

export default function Icon({ name, className = 'ic', style }) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
