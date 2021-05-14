import React from "https://cdn.skypack.dev/react";

const e = React.createElement;

const SnapshotButton = ({ takeSnapshot }) =>
  e(
    "button",
    {
      style: {
        margin: "10px"
      },
      onClick: takeSnapshot
    },
    "Snapshot"
  );

const Reset = ({ reset }) =>
  e(
    "button",
    {
      style: {
        margin: "10px"
      },
      onClick: reset
    },
    "Reset"
  );

const PuzzleList = ({ currentPuzzle, puzzleList, choosePuzzle }) => {
  return e(
    "select",
    {
      style: { margin: '10px '},
      onChange: e => choosePuzzle(e.currentTarget.value)
    },
    puzzleList.map(puzzleName =>
      e(
        "option",
        {
          value: puzzleName,
          selected: currentPuzzle === puzzleName
        },
        puzzleName
      )
    )
  )
}

const Checkbox = ({ check, setCheck }) => {
  return e(
    'button',
    {
      style: { margin: '10px '},
      onClick: () => setCheck(!check)
    },
    'Check',
    e('input',
      {
        type: 'checkbox',
        checked: check,
      }
    )
  )
}

const Buttons = ({ currentPuzzle, puzzleList, choosePuzzle, check, setCheck, takeSnapshot, reset }) =>
  e('div',
    {
      style: {
        marginTop: '25px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        // with the SVG board, clicking on top row board squares causes unexpected text selection
        userSelect: 'none'
      }
    },
    puzzleList && currentPuzzle &&
      e(PuzzleList, { currentPuzzle, puzzleList, choosePuzzle }),
    e(Checkbox, { check, setCheck }),
    e(SnapshotButton, { takeSnapshot }),
    e(Reset, { reset })
  )

export default Buttons;
