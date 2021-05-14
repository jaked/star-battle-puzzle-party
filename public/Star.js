import React from "https://cdn.skypack.dev/react";

const e = React.createElement;

const Star = ({ conflict, size }) =>
  e(
    "svg",
    {
      width: size,
      height: size,
    },
    e("polygon", {
      // points of the star lie on a circle with radius size / 2
      // with an angle of 2/5 pi between each
      // to draw the star, sweep an angle by 4/5 pi so we hit every other point
      // point 0 at angle 0 is the middle right of the circle
      // so the top point is point 3 at angle 12/5 pi = 2/5 pi
      // but this results in a rotated star; we want the top point at 1/2 pi
      // so subtract 1/10 pi to rotate the star so the top is at 1/2 pi
      points: new Array(5)
        .fill()
        .map((_, i) => {
          const theta = (4 / 5) * Math.PI * i - (1 / 10) * Math.PI;
          const x = size / 2 + (Math.cos(theta) * size) / 2;
          const y = size / 2 + (Math.sin(theta) * size) / 2;
          return `${x} ${y}`;
        })
        .join(" "),
      fill: conflict ? "red" : "black",
      strokeWidth: "1"
    })
  );

export default Star;
