import React from "https://cdn.skypack.dev/react";

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
    // e("line", {
    //   x1: 0,
    //   y1: 0,
    //   x2: size,
    //   y2: size,
    //   stroke: "#FF0000",
    //   strokeWidth: size / 5
    // }),
    // e("line", {
    //   x1: 0,
    //   y1: size,
    //   x2: size,
    //   y2: 0,
    //   stroke: "#FF0000",
    //   strokeWidth: size / 5
    // })
  );
};

export default Cross;
