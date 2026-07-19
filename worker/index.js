import { GameRoom } from './GameRoom.js';
export { GameRoom };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/ws' && request.headers.get('Upgrade') === 'websocket') {
      const stub = env.GAME_ROOM.get(env.GAME_ROOM.idFromName('global'));
      return stub.fetch(request);
    }
    return new Response('Not found', { status: 404 });
  }
};
