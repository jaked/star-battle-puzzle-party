import { puzzles } from './puzzles.js';

function initBoard(name) {
  const { size } = puzzles[name];
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ color: '', icon: '' }))
  );
}

export class GameRoom {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.currentPuzzle = '2 star 10x10 #1';
    this.globalBoard = initBoard(this.currentPuzzle);
    this.snapshots = [];
  }

  async fetch(request) {
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    this._send(server, 'puzzle', puzzles[this.currentPuzzle]);
    this._send(server, 'board', this.globalBoard);
    this._send(server, 'snapshots', this.snapshots);
    this._send(server, 'puzzleSelection', {
      puzzleList: Object.keys(puzzles),
      currentPuzzle: this.currentPuzzle,
    });
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, message) {
    const { type, data } = JSON.parse(message);
    switch (type) {
      case 'click': {
        const { row, column, action } = data;
        const sq = this.globalBoard[row][column];
        if (action === 'star' || action === 'cross')
          sq.icon = sq.icon === action ? '' : action;
        else
          sq.color = sq.color === action ? '' : action;
        this._broadcast('board', this.globalBoard);
        break;
      }
      case 'takeSnapshot':
        this.snapshots.unshift(JSON.parse(JSON.stringify(this.globalBoard)));
        this._broadcast('snapshots', this.snapshots);
        break;
      case 'restoreSnapshot':
        this.globalBoard = data;
        this._broadcast('board', this.globalBoard);
        break;
      case 'reset':
        this.snapshots = [];
        this.globalBoard = initBoard(this.currentPuzzle);
        this._broadcast('board', this.globalBoard);
        this._broadcast('snapshots', this.snapshots);
        break;
      case 'choosePuzzle':
        this.snapshots = [];
        this.currentPuzzle = data;
        this.globalBoard = initBoard(this.currentPuzzle);
        this._broadcast('puzzleSelection', { puzzleList: Object.keys(puzzles), currentPuzzle: this.currentPuzzle });
        this._broadcast('snapshots', this.snapshots);
        this._broadcast('puzzle', puzzles[this.currentPuzzle]);
        this._broadcast('board', this.globalBoard);
        break;
    }
  }

  webSocketClose(ws, code, reason) { ws.close(code, reason); }
  webSocketError(ws, error) { console.error(error); }

  _send(ws, type, data) { ws.send(JSON.stringify({ type, data })); }
  _broadcast(type, data) {
    const msg = JSON.stringify({ type, data });
    for (const ws of this.ctx.getWebSockets()) {
      try { ws.send(msg); } catch (_) {}
    }
  }
}
