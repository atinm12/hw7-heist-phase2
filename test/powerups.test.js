// Powerup progression, X-Ray and Stealth Mode.
(function () {
  T.add('powerups: cumulative across levels', () => {
    const a = T.load('l1').powerups;
    T.assert(!a.vents && !a.xray && !a.stealth, 'level 1 starts with nothing');
    const b = T.load('l2').powerups;
    T.assert(b.vents && b.xray && !b.stealth, 'level 2 has vents and x-ray');
    const c = T.load('l3').powerups;
    T.assert(c.vents && c.xray && c.stealth, 'level 3 has everything');
  });

  T.add('powerups: x-ray and stealth do nothing before they are earned', () => {
    const s = T.load('l1');
    T.press('x'); T.press('c');
    T.assert(!Heist.Powerups.xrayOn(s), 'no x-ray on level 1');
    T.assert(!s.player.stealth, 'no stealth on level 1');
  });

  T.add('powerups: x-ray runs for its time, then waits for the cooldown', () => {
    const s = T.load('l2'), C = Heist.CONFIG;
    T.press('x');
    T.assert(Heist.Powerups.xrayOn(s), 'x-ray on');
    T.run(C.XRAY_TIME + 0.1);
    T.assert(!Heist.Powerups.xrayOn(s), 'x-ray ended');
    T.press('x');
    T.assert(!Heist.Powerups.xrayOn(s), 'still cooling down');
    T.run(C.XRAY_COOLDOWN - C.XRAY_TIME);
    T.press('x');
    T.assert(Heist.Powerups.xrayOn(s), 'x-ray ready again');
  });

  T.add('powerups: stealth ignores lasers, ends on time, limited uses', () => {
    const s = T.load('l3'), C = Heist.CONFIG;
    T.teleport(8, 13);   // standing on the static server room beam
    s.flags.add('cams_off');
    T.press('c');
    T.assert(s.player.stealth, 'stealth on');
    T.run(C.STEALTH_TIME - 0.5);
    T.assert(s.status === 'playing', 'laser ignored while stealthed: ' + s.loseReason);
    T.teleport(5, 12);
    T.run(1);
    T.assert(!s.player.stealth, 'stealth ended');
    T.press('c'); T.run(C.STEALTH_TIME + 0.1);
    T.press('c');
    T.assert(!s.player.stealth, 'no uses left');
    T.assert(s.powerFx.stealthUses === 0, 'uses spent');
  });
})();
