import React from "https://cdn.skypack.dev/react";
import Cross from "./Cross.js";
import Star from "./Star.js";
import colors from "./colors.js";

const e = React.createElement;

const Square = ({
  size,
  strokeWidth,
  row,
  column,
  state,
  onClick,
  conflict
}) => {
  const { color, icon } = state;

  return e(
    "g",
    {
      transform: `translate(${size * column} ${size * row})`,
      onClick
    },
    e("rect", {
      width: size,
      height: size,
      fill: colors[color],
    }),
    e(
      'g',
      {
        transform: `translate(${size/4} ${size/4})`
      },
      icon === "cross"
        ? e(Cross, { size: size / 2 })
        : icon === "star"
        ? e(Star, { conflict, size: size / 2 })
        : null,
    ),
  );
};

const Board = ({ puzzle, board, check, squareSize, makeOnClick }) => {
  const strokeWidth = squareSize > 20 ? 4 : 2;

  const children = [];
  const regions = puzzle.regions;
  const size = puzzle.size;
  const stars = puzzle.stars;

  const rowCounts = new Array(size).fill(0);
  const columnCounts = new Array(size).fill(0);
  const regionCounts = new Array(size * size).fill(0);

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (board[row][column].icon === "star") {
        rowCounts[row]++;
        columnCounts[column]++;
        regionCounts[regions[row][column]]++;
      }
    }
  }

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const region = regions[row][column];
      const top = row === 0 || regions[row - 1][column] !== region;
      const bottom = row === size - 1 || regions[row + 1][column] !== region;
      const left = column === 0 || regions[row][column - 1] !== region;
      const right = column === size - 1 || regions[row][column + 1] !== region;
      const state = board[row][column];
      const onClick = makeOnClick(row, column);

      let conflict = false;
      if (check && state.icon === "star") {
        if (rowCounts[row] > stars) conflict = true;
        if (columnCounts[column] > stars) conflict = true;
        if (regionCounts[regions[row][column]] > stars) conflict = true;
        for (let r = row - 1; r <= row + 1; r++) {
          for (let c = column - 1; c <= column + 1; c++) {
            if (
              r >= 0 &&
              r < size &&
              c >= 0 &&
              c < size &&
              !(r === row && c === column) &&
              board[r][c].icon === "star"
            )
              conflict = true;
          }
        }
      }

      children.push(
        e(Square, {
          row,
          column,
          size: squareSize,
          strokeWidth,
          state,
          onClick,
          conflict,
        }),
        e(
          'g',
          {
            transform: `translate(${squareSize * column} ${squareSize * row})`,
            stroke: 'black', strokeWidth, strokeLinecap: 'square'
          },
          top && e('path', { d: `M 0 0 L ${squareSize} 0` }),
          left && e('path', { d: `M 0 0 L 0 ${squareSize}` }),
          bottom && e('path', { d: `M 0 ${squareSize} L ${squareSize} ${squareSize}` }),
          right && e('path', { d: `M ${squareSize} 0 L ${squareSize} ${squareSize}` }),
        )
      );
    }
  }

  const gridlines = [];
  for (let i = 0; i < size; i++) {
    gridlines.push(
      e('path',        
        {
          stroke: 'black',
          strokeDasharray: `${strokeWidth} ${strokeWidth}`,
          d: `
            M 0 ${i * squareSize} l ${size * squareSize} 0
            M ${i * squareSize} 0 l 0 ${size * squareSize}
          `,
        }
      )
    );
  }
  children.push(e('g', {}, gridlines));

  return e(
    "svg",
    {
      width: size * squareSize + strokeWidth,
      height: size * squareSize + strokeWidth,
    },
    e(
      // offset from svg origin so border stroke doesn't get clipped
      'g',
      {
        transform: `translate(${strokeWidth / 2} ${strokeWidth / 2})`
      },
      children
    )
  );
};

export default Board;
