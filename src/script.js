import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Immer from 'immer';
import './style.css';

import Buttons from './Buttons.js';
import Board from './Board.js';
import Toolbar from './Toolbar.js';

const e = React.createElement;

const Snapshots = ({ puzzle, snapshots, check, restoreSnapshot }) =>
  e(
    "div",
    {
      style: {
        display: "flex",
        flexWrap: 'wrap',
      }
    },
    ...snapshots.map(board =>
      e(
        "div",
        {
          style: {
            margin: "10px"
          },
          onClick: () => restoreSnapshot(board)
        },
        e(Board, { puzzle, board, check, squareSize: 100 / puzzle.size, makeOnClick: () => () => {} })
      )
    )
  );

const RowLabels = ({ size, squareSize }) =>
  e(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateRows: `repeat(${size}, ${squareSize}px)`,
      }
    },
    new Array(size).fill().map((_, i) =>
      e('div', { style: { margin: 'auto' } }, i + 1)
    )
  )

const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
const ColumnLabels = ({ size, squareSize }) =>
  e(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, ${squareSize}px)`,
      }
    },
    new Array(size).fill().map((_, i) =>
      e('div', { style: { margin: 'auto' } }, alphabet[i])
    )
  )

const Title = () =>
  e('h1',
    {
      style: {
        fontSize: '36px', fontFamily: 'sans-serif', fontStyle: 'italic',
        marginBottom: '25px',
        whiteSpace: 'nowrap'
      }
    },
    'STAR BATTLE PUZZLE PARTY'
  )

const App = () => {
  const [action, setAction] = React.useState("cross");
  const [puzzle, setPuzzle] = React.useState(null);
  const [currentPuzzle, setCurrentPuzzle] = React.useState(null);
  const [puzzleList, setPuzzleList] = React.useState(null);
  const [board, setBoard] = React.useState(null);
  const [snapshots, setSnapshots] = React.useState([]);
  const [check, setCheck] = React.useState(false);
  const socket = React.useRef(null);

  React.useEffect(() => {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${proto}//${location.host}/ws`);
    socket.current = ws;
    ws.addEventListener('message', event => {
      const { type, data } = JSON.parse(event.data);
      if (type === 'puzzle') setPuzzle(data);
      else if (type === 'board') setBoard(data);
      else if (type === 'puzzleSelection') {
        setPuzzleList(data.puzzleList);
        setCurrentPuzzle(data.currentPuzzle);
      }
      else if (type === 'snapshots') setSnapshots(data);
    });
    return () => ws.close();
  }, []);

  const send = (type, data) => {
    if (socket.current?.readyState === WebSocket.OPEN)
      socket.current.send(JSON.stringify({ type, data }));
  };

  const makeOnClick = (row, column) => () => {
    setBoard(
      Immer.produce(board, board => {
        const square = board[row][column];
        switch (action) {
          case "star":
          case "cross":
            square.icon = square.icon === action ? "" : action;
            break;
          default:
            square.color = square.color === action ? "" : action;
            break;
        }
      })
    );
    send('click', { row, column, action });
  };

  const takeSnapshot = () => send('takeSnapshot', null);

  const restoreSnapshot = board => {
    setBoard(board);
    send('restoreSnapshot', board);
  };

  const reset = () => send('reset', null);

  const choosePuzzle = puzzleName => send('choosePuzzle', puzzleName);

  return e(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: `1fr 25px ${500 + 4}px 25px 1fr`,
        gridTemplateRows: `1fr 25px ${500 + 4}px 25px 1fr`,
        gridTemplateAreas: `
          ".       .         title        . ."
          ".       .         columnLabels . ."
          "toolbar rowLabels board        . snapshots"
          ".       .         buttons      . ."
        `,
        maxHeight: '100vh',
        minHeight: '100vh',
      },
    },
    e('div', { style: { gridArea: 'title', alignSelf: 'end' }},
      e(Title),
    ),
    e('div', { style: { gridArea: 'columnLabels' } },
      puzzle && e(ColumnLabels, { size: puzzle.size, squareSize: 500 / puzzle.size })
    ),
    e('div', { style: { gridArea: 'toolbar', display: 'grid', placeItems: "center right", paddingRight: "25px" } },
      e(Toolbar, { action, setAction })
    ),
    e('div', { style: { gridArea: 'rowLabels' } },
      puzzle && e(RowLabels, { size: puzzle.size, squareSize: 500 / puzzle.size })
    ),
    e('div', { style: { gridArea: 'board'} },
      puzzle && board && board.length === puzzle.size &&
        e(Board, { action, puzzle, board, check, squareSize: 500 / puzzle.size, makeOnClick })
    ),
    e('div', { style: { gridArea: 'snapshots' } },
      puzzle && snapshots.length > 0 && snapshots[0].length === puzzle.size &&
        e(Snapshots, { puzzle, snapshots, check, restoreSnapshot })
    ),
    e('div', { style: { gridArea: 'buttons' } },
      e(
        Buttons,
        { currentPuzzle, puzzleList, choosePuzzle, check, setCheck, takeSnapshot, reset }
      )
    ),
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(e(App));
