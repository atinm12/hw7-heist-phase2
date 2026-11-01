// Real-time playtest bot. Unlike the scripted playthroughs in levels.test.js,
// this walks every level with real keys, real collision and security ON
// (no teleporting, no stealth). It waits for lasers and tries to step around
// vision cones, so the final alert is a rough measure of level difficulty.
// Results are also stored on window.PLAYTEST for reading in a browser.
(function () {
  const S = () => Heist.CONFIG.TILE;
  const center = (t) => (t + 0.5) * S();
  const tileOf = (v) => Math.floor(v / S());
  const MOVE_KEYS = ['w', 'a', 's', 'd'];
  const LASER_HORIZON = 0.6;   // s a beam must stay off before stepping onto its tile
  const CONE_PATIENCE = 8;     // s to wait on a cone before walking through it
  const MAX_SECONDS = 600;

  // Steps: [tx, ty] walk there, { hack: [tx, ty] } walk and hold F,
  // { vent: [tx, ty] } climb in where you stand, crawl there and drop out.
  const ROUTES = {
    l1: [[2, 2], { hack: [35, 2] }, [18, 3], [18, 20]],
    l2: [[4, 16], { hack: [15, 15] }, [2, 2], [19, 2], { vent: [24, 4] },
      { hack: [27, 2] }, [35, 4], [2, 26]],
    l3: [[5, 3], { hack: [2, 23] }, { hack: [11, 16] }, [37, 2], [17, 2], { vent: [22, 4] },
      { hack: [25, 2] }, { hack: [13, 11] }, [31, 14], [20, 23]],
  };

  function staticLaserAt(s, tx, ty) {
    const p = s.player, U = Heist.Util;
    return s.security.lasers.some((l) => l.active && !(l.def.period > 0) &&
      U.distToSegment(center(tx), center(ty), l.x1, l.y1, l.x2, l.y2) < p.r + 2);
  }

  function passable(s, tx, ty) {
    const L = s.level;
    if (s.player.layer === 'vent') return Heist.Level.isVentWalkable(L, tx, ty);
    const d = L.doorAt[Heist.Level.key(tx, ty)];
    if (d && d.locked) return d.requires.startsWith('key:') && Heist.Tasks.check(s, d.requires);
    return !Heist.Level.isSolid(L, tx, ty) && !staticLaserAt(s, tx, ty);
  }

  // Breadth-first search; returns the next tile toward the goal.
  function nextTile(s, gx, gy) {
    const sx = tileOf(s.player.x), sy = tileOf(s.player.y);
    const from = new Map([[sx + ',' + sy, null]]);
    const queue = [[sx, sy]];
    while (queue.length) {
      const [x, y] = queue.shift();
      if (x === gx && y === gy) {
        let cur = [x, y], prev = from.get(x + ',' + y);
        if (!prev) return cur;
        while (from.get(prev[0] + ',' + prev[1])) { cur = prev; prev = from.get(prev[0] + ',' + prev[1]); }
        return cur;
      }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const n = (x + dx) + ',' + (y + dy);
        if (from.has(n) || !passable(s, x + dx, y + dy)) continue;
        from.set(n, [x, y]);
        queue.push([x + dx, y + dy]);
      }
    }
    return null;
  }

  function laserDanger(s, tx, ty) {
    const U = Heist.Util, x = center(tx), y = center(ty);
    return s.security.lasers.some((l) => {
      if (!l.active || U.distToSegment(x, y, l.x1, l.y1, l.x2, l.y2) >= s.player.r + 4) return false;
      for (let t = 0; t <= LASER_HORIZON; t += 0.05) {
        if (Heist.Security._laserPhaseOn(l.def, s.time + t)) return true;
      }
      return false;
    });
  }

  function coneDanger(s, tx, ty) {
    const U = Heist.Util, sec = s.security, x = center(tx), y = center(ty);
    const sees = (o, fov, range) => o.active && U.inCone(s.level, o.x, o.y, o.facing, U.deg(fov), range * S(), x, y);
    return sec.cameras.some((c) => sees(c, c.def.fov || 50, (c.def.range || 6) + 0.5)) ||
      sec.guards.some((g) => sees(g, g.def.fov || 70, (g.def.range || 5) + 0.5));
  }

  function setKeys(want) {
    MOVE_KEYS.forEach((k) => T.key(k, k === want ? 'keydown' : 'keyup'));
  }

  // One frame of walking; returns true once standing on the goal tile.
  function walkFrame(s, gx, gy, b) {
    const p = s.player;
    const cx = tileOf(p.x), cy = tileOf(p.y);
    if (cx === gx && cy === gy) { setKeys(null); return true; }
    const n = nextTile(s, gx, gy);
    if (!n) { setKeys(null); return false; }
    // The patience timer only resets on reaching a new tile, so the bot does
    // not stall forever at the edge of a cone.
    if (b.tile !== cx + ',' + cy) { b.tile = cx + ',' + cy; b.coneWait = 0; }
    const atCenter = Math.hypot(p.x - center(cx), p.y - center(cy)) < 4;
    if (atCenter && p.layer === 'main') {
      if (laserDanger(s, n[0], n[1])) { setKeys(null); return false; }
      if (b.coneWait < CONE_PATIENCE && coneDanger(s, n[0], n[1]) && !coneDanger(s, cx, cy)) {
        b.coneWait += 1 / 60;
        setKeys(null);
        return false;
      }
    }
    const dx = center(n[0]) - p.x, dy = center(n[1]) - p.y;
    // Line up on the other axis first so the player fits through doors.
    if (n[1] !== cy) setKeys(Math.abs(dx) >= 3 ? (dx < 0 ? 'a' : 'd') : (dy < 0 ? 'w' : 's'));
    else setKeys(Math.abs(dy) >= 3 ? (dy < 0 ? 'w' : 's') : (dx < 0 ? 'a' : 'd'));
    return false;
  }

  function playLevel(id) {
    const s = T.load(id);
    // Uncap the counter so the run reports total exposure, not just where it died.
    const realMax = s.alertMax;
    s.alertMax = 1e9;
    const b = { coneWait: 0 };
    const tick = () => Heist.Game.step(1 / 60);
    const stillGoing = () => s.status === 'playing' && s.time < MAX_SECONDS;
    const walk = (x, y) => { while (stillGoing() && !walkFrame(s, x, y, b)) tick(); setKeys(null); };

    for (const step of ROUTES[id]) {
      if (step.hack) {
        walk(step.hack[0], step.hack[1]);
        T.key('f', 'keydown');
        const c = s.level.computers.find((o) => o.x === step.hack[0] && o.y === step.hack[1]);
        while (stillGoing() && !c.hacked) tick();
        T.key('f', 'keyup');
      } else if (step.vent) {
        T.press('q');
        T.run(0.3);
        walk(step.vent[0], step.vent[1]);
        T.press('e');
        T.run(0.2);
      } else {
        walk(step[0], step[1]);
      }
      if (s.status !== 'playing') break;
    }
    setKeys(null);
    tick();
    return { id, status: s.status, reason: s.loseReason, alert: Math.round(s.alert), max: realMax, time: Math.round(s.time),
      at: [tileOf(s.player.x), tileOf(s.player.y)], px: [Math.round(s.player.x), Math.round(s.player.y)],
      flags: [...s.flags], keys: [...s.player.keys], treasure: s.player.hasTreasure };
  }

  window.PLAYTEST = {};
  ['l1', 'l2', 'l3'].forEach((id) => {
    T.add(`playtest ${id}: bot wins with security on`, function () {
      // Drawing is not needed here and would make the long runs slow.
      const realDraw = Heist.Render.draw;
      Heist.Render.draw = () => {};
      try {
        const r = playLevel(id);
        window.PLAYTEST[id] = r;
        T.assert(r.status === 'won' && r.alert < r.max, JSON.stringify(r));
        this.name += ` (alert ${r.alert}/${r.max}, ${r.time}s)`;
      } finally {
        Heist.Render.draw = realDraw;
      }
    });
  });
})();
