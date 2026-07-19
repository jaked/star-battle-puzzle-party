import React from 'react';

const e = React.createElement;

const Cross = ({ size }) => {
  const offset = Math.sin(Math.PI / 4) * size / 2;

  return e(
    "svg",
    {
      width: size,
      height: size,
    },
    e(
      'path',
      {
        transform: `translate(${size/2}, ${size/2})`,
        stroke: 'red',
        strokeWidth: size / 5,
        d: `
          M ${-offset} ${-offset}
          L ${offset} ${offset}
          M ${-offset} ${offset}
          L ${offset} ${-offset}
        `
      }
    )
  );
};

export default Cross;
