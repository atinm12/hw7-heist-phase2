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
})();
