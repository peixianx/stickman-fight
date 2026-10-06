STICKMAN ONLINE PARTY BRAWL — 2 TO 4 PLAYERS

WHAT CHANGED
- Network state is capped to 20 updates/sec instead of every animation frame.
- The server is authoritative for health/damage, reducing desync and hangs.
- Disconnects are removed cleanly from the room.
- Added dash (Shift or Space), hit sparks and screen shake.
- Fight Again resets everyone in the room without reloading.

Run locally:
1. Install Node.js.
2. Open a terminal in this folder.
3. Run: npm install
4. Run: npm start
5. Open http://localhost:3000

Deploy the whole folder to Render or another Node.js host. Start command: npm start

Controls: A/D or arrows move; W/up jump; F/K attack; G/L block; Shift/Space dash; 1-4 choose weapons.
