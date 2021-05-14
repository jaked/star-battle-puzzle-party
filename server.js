const Immer = require("immer");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

let current_puzzle = "2 star 10x10 #1";
const puzzles = {
  "1 star 5x5 #1": {
    stars: 1,
    size: 5,
    regions: [
      [0, 0, 1, 1, 1],
      [0, 0, 2, 2, 1],
      [3, 0, 2, 1, 1],
      [3, 3, 4, 4, 4],
      [3, 3, 3, 3, 3]
    ]
  },
  "1 star 5x5 #2": {
    stars: 1,
    size: 5,
    regions: [
      [0, 0, 1, 1, 1],
      [0, 1, 1, 2, 2],
      [3, 1, 4, 2, 2],
      [3, 3, 4, 2, 2],
      [3, 3, 2, 2, 2]
    ]
  },
  "2 star 10x10 #1": {
    stars: 2,
    size: 10,
    regions: [
      [0, 0, 1, 2, 2, 3, 3, 3, 4, 4],
      [0, 0, 1, 2, 2, 3, 3, 3, 4, 4],
      [0, 0, 1, 1, 2, 5, 5, 3, 4, 4],
      [0, 0, 1, 1, 2, 2, 5, 5, 5, 6],
      [0, 0, 1, 1, 2, 2, 5, 5, 5, 6],
      [7, 0, 0, 1, 1, 5, 5, 6, 6, 6],
      [7, 7, 7, 1, 1, 1, 1, 6, 6, 6],
      [7, 7, 7, 7, 8, 8, 8, 8, 8, 8],
      [9, 9, 9, 9, 9, 8, 8, 8, 8, 8],
      [9, 9, 9, 9, 9, 8, 8, 8, 8, 8]
    ],
    attribution: "https://www.puzzle-star-battle.com/?e=NTozLDM3Miw0MjQ="
  }
};

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

let globalBoard;

function initializeGlobalBoard(puzzleName) {
  const puzzle = puzzles[puzzleName];
  globalBoard = new Array(puzzle.size)
    .fill()
    .map((_, i) =>
      new Array(puzzle.size).fill().map((_, j) => ({ color: "", icon: "" }))
    );
}

initializeGlobalBoard(current_puzzle);

const snapshots = [];

function emitPuzzle(socket) {
  socket.emit("puzzle", puzzles[current_puzzle]);  
}

function emitBoard(socket) {
  socket.emit("board", globalBoard);
}

function emitSnapshots(socket) {
  socket.emit("snapshots", snapshots);  
}

function emitPuzzleSelection(socket) {
  socket.emit("puzzleSelection", {
    puzzleList: Object.keys(puzzles),
    currentPuzzle: current_puzzle,
  });
}

io.on("connection", socket => {
  emitPuzzle(socket);
  emitBoard(socket);
  emitSnapshots(socket);
  emitPuzzleSelection(socket);

  socket.on("click", ({ row, column, action }) => {
    globalBoard = Immer.produce(globalBoard, board => {
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
    });

    emitBoard(io);
  });

  socket.on("takeSnapshot", () => {
    snapshots.unshift(globalBoard);
    emitSnapshots(io);
  });

  socket.on("restoreSnapshot", board => {
    globalBoard = board;
    emitBoard(io);
  });

  socket.on("reset", () => {
    snapshots.splice(0, snapshots.length);
    initializeGlobalBoard(current_puzzle);
    emitBoard(io);
    emitSnapshots(io);
  });

  socket.on('choosePuzzle', (puzzleName) => {
    snapshots.splice(0, snapshots.length);
    current_puzzle = puzzleName;
    initializeGlobalBoard(current_puzzle);
    emitPuzzleSelection(io);
    emitSnapshots(io);
    emitPuzzle(io);
    emitBoard(io);
  });
});

const listener = server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
